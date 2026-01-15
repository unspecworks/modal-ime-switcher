# Modal IME Switcher

[English Docs](README.md) | [**한국어 문서 (Korean Docs)**](README_KO.md)

**Modal IME Switcher** is a VS Code extension designed for modal editing users (Vim, Helix, Dance, etc.) who use multiple input methods (e.g., English and Korean/Chinese/Japanese).

It automatically switches your system Input Method Editor (IME) based on the current editor mode (detected via cursor style), ensuring you never have to manually switch back to English when entering Normal Mode.

## Features

- **Auto-Switch to Normal IME**: Automatically switches to your preferred "Normal Mode" IME (e.g., English) when you enter Normal Mode (Block cursor).
- **Smart Restore**: Saves your used IME (e.g., Korean) when leaving Insert Mode and restores it when you re-enter Insert Mode.
- **Window Focus Handling**:
  - **Blur**: Restores your "typing" IME when you switch to another application, so you can continue typing in your native language.
  - **Focus**: Re-enforces the "Normal Mode" IME when you return to VS Code if it is in Normal Mode.
- **Lightweight**: Uses `im-select` binary for fast and reliable IME switching.

## Requirements

This extension requires **[im-select](https://github.com/daipeihust/im-select)** to be installed on your system.

### macOS

```bash
brew install im-select
```

### Windows

Download `im-select.exe` from the [official repository](https://github.com/daipeihust/im-select) and ensure it is in your system PATH or specify its path in settings.

## Extension Settings

You only need to configure the settings for **Normal Mode**. The extension handles Insert Mode automatically by saving and restoring your state.

### `modalImeSwitcher.normalModeIme` (Required)

The IME ID to switch to when entering Normal Mode.

- Example (macOS English): `com.apple.keylayout.ABC`
- Example (Windows English): `1033`

> **Tip**: You can find your current IME ID by running `im-select` in your terminal.

### `modalImeSwitcher.normalModeCursorStyles`

A list of cursor styles that define "Normal Mode". The default is `["block"]`, which is standard for most Vim extensions.

- Options: `block`, `block-outline`, `line`, `line-thin`, `underline`, `underline-thin`
- Default: `["block"]`

### `modalImeSwitcher.imSelectBinary`

Path to the `im-select` executable.

- Default: `im-select` (assumes it is in your PATH).

## Example Configuration

Add this to your `settings.json`:

```json
{
  "modalImeSwitcher.normalModeIme": "com.apple.keylayout.ABC",
  "modalImeSwitcher.normalModeCursorStyles": ["block", "block-outline"]
}
```

## How it Works

1.  **Entering Normal Mode**: When your cursor changes to a Block (or other configured style), the extension checks your current IME. If it's different from `normalModeIme`, it saves the current IME (e.g., Korean) and switches to `normalModeIme` (English).
2.  **Entering Insert Mode**: When your cursor changes to a Line (or any non-Normal style), if there was a saved IME, it restores it.
3.  **Multitasking**: If you click away from VS Code (Blur), it restores your saved IME so you can chat or type in other apps. When you click back (Focus), if VS Code is still in Normal Mode, it switches back to English.

## Known Issues

- Requires `im-select` installation.
- Some modal extensions might use non-standard cursor styles, which can be configured via `normalModeCursorStyles`.

## Release Notes

### 0.0.1

- Initial release.
- Support for Smart IME Save/Restore.
- Window Focus/Blur handling.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This extension inspired by and references the following projects:

- [**noime**](https://github.com/guohao117/noime): VS Code extension for keeping input method in English on Dance.
- [**im-select**](https://github.com/daipeihust/im-select): CLI tool to switch input method from terminal.
