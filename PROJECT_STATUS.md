# PROJECT_STATUS.md

> 작성일: 2026-05-06
> 대상 브랜치: `develop`
> Expo SDK: **54** / React Native: **0.81.5** / React: **19.1.0**

---

## 1. 의존성 현황

### 1-1. dependencies (런타임)

| 카테고리                       | 패키지                                    | 현재 버전  | SDK 54 권장       | 상태 |
| ------------------------------ | ----------------------------------------- | ---------- | ----------------- | ---- |
| **코어**                       | expo                                      | `~54.0.0`  | 54.x              | ✅   |
| **코어**                       | react                                     | `19.1.0`   | 19.1.0            | ✅   |
| **코어**                       | react-native                              | `0.81.5`   | 0.81.x            | ✅   |
| **네비게이션 (라우터)**        | expo-router                               | `~6.0.23`  | 6.x               | ✅   |
| **네비게이션 (코어)**          | @react-navigation/native                  | `^7.0.14`  | 7.x               | ✅   |
| **네비게이션 (제스처/스크린)** | react-native-gesture-handler              | `~2.28.0`  | 2.28.x            | ✅   |
| **네비게이션 (제스처/스크린)** | react-native-screens                      | `~4.16.0`  | 4.16.x            | ✅   |
| **네비게이션 (제스처/스크린)** | react-native-safe-area-context            | `~5.6.0`   | 5.6.x             | ✅   |
| **애니메이션**                 | react-native-reanimated                   | `~4.1.1`   | 4.1.x             | ✅   |
| **애니메이션**                 | react-native-worklets                     | `0.5.1`    | Reanimated 4 종속 | ✅   |
| **상태관리**                   | zustand                                   | `^5.0.2`   | —                 | ✅   |
| **네트워크**                   | axios                                     | `^1.7.9`   | —                 | ✅   |
| **저장소 (기기 보안)**         | expo-secure-store                         | `~15.0.8`  | 15.x              | ✅   |
| **저장소 (일반)**              | @react-native-async-storage/async-storage | `2.2.0`    | 2.2.x             | ✅   |
| **에셋/폰트**                  | expo-asset                                | `~12.0.12` | 12.x              | ✅   |
| **에셋/폰트**                  | expo-font                                 | `~14.0.11` | 14.x              | ✅   |
| **시스템 UI**                  | expo-splash-screen                        | `~31.0.13` | 31.x              | ✅   |
| **시스템 UI**                  | expo-status-bar                           | `~3.0.9`   | 3.x               | ✅   |

### 1-2. devDependencies

| 패키지       | 버전       | 비고 |
| ------------ | ---------- | ---- |
| @babel/core  | `^7.25.2`  | ✅   |
| @types/react | `~19.1.10` | ✅   |
| typescript   | `^5.3.3`   | ✅   |

### 1-3. SDK 54 권장이지만 **빠진 것** (디자인 작업 시작 전 합치는 게 유리)

| 영역                 | 권장 패키지                                            | 이유                                                                                           |
| -------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **아이콘**           | `@expo/vector-icons` 또는 `lucide-react-native`        | `(tabs)/_layout.tsx`에서 이모지(🏠/👤)로 임시 처리. 디자인 시 필수                             |
| **이미지 최적화**    | `expo-image`                                           | RN `Image`보다 캐싱·블러허시·메모리 효율 우수                                                  |
| **폼/검증**          | `react-hook-form` + `zod` (또는 `@hookform/resolvers`) | 현재 `useState` 4~6개로 폼 상태 직접 관리 → 화면 늘면 비대칭 폭증                              |
| **서버 상태**        | `@tanstack/react-query`                                | `useEffect + useState + try/catch` 패턴이 모든 화면에 반복됨. 캐싱·재검증·낙관적 업데이트 부재 |
| **날짜 입력**        | `@react-native-community/datetimepicker`               | `step2.tsx`에서 생년월일을 텍스트 입력으로 받고 있음                                           |
| **화면 가드/제스처** | `expo-haptics`, `expo-linking`                         | 알림/피드백 등 디테일 작업 시                                                                  |
| **린트**             | `eslint`, `eslint-config-expo`, `prettier`             | `package.json`에 `lint` 스크립트만 있고 dev에 의존성 없음 → 실행 불가                          |
| **테스트**           | `jest-expo`, `@testing-library/react-native`           | 현재 없음 (선택)                                                                               |

---

## 2. 프로젝트 구조 매핑

```
my-butler-app/
├── app/                            # expo-router 파일 기반 라우팅
│   ├── _layout.tsx                 ✅ 루트 Stack + GestureHandlerRoot + authStore.initialize()
│   ├── index.tsx                   ✅ isAuthenticated 따라 (tabs) 또는 (auth)/login 리다이렉트
│   ├── (auth)/
│   │   ├── _layout.tsx             ✅ Stack (slide_from_right)
│   │   ├── login.tsx               ✅ 풀 구현 (153줄)
│   │   ├── register.tsx            ✅ 풀 구현 (220줄, 아이디 중복확인 포함)
│   │   └── forgot-password.tsx     ✅ 풀 구현 (115줄, 메일 발송 → sent 상태)
│   ├── (onboarding)/
│   │   ├── _layout.tsx             ✅ Stack (gestureEnabled: false로 뒤로가기 차단)
│   │   ├── step2.tsx               ✅ 이름/생년월일/성별 (Step 1은 회원가입과 통합된 듯)
│   │   └── step3.tsx               ✅ 카테고리 chip 8종
│   └── (tabs)/
│       ├── _layout.tsx             ✅ Tabs (홈/프로필) — 아이콘은 이모지 임시
│       ├── index.tsx               ⚠️ 골격만: 헤더+버틀러카드+"준비 중" 빈박스
│       └── profile.tsx             ⚠️ 골격만: 아바타 이니셜+메뉴 3개(전부 onPress 없음)+로그아웃
│
├── src/
│   ├── api/
│   │   ├── client.ts               ✅ axios 인스턴스, 토큰 인터셉터, refresh 큐, 전역 logout 이벤트 (160줄)
│   │   ├── auth.ts                 ✅ 7개 엔드포인트
│   │   └── user.ts                 ✅ 5개 엔드포인트
│   ├── store/
│   │   └── authStore.ts            ✅ Zustand 단일 store
│   ├── types/
│   │   ├── auth.ts                 ✅ 6개 타입
│   │   └── user.ts                 ✅ 6개 타입
│   └── constants/
│       └── colors.ts               ⚠️ 색만 존재. spacing/typography/radius 없음
│
├── assets/                         (확인 안 함 — 아이콘/스플래시 기본 에셋만 추정)
├── app.json                        ✅ newArchEnabled, expo-router/expo-secure-store 플러그인, typedRoutes
├── babel.config.js                 ✅ babel-preset-expo + reanimated/plugin
├── tsconfig.json                   ✅ strict, paths(@/*, ~/*)
├── .env.example                    ✅ EXPO_PUBLIC_API_BASE_URL
├── .gitignore                      ✅
├── package.json                    ✅
└── README.md                       ✅
```

> **빈 placeholder는 없음.** 모든 라우트 파일이 실제 코드를 가지고 있음. 다만 `(tabs)/index.tsx`와 `(tabs)/profile.tsx`의 메뉴 항목들은 핸들러 미연결 상태.

---

## 3. 라우팅 현황

### 그룹 구조

| 그룹           | 라우트                             | \_layout.tsx 설정                                                    |
| -------------- | ---------------------------------- | -------------------------------------------------------------------- |
| `(auth)`       | login / register / forgot-password | Stack, headerShown: false, animation: slide_from_right               |
| `(onboarding)` | step2 / step3                      | Stack, headerShown: false, **gestureEnabled: false** (이탈 방지)     |
| `(tabs)`       | index / profile                    | Tabs, 활성색=primary, 이모지 아이콘                                  |
| 루트           | `app/index.tsx`                    | `isAuthenticated`에 따라 `(tabs)` 또는 `(auth)/login`로 `<Redirect>` |

### 흐름 다이어그램

```
앱 시작 → app/_layout.tsx (initialize 호출)
        ↓
        app/index.tsx (Redirect)
        ├─ 토큰 있음 → (tabs)/index
        └─ 토큰 없음 → (auth)/login
                       ↓
                       register → (onboarding)/step2 → step3 → (tabs)
```

### ⚠️ 라우팅 이슈

- **인증 가드 부재**: `(tabs)`/`(onboarding)` 그룹에 별도 가드 없음. 토큰을 직접 지우거나 딥링크로 진입하면 보호되지 않음. (현재는 `app/index.tsx`의 단발 리다이렉트에 전적으로 의존)
- **온보딩 Step 1 누락**: `step2`, `step3`만 있음. 회원가입 자체가 Step 1 역할이라면 명시 필요(파일명 `step1`이 비어 있어 혼동).
- **`(tabs)/_layout.tsx:40`**: `function TabIcon` 안에서 `require('react-native')` 동적 require 사용 → 정적 `import` 권장 (번들러 최적화·타입 측면).

---

## 4. 상태 관리 현황 (`src/store/`)

| 스토어         | 관리 상태                              | 액션                                    |
| -------------- | -------------------------------------- | --------------------------------------- |
| `authStore.ts` | `isAuthenticated`, `isLoading`, `user` | `initialize()`, `setUser()`, `logout()` |

### 관찰

- `authEventEmitter`(api/client.ts)의 `'logout'` 이벤트를 store에서 구독 → 인터셉터의 refresh 실패 시 자동 로그아웃 동작.
- **Persist 미적용**: 앱 재시작 시 `user` 객체는 항상 `null`로 시작. 토큰만 SecureStore에 영구 저장됨 → 첫 진입 후 `getMyProfile()` 호출 필수 (현재 `(tabs)/index.tsx`에서 처리).
- 다른 도메인(예: 추천, 채팅, 알림 등) 스토어 없음.

---

## 5. API 레이어 현황 (`src/api/`)

### Axios 클라이언트(`client.ts`)

- baseURL: `${EXPO_PUBLIC_API_BASE_URL}/api/v1`
- timeout: 10s
- 요청 인터셉터: `Authorization: Bearer <accessToken>` 자동 첨부
- 응답 인터셉터:
  - `Set-Cookie`에서 `refresh_token` 추출 → SecureStore에 수동 저장
  - 401 → `/auth/refresh` 호출 → 새 토큰으로 원 요청 재시도
  - 동시 401 처리를 위한 `failedQueue` 직렬화 큐
  - refresh 실패 시 `tokenStorage.clear()` + `authEventEmitter.emit('logout')`
- `tokenStorage`: SecureStore 래퍼(access/refresh)

### 엔드포인트

| 모듈        | 함수                 | 메서드 + 경로                        |
| ----------- | -------------------- | ------------------------------------ |
| **authApi** | checkUsername        | GET `/auth/check-username?username=` |
|             | register             | POST `/auth/register`                |
|             | login                | POST `/auth/login`                   |
|             | refresh              | POST `/auth/refresh`                 |
|             | logout               | POST `/auth/logout`                  |
|             | requestPasswordReset | POST `/auth/password/reset-request`  |
|             | resetPassword        | POST `/auth/password/reset`          |
| **userApi** | getMyProfile         | GET `/users/me`                      |
|             | updateProfile        | PATCH `/users/me/profile`            |
|             | savePreferences      | POST `/users/me/preferences`         |
|             | getPreferences       | GET `/users/me/preferences`          |
|             | updateUsername       | PATCH `/users/me/username`           |

---

## 6. 타입 정의 현황 (`src/types/`)

- **auth.ts**: `LoginRequest`, `RegisterRequest`, `TokenResponse`, `ApiResponse<T>`, `PasswordResetRequest`, `PasswordResetConfirm`
- **user.ts**: `UserProfileResponse`, `UpdateProfileRequest`, `UserPreferenceResponse`, `SavePreferencesRequest`, `UpdateUsernameRequest`, `UsernameResponse`

> 비어 있는 도메인: 추천/콘텐츠, 채팅, 알림, 공통(에러/페이지네이션) 등.

---

## 7. 디자인 시스템 현황 (`src/constants/`)

### 있음

- `colors.ts` — 12개 색상 상수 (`primary`, `primaryDark`, `secondary`, `background`, `surface`, `text`, `textSecondary`, `border`, `error`, `success`, `white`, `black`)

### 없음 (디자인 작업 들어가기 전 만들어야 함)

- `spacing.ts` (4/8/12/16/20/24/32 단위) — 현재 모든 화면에서 매직 넘버로 박혀 있음
- `typography.ts` (heading/body/caption 사이즈·weight·lineHeight)
- `radius.ts` (8/12/16/20/30) — `borderRadius: 12` 등이 화면마다 반복
- `shadows.ts`
- `theme.ts` 또는 다크모드 대응 (`app.json`은 `light` 고정)
- 공용 컴포넌트(Button/Input/Chip/Card) 없음 → 모든 화면에서 `TouchableOpacity` + 같은 `StyleSheet`를 매번 다시 작성 중

---

## 8. 환경 설정

### `.env.example`

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

### `app.json` 핵심 설정

- `newArchEnabled: true` (New Architecture 활성)
- `userInterfaceStyle: light` (다크모드 미지원)
- plugins: `expo-router`, `expo-secure-store`
- `experiments.typedRoutes: true` (라우트 타입 자동 생성)
- scheme: `mybutler` (딥링크)
- ⚠️ **JSON 문법 경고**: `app.json:19`의 `"output": "static",` 뒤 trailing comma가 있음. Expo가 관대하게 파싱해주지만 표준 JSON으로는 오류.

### `tsconfig.json`

- `extends: expo/tsconfig.base`
- `strict: true`
- 경로 별칭:
  - `@/*` → `./src/*`
  - `~/*` → `./*`

---

## 9. 누락된 베스트 프랙티스

| 항목                     | 상태                                                                                    | 메모                                     |
| ------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| ESLint                   | ❌ **스크립트만 있고 의존성 없음** (`package.json:10`의 `"lint": "eslint ."` 실행 불가) | `eslint`, `eslint-config-expo` 추가 필요 |
| Prettier                 | ❌ 없음                                                                                 | `.prettierrc` + `prettier` devDep        |
| EditorConfig             | ❌ 없음                                                                                 | (선택)                                   |
| Husky / lint-staged      | ❌ 없음                                                                                 | (선택, 팀 단위면 권장)                   |
| Jest / Testing           | ❌ 없음                                                                                 | (선택)                                   |
| `.gitignore`             | ✅ 적절 (.env, .expo, node_modules, 인증서 등 포함)                                     |
| README                   | ✅ 있음 (1820 bytes)                                                                    |
| CI(GitHub Actions 등)    | ❌ 없음                                                                                 |
| 에러 바운더리            | ❌ 없음                                                                                 |
| 분석/모니터링(Sentry 등) | ❌ 없음                                                                                 |

### 코드 레벨 잔잔한 이슈

- `app/(tabs)/_layout.tsx:40` `require('react-native')` → 정적 import로
- `(tabs)/index.tsx:33`의 `useEffect` deps 배열에 `setUser` 누락 (lint 켜면 잡힘)
- 모든 화면에서 `error: unknown` 캐스팅을 인라인으로 5~6번 반복 → `parseApiError(err)` 헬퍼로 추출 가능

---

## 10. 다음 작업을 위한 준비도

### 디자인을 코드로 옮길 때 즉시 시작 가능한가?

**부분적으로 가능.** 화면 골격과 라우팅, API, 인증 흐름은 이미 동작 가능한 상태이지만, **디자인 시스템 토큰**과 **공용 컴포넌트**가 비어 있어서 디자인을 그대로 옮기면 매 화면에서 매직 넘버·중복 스타일이 폭증한다.

### 권장 순서 (디자인 작업 직전 셋업 우선순위)

1. **디자인 토큰 분리** (`spacing`/`typography`/`radius`/`shadows`) — 색상만 있는 현 상태로 디자인 시안을 옮기면 후속 변경이 매우 비싸짐
2. **공용 컴포넌트 1차 셋업**: `Button`, `Input`, `Chip`, `Card` — 현재 6개 화면에 거의 동일 코드가 산재
3. **아이콘 라이브러리** 결정·설치 (`@expo/vector-icons` 또는 `lucide-react-native`) — `(tabs)` 탭바·메뉴·뒤로가기 등 즉시 필요
4. **폼 라이브러리**(`react-hook-form` + `zod`) — register/login/step2가 가장 큰 수혜자
5. **TanStack Query** — 화면이 늘기 전에 도입해야 비용이 작음
6. **ESLint/Prettier 활성화** — 디자인 작업 중 코드 흐트러짐 방지

---

## 🎯 지금 즉시 해야 할 일 TOP 5

1. **디자인 시스템 토큰 파일 추가** — `src/constants/`에 `spacing.ts`, `typography.ts`, `radius.ts` 신규 작성. 기존 `colors.ts`와 함께 `index.ts`로 re-export. _디자인을 코드로 옮기기 전 가장 큰 ROI._
2. **공용 UI 컴포넌트 폴더 신설** — `src/components/ui/`에 `Button`, `TextField`, `Chip`, `ScreenContainer` 4종. 6개 화면의 중복 `StyleSheet`를 해소하는 토대.
3. **아이콘 라이브러리 설치 + `(tabs)/_layout.tsx` 교체** — `@expo/vector-icons` 또는 `lucide-react-native` 도입. 동시에 `require('react-native')` 정적 import로 정리.
4. **ESLint 의존성 추가**(`eslint`, `eslint-config-expo`, `@typescript-eslint/*`) + `eslint.config.js` 생성. `package.json:10`의 `lint` 스크립트가 실제 동작하도록. Prettier도 함께.
5. **TanStack Query 도입 + `(tabs)/index.tsx`·`profile.tsx` 마이그레이션** — `useEffect+useState+try/catch` 패턴이 늘기 전에 표준화. `authStore.user`도 query 캐시로 통합 가능.

> 보너스(준-즉시): `app.json:19` trailing comma 제거, `(tabs)/index.tsx`의 `useEffect` deps 정리, `parseApiError(err)` 공용 헬퍼 추출.
