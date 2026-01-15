import * as cp from 'child_process';
import * as vscode from 'vscode';

export class ImSelect {
    private binaryPath: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('modalImeSwitcher');
        this.binaryPath = config.get<string>('imSelectBinary', 'im-select');
    }

    public async switchIme(imeId: string): Promise<void> {
        console.log(`[ModalIMESwitcher] Attempting to switch IME to: ${imeId}`);
        return new Promise((resolve, reject) => {
            cp.exec(`${this.binaryPath} ${imeId}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`[ModalIMESwitcher] Error switching IME to ${imeId}: ${err} ${stderr}`);
                    resolve(); 
                    return;
                }
                console.log(`[ModalIMESwitcher] Successfully switched IME to: ${imeId}`);
                resolve();
            });
        });
    }

    public async getCurrentIme(): Promise<string> {
        return new Promise((resolve, reject) => {
            cp.exec(this.binaryPath, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error getting current IME: ${stderr}`);
                    resolve('');
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }

    public updateConfig() {
        const config = vscode.workspace.getConfiguration('modalImeSwitcher');
        this.binaryPath = config.get<string>('imSelectBinary', 'im-select');
    }
}
