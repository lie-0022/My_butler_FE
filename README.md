# My Butler - Frontend

나만의 버틀러 앱 React Native(Expo) 프론트엔드

## 기술 스택

- Expo SDK 54 / React Native 0.81.5
- React 19 + TypeScript
- Expo Router v6 (파일 기반 라우팅)
- Zustand (상태 관리)
- Axios (API 통신)

## 시작하기

### 사전 준비

- Node.js 18 이상
- 스마트폰에 **Expo Go** 앱 설치 ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 설치

```bash
git clone https://github.com/lie-0022/My_butler_FE.git
cd My_butler_FE
npm install
```

### 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어서 백엔드 서버 주소를 입력하세요:

```
EXPO_PUBLIC_API_BASE_URL=http://<내 IP 주소>:8080
```

> 내 IP 확인: Windows `ipconfig`, Mac/Linux `ifconfig`  
> 스마트폰과 PC가 **같은 Wi-Fi**에 연결되어 있어야 합니다.

### 실행

```bash
npx expo start
```

터미널에 QR코드가 뜨면 Expo Go 앱으로 스캔하세요.

## 프로젝트 구조

```
app/                  # 화면 (Expo Router 파일 기반 라우팅)
  (auth)/             # 로그인 · 회원가입 · 비밀번호 재설정
  (onboarding)/       # 온보딩 플로우
  (tabs)/             # 메인 탭 화면
src/
  api/                # Axios API 클라이언트 · 엔드포인트
  store/              # Zustand 전역 상태
  types/              # TypeScript 타입 정의
  constants/          # 색상 등 상수
```

## 브랜치 전략

| 브랜치        | 용도                  |
| ------------- | --------------------- |
| `main`        | 배포 가능한 안정 버전 |
| `develop`     | 통합 개발 브랜치      |
| `feat/기능명` | 기능 개발             |
| `fix/버그명`  | 버그 수정             |

> 작업은 `feat/` 또는 `fix/` 브랜치에서 하고 `develop`으로 PR 올려주세요.
