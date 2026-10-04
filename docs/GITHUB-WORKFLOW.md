# GitHub 연결과 자동 반영

저장소: [gmlduqzhd123-lab/Making-Film](https://github.com/gmlduqzhd123-lab/Making-Film)

서비스: [엽쌤스쿨 영상제작기](https://gmlduqzhd123-lab.github.io/Making-Film/)

## Codex에서 수정할 때

이 작업 폴더의 Git 원격 `origin`은 위 저장소를 가리킵니다. 사용자의 요청에 따라 Codex는 수정 작업을 완료하고 필요한 검증을 마치면 `main`에 커밋·반영합니다. 반복해서 ZIP을 다운로드해 수동 업로드할 필요가 없습니다. 이 처리 방식은 저장소 루트의 `AGENTS.md`에도 기록했습니다.

쓰기에는 저장소 소유자 `gmlduqzhd123-lab`의 연결된 GitHub 계정을 사용합니다. 이 PC의 Git 명령에 인증 정보가 없으면 Codex GitHub 연결을 통해 같은 파일 트리를 커밋하고 `main`을 갱신한 다음 로컬 저장소와 동기화합니다. 계정 토큰은 앱 코드나 README에 넣지 않습니다.

앱 안에서 프로젝트·장면을 수정하는 것은 브라우저 LocalStorage에 저장하는 작업입니다. GitHub 자동 반영은 Codex에서 앱 소스 변경을 완료할 때 적용됩니다.

## Pages 배포 확인

`main`에 반영하면 기존 GitHub Pages 배포가 시작됩니다. GitHub **Actions**에서 `pages build and deployment`의 완료 상태를 확인하거나 서비스 주소를 엽니다. 이전 화면이 남으면 Ctrl+Shift+R로 새로고침합니다.

별도 서버·DB·Vercel 배포를 추가하지 않습니다. 작업 중 다른 사람이 원격 저장소를 바꾼 경우 해당 변경을 보존하고 통합하며 강제로 덮어쓰지 않습니다.

## 직접 Git 명령을 사용할 때

Codex GitHub 연결과 터미널의 Git 로그인은 별개입니다. 직접 `git push`를 실행하려면 이 PC에서 Git Credential Manager 등의 GitHub 로그인이 필요합니다. Codex의 연결된 GitHub 도구를 사용하는 작업에는 이 추가 로그인이 필요하지 않습니다.
