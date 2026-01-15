# Modal IME Switcher

[English Docs](README.md) | **한국어 문서 (Korean Docs)**

**Modal IME Switcher**는 여러 입력 언어(예: 영어와 한국어/중국어/일본어 등)를 사용하는 모달 편집기 사용자(Vim, Helix, Dance 등)를 위한 VS Code 확장 프로그램입니다.

커서 스타일을 통해 현재 에디터 모드를 감지하여 시스템 입력기(IME)를 자동으로 전환해 줍니다. 덕분에 Normal 모드로 진입할 때마다 수동으로 영문 모드로 전환할 필요가 없습니다.

## 주요 기능 (Features)

- **Normal 모드 자동 전환**: Normal 모드(블록 커서) 진입 시 자동으로 설정된 "Normal 모드" IME(예: 영어)로 전환합니다.
- **스마트 복구 (Smart Restore)**: Insert 모드를 떠날 때 사용 중이던 IME(예: 한국어)를 저장하고, 다시 Insert 모드로 진입할 때 이를 복구합니다.
- **창 포커스 처리 (Window Focus Handling)**:
  - **포커스 잃음 (Blur)**: VS Code에서 다른 애플리케이션으로 전환할 때, 저장된 "입력용" IME를 복구하여 다른 앱에서도 자연스럽게 모국어로 입력할 수 있게 합니다.
  - **포커스 얻음 (Focus)**: VS Code로 돌아왔을 때 여전히 Normal 모드라면, 다시 "Normal 모드" IME를 강제 적용합니다.
- **가벼운 실행**: `im-select` 바이너리를 사용하여 빠르고 안정적으로 IME를 전환합니다.

## 필수 요구사항 (Requirements)

이 확장 프로그램은 시스템에 **[im-select](https://github.com/daipeihust/im-select)**가 설치되어 있어야 합니다.

### macOS

```bash
brew install im-select
```

### Windows

[공식 저장소](https://github.com/daipeihust/im-select)에서 `im-select.exe`를 다운로드하여 시스템 PATH에 추가하거나 설정에서 경로를 지정하세요.

## 확장 프로그램 설정 (Extension Settings)

**Normal 모드**에 대한 설정만 하면 됩니다. Insert 모드는 확장 프로그램이 자동으로 상태를 저장하고 복구합니다.

### `modalImeSwitcher.normalModeIme` (필수)

Normal 모드 진입 시 전환할 IME ID입니다.

- 예시 (macOS 영어): `com.apple.keylayout.ABC`
- 예시 (Windows 영어): `1033`

> **팁**: 터미널에서 `im-select`를 실행하면 현재 사용 중인 IME ID를 확인할 수 있습니다.

### `modalImeSwitcher.normalModeCursorStyles`

"Normal 모드"로 간주할 커서 스타일 목록입니다. 기본값은 대부분의 Vim 확장 프로그램에서 사용하는 `["block"]`입니다.

- 옵션: `block`, `block-outline`, `line`, `line-thin`, `underline`, `underline-thin`
- 기본값: `["block"]`

### `modalImeSwitcher.imSelectBinary`

`im-select` 실행 파일의 경로입니다.

- 기본값: `im-select` (PATH에 있다고 가정)

## 설정 예시 (Example Configuration)

`settings.json`에 다음 설정을 추가하세요:

```json
{
  "modalImeSwitcher.normalModeIme": "com.apple.keylayout.ABC",
  "modalImeSwitcher.normalModeCursorStyles": ["block", "block-outline"]
}
```

## 동작 방식 (How it Works)

1.  **Normal 모드 진입**: 커서가 블록(또는 설정된 스타일)으로 변경되면, 확장 프로그램이 현재 IME를 확인합니다. 설정된 `normalModeIme`와 다를 경우, 현재 IME(예: 한국어)를 저장하고 `normalModeIme`(영어)로 전환합니다.
2.  **Insert 모드 진입**: 커서가 라인(또는 Normal 모드가 아닌 스타일)으로 변경될 때, 저장된 IME가 있다면 이를 복구합니다.
3.  **멀티태스킹**: VS Code 외부를 클릭(Blur)하면 저장된 IME를 복구하여 메신저나 브라우저에서 바로 입력할 수 있습니다. 다시 VS Code를 클릭(Focus)했을 때 여전히 Normal 모드라면, 자동으로 영어로 전환됩니다.

## 알려진 문제 (Known Issues)

- `im-select` 설치가 필요합니다.
- 일부 모달 확장 프로그램이 비표준 커서 스타일을 사용할 경우, `normalModeCursorStyles`를 통해 설정을 조정해야 할 수 있습니다.

## 릴리스 노트 (Release Notes)

### 0.0.1

- 초기 릴리스.
- 스마트 IME 저장/복구 기능 지원.
- 창 포커스/블러 처리 지원.

## 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 참고 프로젝트 (Acknowledgments)

이 확장 프로그램은 다음 프로젝트에서 영감을 받았거나 참고했습니다:

- [**noime**](https://github.com/guohao117/noime): Dance에서 IME를 영어로 유지해주는 VS Code 확장 프로그램.
- [**im-select**](https://github.com/daipeihust/im-select): 터미널에서 입력기를 전환할 수 있는 CLI 도구.
