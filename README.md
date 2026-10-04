# 엽쌤스쿨 영상제작기

**웹앱 하나, 영상 한 편.** 교사가 만든 교육 웹앱의 화면과 특징으로 소개영상 콘티, 내레이션, 자막과 자동재생 HTML 영상을 만드는 정적 웹앱입니다.

HTML / CSS / Vanilla JavaScript만 사용합니다. 빌드, npm 설치, 계정, API Key가 필요하지 않습니다. 서버·DB·Vercel·Supabase·Firebase와 외부 CDN 라이브러리는 사용하지 않습니다.

**v1.1 추가:** PRD 파일 또는 붙여넣은 텍스트에서 웹앱 정보를 추출하고, 이미지 없이도 소개영상 초안을 바로 생성할 수 있습니다.

## 바로 실행하기

1. 이 폴더 전체를 다운로드하거나 압축을 풉니다.
2. **`index.html`을 Chrome 또는 Edge에서 엽니다.** 파일을 더블클릭해도 됩니다.
3. 처음 안내를 닫고 **샘플 열기**를 누르면 완성된 60초 영상을 바로 확인할 수 있습니다.

권장 환경은 최신 데스크톱 Chrome / Edge, 가로 화면 태블릿입니다. 앱은 `file://`에서도 실행되며 네트워크 연결을 요구하지 않습니다. 브라우저나 보안 설정이 파일의 LocalStorage를 제한하면 JSON 다운로드를 이용하세요. 다운로드한 HTML만 다른 폴더로 이동하면 편집기 CSS/JS를 찾을 수 없으므로 앱 폴더 전체를 함께 보관해야 합니다. 단독 HTML 영상 출력물은 한 파일만 옮겨도 됩니다.

## 첫 소개영상 만들기

PRD가 있으면 홈의 **PRD로 영상 만들기** 또는 제작 화면 STEP 1의 **PRD 넣고 자동 작성**을 이용하세요. 파일을 선택하거나 본문을 붙여 넣고 **PRD 분석하기 → 추출 내용 확인 → 이 PRD로 영상 만들기**로 진행합니다. 자세한 형식과 업데이트 방법은 [PRD 사용 안내](docs/PRD-GUIDE.md)에 있습니다.

TXT·MD·JSON(2MB 이하), DOCX·HWPX(12MB 이하)의 본문을 지원합니다. 본문은 20만 자 이하입니다. PDF·HWP는 텍스트를 붙여 넣어 주세요. 외부 AI 없이 항목·제목·목록을 읽는 방식이므로 추출한 기능과 추천 설정을 확인해 주세요. 문서의 그림·표 배치와 스캔 이미지 OCR은 가져오지 않습니다.

PRD로 만든 초안에는 스크린샷이 없어도 9개 장면, 대본, 자막과 재생 화면이 생성됩니다. STEP 3에서 처음 이미지를 올리면 빈 장면에 자동 연결되며 수정한 대본은 유지됩니다. 기존 프로젝트를 보관하고 새 프로젝트로 생성합니다. 원문 전체는 저장하지 않고 추출 정보와 파일명 등 메타데이터만 프로젝트에 보관합니다.

직접 입력하는 기존 방식은 아래와 같습니다.

1. **내 웹앱 영상 만들기**를 선택합니다.
2. **등록:** 이름, URL, 한 줄 소개, 분야, 교과, 학년, 활용 유형을 입력합니다. URL은 링크 용도이며 자동 분석하거나 화면을 캡처하지 않습니다.
3. **특징:** 중요한 기능을 최대 5개 입력합니다. 드래그 또는 ↑ 버튼으로 중요도 순서를 바꿉니다. 로그인·접근 방법, 소요 시간, 참여 방식은 알고 있는 내용만 입력합니다.
4. **화면:** 실제 스크린샷을 최소 1장 올립니다. PNG/JPG/WEBP, 한 장당 20MB 이하를 지원합니다. 여러 장 선택하거나 끌어다 놓을 수 있고 1920px 이하로 리사이즈합니다. WebP 변환은 체크박스로 선택합니다.
5. **스타일:** 30/45/60/90초, 영상 목적·분위기·대상과 8개 스타일 중 하나를 선택합니다.
6. **제작:** 영상 구성 만들기를 누릅니다. 9개 장면과 콘셉트, 핵심 메시지, 내레이션, 자막, 전환과 BGM 추천이 생성됩니다.
7. **편집:** 오른쪽 카드에서 문구, 내레이션, 이미지, 역할, 장면 길이와 효과를 바꿉니다. 드래그 또는 ↑/↓로 정렬하고 추가·복제·삭제할 수 있습니다. 화면 자료의 이미지를 장면 카드에 끌어다 놓아도 됩니다.
8. **재생:** ▶, 일시정지, 처음으로, ±10초, 시간 슬라이더, 음소거, CC 자막, 전체화면을 이용합니다. 아래 타임라인의 장면을 클릭해 바로 이동할 수 있습니다.
9. **다운로드:** 품질 안내를 확인하고 HTML 또는 영상 ZIP을 내려받습니다. 수정 원본은 `project.json`으로 따로 보관하세요.

장면 길이는 1–120초이며 시작·종료 시간은 앞 장면에 이어지도록 계산됩니다. 편집 후 전체 시간이 목표 길이와 달라지면 결과 화면에 표시됩니다. 영상 구성을 다시 만들면 현재 장면이 대체되며 되돌리기로 복구할 수 있습니다.

## 저장과 다른 기기로 이동

- 입력 변경 후 **1초**에 LocalStorage 자동 저장. 상단에 저장 상태 표시.
- **프로젝트 저장:** 이 브라우저에 저장. 홈의 내 프로젝트에서 수정·복제·삭제·JSON 다운로드.
- **JSON 저장 / project.json:** 이미지와 업로드 음악까지 포함한 원본 다운로드.
- **프로젝트 불러오기:** 원본 JSON을 선택하면 장면·이미지·음악·효과 복원.
- LocalStorage는 기기와 브라우저, 사이트 origin별로 분리됩니다. 브라우저 데이터 삭제 시 사라집니다. `file://`에서 사용한 프로젝트를 Pages로 옮길 때도 JSON을 이용하세요.
- 이미지나 음악이 많아 저장 용량을 넘으면 **JSON 저장 필요**를 표시합니다. 편집은 계속할 수 있으며 JSON 다운로드로 보관합니다. 대용량 이미지·음악은 장면 이력에도 포함되므로 파일 용량을 줄여 쓰는 것이 좋습니다.
- 불러오기는 v1 JSON, 80MB 이하, 장면·이미지 각각 100개 이하를 지원합니다. 외부 이미지 주소가 아닌 이미지 데이터가 포함된 원본을 사용하세요.

## 내보내기 파일

| 출력 | 내용 |
|---|---|
| `project.json` | 다시 편집하는 원본. 이미지·음악 데이터 포함 |
| `scenes.json` | 장면, 시작·종료 시간, 자막, 내레이션과 효과 데이터 |
| `subtitles-ko.srt` | 장면별 내레이션을 기준으로 만든 한국어 자막 |
| `narration-ko.txt` | 장면 시간과 제목이 포함된 내레이션 대본 |
| `video.html` | 이미지·음악·플레이어가 모두 포함된 독립 HTML 영상 |
| `my-video.zip` | 상대 경로의 이미지·음악과 HTML 플레이어, 자막·대본·원본 |
| Codex / AI 영상 프롬프트 | 복사 및 TXT 다운로드. 외부 AI 요청은 실행하지 않음 |

ZIP을 압축 해제하면 다음처럼 배치됩니다.

```text
index.html
style.css
app.js
project.json
data/scenes.json
assets/images/...
assets/audio/...
subtitles/subtitles-ko.srt
scripts/narration-ko.txt
scripts/codex-prompt.txt
scripts/ai-video-prompts.txt
README.md
```

내보낸 `index.html`은 바로 영상 페이지를 열고 자동재생합니다. 브라우저 자동재생 정책에 따라 음악은 재생 버튼을 눌러야 들릴 수 있습니다. HTML과 ZIP은 **MP4 파일이 아닙니다.** 내레이션은 대본·자막이며 음성이 자동으로 합성되어 포함되지는 않습니다.

ZIP은 클라이언트에서 작성하는 UTF-8 ZIP STORE 형식으로, CRC32를 포함합니다. JSZip 등 외부 라이브러리 없이 압축 파일을 만들며 파일을 추가 압축하지 않습니다.

## 음악과 내레이션

제작 단계의 배경음악 설정에서 자신의 MP3/WAV/OGG 파일을 넣습니다. 파일당 15MB 이하, 볼륨 0–100%, 페이드 인·아웃과 반복 재생을 지원합니다. 장면 효과음은 오른쪽 편집기에서 연결합니다. 기본 음악·효과음 음원은 제공하지 않습니다.

전체 내레이션 탭에서 복사, TXT/SRT 다운로드와 한국어 미리듣기를 사용할 수 있습니다. 미리듣기는 운영체제에 설치된 한국어 SpeechSynthesis 음성이 필요하며, 없는 환경에서는 안내 메시지를 보여줍니다. 음질은 브라우저에 따라 다르고 타임라인과 자동 동기화되지는 않습니다.

## 단축키

| 키 | 동작 |
|---|---|
| Space | 재생 / 일시정지 |
| Ctrl+S / Cmd+S | 브라우저 프로젝트 저장 |
| Ctrl+Z / Cmd+Z | 되돌리기 |
| Ctrl+Shift+Z / Cmd+Shift+Z | 다시 실행 |
| Ctrl+D / Cmd+D | 선택한 장면 복제 |
| Delete | 선택한 장면 삭제 |
| Enter / Space | 포커스한 장면 선택 / 업로드 버튼 실행 |
| 방향키 / Home / End | 결과 탭 이동 |

입력창에서는 글자 편집 키가 우선합니다. 장면 변경 이력은 최대 40단계 보관하며 다시 프로젝트를 열면 이력이 초기화됩니다.

## GitHub Pages 배포

대상 저장소: [gmlduqzhd123-lab/Making-Film](https://github.com/gmlduqzhd123-lab/Making-Film)

이 작업 폴더는 위 저장소에 연결되어 있습니다. 사용자의 요청에 따라 Codex에서 완료한 변경사항은 검증 후 `main`에 직접 반영하며, 기존 Pages 설정으로 배포됩니다. [GitHub 자동 반영 안내](docs/GITHUB-WORKFLOW.md). 아래는 직접 파일을 업로드하거나 새로 Pages를 설정할 때의 방법입니다.

1. **이 폴더의 내용물**을 저장소의 루트에 올립니다. `index.html`이 저장소 루트에 있어야 합니다. `.git` 폴더는 업로드하지 않습니다.
2. GitHub **Settings → Pages → Build and deployment**를 엽니다.
3. Source를 **Deploy from a branch**, Branch를 **main**, Folder를 **/(root)**로 선택하고 Save합니다.
4. Pages 배포가 성공하면 `https://gmlduqzhd123-lab.github.io/Making-Film/`에서 확인합니다.

참고: [GitHub 공식 Pages 배포 설정 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

직접 파일을 올리는 경우에는 v1.1 ZIP을 풀고 **내용물**을 저장소 루트에 덮어 올려 커밋합니다. ZIP 파일 자체나 상위 폴더를 올리지 않습니다. Pages가 `main / (root)`를 사용하도록 설정되어 있으면 커밋 후 다시 배포됩니다.

앱과 출력 영상은 상대 경로를 사용합니다. `/Making-Film/` 같은 프로젝트 경로에서도 작동하며 화면 전환은 해시 경로로 처리하여 별도 라우팅 서버가 필요하지 않습니다. `.nojekyll`을 포함합니다. 실제 Pages URL은 배포 후 확인해야 하며, 현재 검증은 같은 하위 경로 구조의 로컬 정적 호스팅에서 수행했습니다.

## 파일 구조와 유지보수

```text
index.html
css/                      # 색상, 레이아웃, UI, 편집, 반응형, 가독성
js/app.js                 # 홈, 프로젝트 관리, 라우팅, 단축키
js/store/projectStore.js  # 프로젝트, 저장, Undo/Redo
js/modules/               # 콘티, 이미지·음악, 품질, 자막, 프롬프트, ZIP·출력
js/modules/prdImporter.js # PRD 항목 추출, 텍스트·DOCX·HWPX 본문 읽기
js/ui/editor.js           # Wizard, 장면 편집, 결과·타임라인 UI
js/ui/prdImport.js        # PRD 입력, 추출 내용 확인, 초안 만들기
js/ui/player.js           # 편집기와 내보내기가 공유하는 타임라인·애니메이션·음악
data/                     # JSON 사전 + file:// 호환 오프라인 catalog.js
sample-projects/          # 6개 독립 JSON 샘플
assets/                   # 로고와 자체 제작 예시 화면
tools/sync-catalog.cjs    # 선택적 유지보수 도구
tests/e2e.cjs             # 개발용 브라우저 검증
tests/prd-parser.cjs      # PRD 파서 검증 (Node 기본 모듈)
tests/prd-e2e.cjs         # PRD 파일·초안·저장·출력 브라우저 검증
docs/                     # PRD 대비표, 검증 기록, 사용법
```

`file://`에서 fetch나 ES module import가 제한되는 환경을 고려하여 클래식 스크립트 모듈과 하나의 `YVM` 네임스페이스를 사용합니다. JSON 사전과 샘플은 오프라인 `data/catalog.js`에도 포함되어 있습니다. JSON 사전·샘플을 수정하는 개발자만 `node tools/sync-catalog.cjs`로 카탈로그를 갱신합니다. 이미 동기화된 파일을 제공하므로 사용·배포에 빌드는 필요하지 않습니다.

샘플은 **예시 화면**이며 실제 앱이나 경기 정보의 검증된 캡처가 아닙니다. 사용 시 실제 서비스 스크린샷으로 교체하세요. 내레이션과 교육적 문구도 입력한 내용에 맞게 검토해야 합니다. 품질 점수는 템플릿 규칙 기반 참고값입니다.

## 검증과 남은 범위

[검증 기록](docs/TEST-REPORT.md), [PRD 구현·미구현 체크리스트](docs/PRD-STATUS.md), [간단 사용 안내](docs/USER-GUIDE.md)를 확인하세요.

v1.1 변경 검증은 [PRD 기능 검증 기록](docs/PRD-TEST-REPORT.md)에 정리했습니다. DOCX/HWPX 본문 읽기는 브라우저의 `DecompressionStream`과 `DOMParser`를 사용합니다. 지원하지 않는 브라우저에서는 TXT 저장 또는 붙여넣기를 안내합니다. 추가 라이브러리는 없습니다.

개발용 테스트는 Node와 Playwright가 있는 환경에서 실행합니다. 앱 실행에 이 도구들은 필요하지 않습니다.

```sh
node tests/e2e.cjs
node tests/prd-parser.cjs
node tests/prd-e2e.cjs
```

Playwright가 다른 경로에 있으면 `PLAYWRIGHT_MODULE` 환경변수에 해당 모듈 경로를 지정할 수 있습니다. Chrome을 기본으로 사용하며 Edge는 `YVM_BROWSER_CHANNEL=msedge`로 검사할 수 있습니다. `YVM_TEST_OUTPUT`으로 테스트 산출물 위치를 정할 수 있습니다. 테스트의 임시 HTTP 서버는 Pages 상대 경로 검증에만 사용되며, 제품에는 서버가 포함되지 않습니다.

MP4, 녹음·AI TTS, 자동 사이트 분석·캡처, AI 이미지/영상 API, YouTube 메타데이터, 다크모드는 이번 버전에 포함하지 않습니다.
