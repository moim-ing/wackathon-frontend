<div align="center">
  <div align="center">
    <img src="public/muCheckPicon.svg" width="150" />
    <h1>MuCheck</h1>
  </div>
  <p align="center">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </p>
</div>

## 소리로 출석을 인증하는, 뮤첵

**뮤첵**은 수업 현장에서 재생 중인 음악을 기반으로 출석을 인증하고, 호스트가 세션별 출석 현황을 관리할 수 있는 웹 서비스입니다. [wackathon.moiming.app](https://wackathon.moiming.app)에서 사용해볼 수 있습니다.

이곳은 뮤첵의 프론트엔드 저장소입니다. 게스트/호스트 실행 흐름을 모두 포함하며, 개발 환경에서 MSW 기반 API 모킹을 지원합니다. 백엔드 저장소는 [moim-ing/wackathon-backend](https://github.com/moim-ing/wackathon-backend)에 있습니다.

## 시작하기

다음 명령어를 입력하여 개발 페이지를 실행합니다.

```bash
yarn
yarn dev
```

[http://localhost:5173](http://localhost:5173)에 접속하여 결과를 확인합니다.

## 협업하기

### 폴더 구조

- `api`
  - API 요청 함수를 정의합니다.
  - 도메인(`auth`, `classes`, `sessions`, `users`, `participation`) 단위로 파일을 관리합니다.
- `components`
  - 공통 UI 컴포넌트와 도메인 컴포넌트를 정의합니다.
- `hooks`
  - 비즈니스 로직과 서버 상태 관리를 위한 커스텀 훅을 정의합니다.
- `layouts`
  - 게스트/호스트 레이아웃을 정의합니다.
- `routes`
  - 페이지(라우트)를 정의합니다.
- `types`
  - API 응답 및 도메인 타입을 정의합니다.
- `utils`
  - YouTube/날짜 관련 유틸 함수를 정의합니다.
- `mocks`
  - MSW(Mock Service Worker)를 이용한 API 모킹 로직을 관리합니다.
  - `db/`: 모킹에 사용되는 기반 데이터(Mock Data)를 정의하고 관리합니다.
  - `handlers/`: 기능/도메인별 API 핸들러를 분리하여 정의합니다.

## 🛠 기술 스택

| Category | Technology |
| :--- | :--- |
| **State** | Zustand, TanStack Query |
| **UI & UX** | Tailwind CSS, shadcn/ui, Framer Motion, Lucide React |
| **Routing** | React Router |
| **Networking** | Axios, MSW |
| **Dev Tools** | Vite, Biome, Knip, TypeScript |
| **Deployment** | AWS S3, AWS CloudFront, GitHub Actions |


## 기여자

| [박준영(@young-52)](https://github.com/young-52) | [이준엽(@jun-0411)](https://github.com/jun-0411) |
| :---: | :---: |
| <a href="https://github.com/young-52"><img src="https://avatars.githubusercontent.com/u/25864819?v=4" width="150"></a> | <a href="https://github.com/jun-0411"><img src="https://avatars.githubusercontent.com/u/202625805?v=4" width="150"></a> |
| UI/UX 디자인 <br> 호스트 실행 흐름 구현 | API 설계 및 구현 <br> 게스트 실행 흐름 구현 |
