# PRD 기능 검증 기록 — v1.1

검증일: 2026-10-04. Windows의 Chrome·Edge, Playwright와 로컬 파일 실행으로 점검했습니다.

| 검사 | 결과 |
|---|---|
| 순수 PRD 파서 검사 | 15개 통과 |
| Chrome PRD 브라우저 검사 | 24개 통과 |
| Edge PRD 브라우저 검사 | 24개 통과 |
| 기존 전체 기능 회귀 검사 | 30개 통과 |
| 페이지·콘솔 오류 | 0건 |
| PRD 처리 중 외부 네트워크 요청 | 0건 |

## 확인한 흐름

- 홈·STEP 1 진입, 파일 선택·드롭과 텍스트 붙여넣기, 결과 확인·수정
- 한국어·영어·제목·표·JSON·MVP 목록, 향후 목록 제외, 최대 5개 기능, 추천 기본값
- 이미지 없는 45초·9개 장면 생성·재생·재생성·즉시 저장
- 기존 프로젝트를 보관하면서 새 초안 생성
- 첫 이미지 자동 배치 후 수정한 내레이션 유지
- 원본 JSON 다시 불러오기, SRT 다운로드, 이미지 없는 독립 HTML 재생과 영상 ZIP 출력
- TXT·MD·JSON, UTF-16 텍스트, 압축된 DOCX/HWPX, 압축하지 않은 DOCX, DOCX 본문 수동 줄바꿈
- HWPX의 여러 섹션을 숫자 순서로 읽기
- 빈 문서·손상 파일·PDF·크기 초과 오류 안내
- 분석 후 본문 수정 시 이전 결과 숨기기, 진행 중 파일 읽기가 새 예시 입력을 덮어쓰지 않음
- 문서 안 HTML이 실행되지 않음, 태블릿 1024px 화면의 입력 접근성·가로 넘침

기존 30개 회귀 검사는 이미지·장면 편집, 순서·시간, 저장·Undo, 샘플, 음원·효과, 자막·프롬프트·HTML·ZIP 출력과 `/Making-Film/` 하위 경로 정적 호스팅을 포함합니다. 제품에 테스트 서버를 추가하지 않았습니다.

DOCX/HWPX 검사는 표준 본문 XML과 ZIP 구조를 가진 생성된 테스트 문서를 사용했습니다. 모든 한컴·Word 문서나 실제 태블릿 기기의 호환성을 보장하는 검사는 아닙니다. 실사용 문서의 서식·이미지는 가져오지 않습니다. 실제 GitHub Pages의 업데이트 배포 후 확인은 원격 업로드 뒤 진행해야 합니다.

## 재현

```sh
node tests/prd-parser.cjs
node tests/prd-e2e.cjs
node tests/e2e.cjs
```

브라우저 검사는 Playwright와 Chrome이 있는 개발 환경에서 실행합니다. Edge는 `YVM_BROWSER_CHANNEL=msedge`를 설정합니다. `PLAYWRIGHT_MODULE`로 모듈 경로, `YVM_TEST_OUTPUT`으로 결과 폴더를 지정할 수 있습니다. 앱 사용자에게 Node·Playwright 설치는 필요하지 않습니다.

기계 판독 결과: `verification-prd-chrome.json`, `verification-prd-edge.json`, `verification-v1.1-regression.json`. 원래 v1.0의 검증 기록은 [TEST-REPORT.md](TEST-REPORT.md)에 있습니다.
