# CLAUDE.md

> Claude Code가 매 세션마다 자동으로 읽는 컨텍스트 파일.
> 이 프로젝트의 모든 코드 작업은 아래 규칙·결정사항을 기준으로 한다.

---

## 1. Project Overview

- **앱 이름**: 나만의 버틀러 (My Butler)
- **목적**: 홈 바 / 칵테일 인벤토리(My Bar) + 레시피 + 커뮤니티를 결합한 모바일 서비스. 사용자가 보유한 술병의 잔량을 관리하고, 만들 수 있는 칵테일을 제안하며, 같은 취향의 사용자들과 게시글로 소통한다.
- **타겟 사용자**: 홈텐딩에 관심 있는 20~30대. 취향과 소장품을 기록하고 싶어 하는 사용자.
- **기술 스택**:
  - Expo SDK **54**, React Native **0.81.5**, React **19.1.0**
  - TypeScript (strict)
  - **Expo Router v6** (파일 기반 라우팅, `experiments.typedRoutes: true`)
  - **Zustand** (클라이언트 상태)
  - **Axios** (HTTP, refresh 토큰 인터셉터 구현됨)
  - **expo-secure-store** (토큰 영구 저장)
  - **react-native-svg + expo-linear-gradient** (Bottle/CocktailGlass 일러스트)
  - **expo-image** (이미지 최적화)
  - **react-hook-form + zod + @hookform/resolvers** (폼 처리·검증)
  - **@react-native-community/datetimepicker** (생년월일 등 날짜 입력)
  - **@tanstack/react-query** (서버 상태, 작업 18 이후 본격 사용)
- **타겟 디바이스**: **Galaxy S24 FE (393 × 854 dp)** 기준으로 디자인 검증됨. iOS/Android 양쪽 지원.
- **디자인 무드**: **Warm Amber, editorial, bar-counter metaphor** (위스키 바 카운터에서 영감)
- **다크모드**: MVP 미지원 (라이트 고정, `app.json: userInterfaceStyle: "light"`)

---

## 2. 절대 규칙 (Always)

- **함수형 컴포넌트만** 사용. 클래스 컴포넌트 금지.
- **Props는 `interface`로 선언** (type alias 대신).
- **`StyleSheet.create()` 사용**. NativeWind / styled-components 사용 안 함.
- **모든 색상·간격·폰트·라디우스·섀도는 `src/constants/`의 토큰에서만 import**. 매직 넘버(예: `padding: 14`, `fontSize: 16`) 금지.
- **SafeArea는 `react-native-safe-area-context`의 `useSafeAreaInsets()` 훅** 사용. `<SafeAreaView>` 컴포넌트 사용 금지.
- **인터랙티브 요소(버튼·입력·터치 가능한 행 등)에 `testID` prop 추가**. 형식: `testID="login-submit"`, `testID="bar-row-${id}"`.
- **한국어 UI 텍스트 하드코딩 OK** (i18n 도입 전까지).
- **새 라이브러리 추가 시 `npx expo install <pkg>`** 사용 (SDK 54 호환 버전 자동 선택). `npm install` 금지.

---

## 3. 절대 금지 (Never)

- `console.log` 커밋 금지. 디버그 후 반드시 제거.
- **`any` 타입 사용 금지**. 정확한 타입을 모르면 `unknown` 후 좁히기.
- **인라인 스타일 금지** (`style={{ padding: 16 }}` 형태). `StyleSheet.create()`로 추출.
- **긴 리스트에 `ScrollView` 금지** → `FlatList` (또는 필요 시 `SectionList`).
- **`TouchableOpacity` 금지** → `Pressable` (시각 피드백은 `({ pressed }) => ...` 패턴).
- **`localStorage` / `sessionStorage` 사용 금지** → Zustand `persist` 미들웨어 또는 `expo-secure-store`.

---

## 4. 폴더 구조

| 영역 | 경로 | 비고 |
|---|---|---|
| 화면 (라우트) | `app/` | Expo Router 파일 기반 |
| 공용 UI 컴포넌트 | `src/components/ui/` | Button, Input, Chip, Card 등 |
| 일러스트 SVG | `src/components/illustrations/` | Bottle, CocktailGlass, IngChip |
| 비즈니스 로직 훅 | `src/hooks/` | useXxx.ts |
| API 클라이언트 | `src/api/` | client.ts + 도메인별 모듈 |
| Zustand 스토어 | `src/store/` | 도메인별 분리 |
| 타입 | `src/types/` | 도메인별 분리 |
| 디자인 토큰 | `src/constants/` | colors / spacing / typography / radius / shadows |
| 디자인 인계 자료 | `design/` | **참조 전용. 코드 import 금지** |

---

## 5. 디자인 시스템 토큰 매핑

`design/tokens.css`의 CSS 변수를 RN 토큰 파일로 분리하는 매핑표 (작업 6에서 실제 파일 생성 예정):

| RN 파일 | 포함할 토큰 | 비고 |
|---|---|---|
| `src/constants/colors.ts` | `--ink-*`, `--paper-*`, `--amber-*`, `--brass*`, `--ok-*`, `--warn-*`, `--danger-*` | hex 값 그대로 이식 |
| `src/constants/spacing.ts` | `--sp-1` ~ `--sp-8` (4-step grid) | px 값을 `number`로 |
| `src/constants/typography.ts` | `--fs-xxs` ~ `--fs-display`, font family 3종, line-height, weight | `fontFamily: 'Fraunces_600SemiBold'` 같이 expo-font 키로 |
| `src/constants/radius.ts` | `--r-xs` ~ `--r-pill` | `number`로. `pill = 9999` |
| `src/constants/shadows.ts` | `--sh-sm`, `--sh-md`, `--sh-lg` | RN `shadowColor / Offset / Opacity / Radius` + `elevation`으로 변환. **`--sh-inset`는 RN 미지원이므로 제외** |

### 폰트 (expo-font 등록 필요)
- **Fraunces** (serif) — 헤드라인, eyebrow numerals
- **Inter** (sans) — 본문 전체
- **JetBrains Mono** (mono) — 이메일·숫자·코드성 텍스트

### 권장 정수 폰트 스케일
```
fs.xxs = 10  // mono caption
fs.xs  = 11
fs.sm  = 12
fs.md  = 14  // body
fs.lg  = 17  // card title
fs.xl  = 22  // section
fs.h2  = 28  // hero
fs.h1  = 36  // recipe hero
fs.display = 48
```

---

## 6. 화면 ↔ 라우트 매핑

`design/design-source/app.jsx` 상단 주석의 매핑표 그대로:

| 디자인 (컴포넌트 ID) | RN 라우트 |
|---|---|
| `login` | `app/(auth)/login.tsx` |
| `loginEmail` | `app/(auth)/login-email.tsx` (신규) |
| `forgotPassword` | `app/(auth)/forgot-password.tsx` (기존, 디자인 신규) |
| `signup1` | `app/(auth)/register.tsx` |
| `signup2` | `app/(onboarding)/step1.tsx` (신규 — 기존 비어있음) |
| `signup3` | `app/(onboarding)/step2.tsx` |
| `welcome` | `app/(onboarding)/step3.tsx` |
| `bar` | `app/(tabs)/index.tsx` (홈 탭) |
| `recipe` | `app/(tabs)/recipes.tsx` (신규 탭) |
| `feed` | `app/(tabs)/feed.tsx` (신규 탭) |
| (ar) | `app/(tabs)/ar.tsx` (placeholder, "준비 중") |
| `profile` | `app/(tabs)/profile.tsx` |
| `barDetail` | `app/bottle/[id].tsx` (스택) |
| `barAdd` | `app/bottle/new.tsx` (스택) |
| `barInsight` | `app/bar/insight.tsx` (스택) |
| `recipeDetail` | `app/recipe/[id].tsx` (스택) |
| `recipeMissing` | `app/recipe/[id]/missing.tsx` (스택) |
| `post` | `app/post/[id].tsx` (스택) |

---

## 7. 일러스트 처리 전략

`design/DESIGN_HANDOFF_v2.md` §7 핵심 요약:

- **Bottle, CocktailGlass는 SVG로 재드로잉** — `react-native-svg` + `expo-linear-gradient` 필수 의존성
  - CSS 그라데이션 → SVG `<LinearGradient>`
  - 비대칭 `border-radius` (예: `'50% 50% 10% 10% / 60% 60% 10% 10%'`) → SVG `<Path>`
- **IngChip은 MVP에서 단순 처리** — `borderRadius: width/2` 원형 + 단색 (또는 1단계 그라데이션). inset shadow 광택 효과 제거. 정밀 SVG는 Phase 2.
- **BottleGauge 동적 표현(액체 height 애니메이션)은 Phase 2** — `Animated.timing` + `<Mask>` 또는 `<ClipPath>`로 구현 예정.
- **MVP 작업 순서**: 1) `react-native-svg` + `expo-linear-gradient` 설치 → 2) `Bottle` 1개 (`bar` 미니 + `barDetail` 히어로 동시 검증) → 3) `CocktailGlass` 3 변형 → 4) `IngChip` 6종 단순 원형.

---

## 8. RN 변환 시 주의사항 (5가지)

1. **CSS `linear-gradient` → `expo-linear-gradient`** (RN 네이티브 미지원).
   히어로 카드, CTA dark variant, 토글 thumb, 진행바, 일러스트 액체 등 다수.
2. **`box-shadow: inset` → 미지원**. IngChip 광택, Bottle 내부 하이라이트는 **제거**하거나 Phase 2에서 SVG `<defs>`로 재현.
3. **`transform: translateX(-50%)` → flex 정렬로 재작성**. RN의 `transform`은 `%` 단위 미지원. 부모 `alignItems: 'center'` 또는 절대 위치 + 명시적 width.
4. **비대칭 `border-radius` → SVG path**. RN은 4-corner radius만 지원. 병 어깨, 잔 곡선은 `react-native-svg`의 `<Path>`로 재드로잉.
5. **CSS `transition` → `Animated` API**. BottleGauge 액체, 토글 슬라이드, 진행 도트 색상 등. `Animated.timing(value, { toValue, duration: 400 })` 패턴. 단순 트랜지션이라 `react-native-reanimated`까지는 불필요.

---

## 9. 명명 규칙

- **컴포넌트 파일**: `PascalCase.tsx` (예: `Button.tsx`, `BottleIllustration.tsx`)
- **훅**: `useXxx.ts` (예: `useAuth.ts`, `useInventory.ts`)
- **상수 / 유틸**: `camelCase.ts` (예: `parseApiError.ts`, `formatDate.ts`)
- **타입**: `src/types/`에 도메인별 분리 (`auth.ts`, `user.ts`, `bottle.ts`, `recipe.ts` 등)
- **라우트 파일**: Expo Router 규칙 그대로 (`[id].tsx`, `_layout.tsx`)

---

## 10. Git 워크플로우

- 브랜치
  - `main`: 배포 가능 상태만
  - `develop`: 통합 브랜치
  - `feat/<기능명>`: 기능 개발
  - `fix/<버그명>`: 버그 수정
- 커밋 메시지 prefix
  - `feat:` — 새 기능
  - `fix:` — 버그 수정
  - `refactor:` — 동작 변경 없는 리팩터링
  - `style:` — 포맷·들여쓰기·세미콜론 등 (스타일링 코드 변경은 `feat:` 또는 `refactor:`)
  - `chore:` — 빌드·설정·의존성 등 잡무

---

## 11. 검증 워크플로우

- **UI 작업 후 Expo Go로 실기 검증** — 변경된 화면을 실제 폰에서 한 번이라도 띄워본 후에야 "완료" 보고.
- **Expo Web 모드는 빠른 디자인 매칭 용도**. 최종 검증 수단이 아님 (네이티브 SVG/제스처/SafeArea 차이가 있음).
- **SafeArea, 키보드 동작, 스크롤 관성, 햅틱은 폰에서만 검증**.
- 자동 테스트 미설정 상태 → 회귀 검증은 수동.

---

## 12. 작업 시작 전 체크

- 새 기능 시작 시 **관련 파일을 먼저 Read**로 읽어 현재 상태를 확인 (특히 라우트 _layout.tsx, 인접 화면, 관련 store).
- 세션이 길어지면 (45분 이상 또는 큰 변환 작업 후) `/compact` 또는 `/clear`로 컨텍스트 정리.
- **한 번에 한 화면씩 작업**. 17개 화면을 일괄 변환하지 말 것 — 디자인 토큰 매핑·일러스트 변환·레이아웃 보정에서 발생하는 결정 사항이 화면마다 누적되므로, 한 화면 완성 후 패턴을 고정하고 다음으로.

---

## 13. 알려진 이슈 / TODO

| 항목 | 위치 / 메모 |
|---|---|
| 동적 `require('react-native')` | `app/(tabs)/_layout.tsx:40` — 정적 `import`로 교체 예정 |
| JSON trailing comma | `app.json:19` — 제거 예정 |
| `forgot-password` 디자인 신규 | 현재 RN 코드는 골격만. 디자인 인계본대로 2-step UI로 재작성 필요 |
| `(onboarding)/step1.tsx` 신규 생성 | 기존 비어있음 — `signup2` 디자인 매핑 |
| ESLint 의존성 미설치 | `package.json:10`에 `"lint": "eslint ."`만 있고 `eslint`/`eslint-config-expo` 미설치 → 실행 불가 |
| 인증 가드 부재 | `(tabs)`, `(onboarding)` 그룹에 라우트 보호 없음. `app/index.tsx` 단발 리다이렉트에만 의존 |
| `(tabs)/index.tsx:33` useEffect deps 누락 | `setUser` 미포함 (lint 활성화 시 잡힘) |
| `parseApiError(err)` 헬퍼 부재 | `error: unknown` 캐스팅 패턴이 6개 화면에 인라인 반복 |

---

## 14. 보류 중인 결정 사항

`design/README.md` §5의 보류 사항 (RN 이식 후 실제 디바이스에서 보고 결정):

- **인벤토리 행 padding 12** → 답답하면 16으로 보정 검토
- **barAdd input padding 12** → 답답하면 16으로 보정 검토
- **CTA 버튼 padding 15** → 14 또는 16으로 통일할지 결정
- **누락 화면들** (디자인 없음, 필요 시 추가):
  - 검색 결과
  - 빈 상태 (My Bar 0병, 레시피 즐겨찾기 0개 등)
  - 로딩 / 스켈레톤
  - 에러 / 네트워크 끊김
  - 설정
  - 알림
  - 게시글 작성 폼
- **온보딩 라우트 매핑 결정** (`design/README.md` §2):
  - 현재 안: `signup1 → register`, `signup2 → step1`, `signup3 → step2`, `welcome → step3`
  - 대안: `step1 = signup1`, `step2 = signup2`, `step3 = signup3`로 두고 welcome을 별도 인트로 화면으로 분리
- **AR 탭** 처리: MVP에서는 placeholder("준비 중") 화면만 두기로 함. 실제 AR 인식 화면 디자인은 MVP 후.

---

*이 파일은 작업 진행에 따라 갱신된다. 결정이 바뀌면 해당 섹션을 즉시 수정할 것.*
