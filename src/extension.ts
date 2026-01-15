import * as vscode from 'vscode';
import { ImSelect } from './im-select';

/* eslint-disable @typescript-eslint/naming-convention */
let imSelect: ImSelect;
let normalModeCursorStyles: vscode.TextEditorCursorStyle[] = [];
let normalModeIme: string = '';
let savedIme: string | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "modal-ime-switcher" is now active!');

	imSelect = new ImSelect();
	loadConfig();

	// Listen for configuration changes
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('modalImeSwitcher')) {
			loadConfig();
			imSelect.updateConfig();
		}
	}));

	// Listen for active text editor changes
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
            // New editor focused. Check if we need to switch to Normal IME.
            // We do NOT save IME here blindly, because previous state is unknown/mixed.
            // But if we are in Normal Mode, we must enforce Normal IME.
			checkAndSwitch(editor, false);
		}
	}));

	// Listen for text editor options changes (cursor style changes)
	context.subscriptions.push(vscode.window.onDidChangeTextEditorOptions(e => {
		checkAndSwitch(e.textEditor, true);
	}));

    // Listen for window state changes (focus/blur)
    context.subscriptions.push(vscode.window.onDidChangeWindowState(async e => {
        if (e.focused) {
            // Window gained focus.
            // If active editor is in Normal Mode, ensure Normal IME.
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                 checkAndSwitch(editor, false);
            }
        } else {
            // Window lost focus.
            // If we have a saved IME, restore it so the user has their "typing" IME back in other apps.
            // (Assuming global IME or user preference).
            if (savedIme) {
                console.log(`[ModalIMESwitcher] Window blur. Restoring saved IME: ${savedIme}`);
                await imSelect.switchIme(savedIme);
                // Do NOT clear savedIme, because when we come back, if we are still in Normal Mode, 
                // we switch to Normal IME, but we still want to hold this saved IME for when we eventually go to Insert.
            }
        }
    }));
}

function loadConfig() {
	const config = vscode.workspace.getConfiguration('modalImeSwitcher');
    const styles = config.get<string[]>('normalModeCursorStyles', ['block']);
    normalModeIme = config.get<string>('normalModeIme', '');
    
    // Map string styles to TextEditorCursorStyle enum
    normalModeCursorStyles = styles.map(s => {
        switch(s) {
            case 'line': return vscode.TextEditorCursorStyle.Line; // 1
            case 'block': return vscode.TextEditorCursorStyle.Block; // 2
            case 'underline': return vscode.TextEditorCursorStyle.Underline; // 3
            case 'line-thin': return vscode.TextEditorCursorStyle.LineThin; // 4
            case 'block-outline': return vscode.TextEditorCursorStyle.BlockOutline; // 5
            case 'underline-thin': return vscode.TextEditorCursorStyle.UnderlineThin; // 6
            default: return vscode.TextEditorCursorStyle.Block;
        }
    });

    console.log('[ModalIMESwitcher] Configuration loaded:');
    console.log(`[ModalIMESwitcher] normalModeIme: ${normalModeIme}`);
    console.log(`[ModalIMESwitcher] normalModeCursorStyles: ${JSON.stringify(styles)} (${JSON.stringify(normalModeCursorStyles)})`);
}

async function checkAndSwitch(editor: vscode.TextEditor, captureSave: boolean) {
    if (!normalModeIme) {
        return;
    }

	const cursorStyle = editor.options.cursorStyle;
    if (cursorStyle === undefined) {
        return;
    }

    const isNormalMode = normalModeCursorStyles.includes(cursorStyle);

    if (isNormalMode) {
        // We are in (or entering) Normal Mode.
        const currentIme = await imSelect.getCurrentIme();
        
        // If current IME is NOT the Normal Mode IME, we might need to save it.
        // We only save if 'captureSave' is true (i.e., we just transitioned styling).
        // Or if we just focused window? Actually, if we focus window, we don't want to save "random" system IME probably?
        // User request: "inactive -> active ... simple check".
        // Let's rely on captureSave for saving.
        // Wait, if I am in Insert (Korean), and I click outside (Blur), then click back inside (Focus).
        // Focus -> checkAndSwitch(false). isNormalMode = false. Do nothing.
        // Result: Korean stays. Correct.
        
        // Case: In Insert (Korean), Press Esc -> Normal Mode.
        // checkAndSwitch(true). isNormalMode = true.
        // currentIme = Korean. normalModeIme = English.
        // captureSave = true.
        // Save Korean. Switch to English. Correct.
        
        if (currentIme !== normalModeIme) {
            if (captureSave) {
                savedIme = currentIme;
                console.log(`[ModalIMESwitcher] Entering Normal Mode. Saved IME: ${savedIme}`);
            } else {
                 // Not capturing (e.g. window focus). But current is wrong?
                 // If I focus window and I am in Normal Mode, but IME is Korean?
                 // I should switch to English.
                 // Should I save Korean? Maybe it's useful?
                 // If I tabbed out to Chrome (Korean), tabbed back.
                 // savedIme is ALREADY Korean (from previous capture).
                 // So we don't need to overwrite it.
            }
        }
        
        if (currentIme !== normalModeIme) {
             console.log(`[ModalIMESwitcher] Switching to Normal Mode IME: ${normalModeIme}`);
             await imSelect.switchIme(normalModeIme);
        }
    } else {
        // We are NOT in Normal Mode (e.g., Insert Mode).
        // If we have a saved IME, restore it.
        if (savedIme) {
             console.log(`[ModalIMESwitcher] Exiting Normal Mode (or Blur restore). Restoring saved IME: ${savedIme}`);
             await imSelect.switchIme(savedIme);
             // We used it. Should we clear it? 
             // If I type in Insert, then Esc -> Normal (save new).
             // If I toggle Insert -> settings -> Insert.
             // It's safer to clear it to avoid "stuck" old IME?
             // But logic "active -> inactive" uses savedIme.
             // If I clear it here, and then Blur window? 
             // If I am in Insert Mode, savedIme IS cleared.
             // So Blur from Insert Mode -> nothing happens. (Correct, leave as is).
             savedIme = undefined; 
        }
    }
}

export function deactivate() {}
