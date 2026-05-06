# 나만의 버틀러 — Design Handoff for React Native (Expo)

> **v2 (2026-05-06 업데이트)** — v1 이후 다음 항목이 변경되었습니다.
> - 인증 플로우 보강: `loginEmail`, `forgotPassword(2 step)` 화면 추가
> - 폰트/간격 토큰 라운딩 적용: 화면 코드의 px 리터럴을 `tokens.css` 토큰으로 일괄 치환
>   - `--fs-xxs(10) / --fs-xs(11) / --fs-sm(12) / --fs-md(14) / --fs-lg(17) / --fs-xl(22) / --fs-h2(28) / --fs-h1(36) / --fs-display(48)`
>   - `--sp-1~8` (4-step grid)
> - `app.jsx` 상단에 RN 라우트 매핑 주석 추가
> - **§7 일러스트 RN 이식 명세 신규 추가**

> 이 문서는 현재 HTML/JSX 프로토타입을 React Native(Expo) 코드베이스로 옮기기 전,
> 디자인 토큰·화면·컴포넌트·인터랙션이 변환에 적합한 형태인지 점검한 결과입니다.

---

## 0. 프로젝트 한눈에

- **앱 성격**: 홈 바 / 칵테일 인벤토리 + 레시피 + 커뮤니티 ("나만의 버틀러")
- **타겟 디바이스**: Galaxy S24 FE (393 × 854 dp) 기준으로 디자인. iOS 호환 가능
- **무드**: Warm Amber, editorial, bar-counter metaphor
- **타이포그래피**: Fraunces (serif, 제목/숫자) + Inter (sans, 본문) + JetBrains Mono (mono, eyebrow/수치 라벨)
- **현재 구조**:
  - `tokens.css` — 모든 디자인 토큰 (CSS Custom Properties)
  - `src/primitives.jsx` — 공용 UI 컴포넌트
  - `src/illustrations.jsx` — CSS로 그린 병/잔/재료 일러스트레이션
  - `src/onboarding.jsx`, `mybar.jsx`, `recipe.jsx`, `community.jsx` — 화면 묶음 (총 15 화면)
  - `src/app.jsx` — 라우터(스크린 셀렉터) + Tweaks
  - `나만의 버틀러 Prototype.html` — 디바이스 프레임 + 좌측 화면 선택 + 우측 RN 노트 셸

---

## 1. 디자인 시스템 추출 가능성

### 1-1. 색상 (hex)

`tokens.css` `:root`에 **모든 색이 토큰화되어 있음** — RN `theme/colors.ts`로 1:1 이식 가능.

| 그룹 | 토큰 | Hex |
|---|---|---|
| Ink (다크 표면) | `--ink-900` | `#1a1412` |
| | `--ink-800` | `#231b17` |
| | `--ink-700` | `#2e241f` |
| | `--ink-600` | `#3d2f27` |
| Paper (라이트 표면) | `--paper-50` | `#faf6ef` |
| | `--paper-100` | `#f4ece0` |
| | `--paper-200` | `#ebe0cf` |
| | `--paper-300` | `#d9cab3` |
| | `--paper-400` | `#b8a384` |
| Amber (primary accent) | `--amber-50` | `#fdf3e0` |
| | `--amber-100` | `#f9e3b8` |
| | `--amber-200` | `#f2c977` |
| | `--amber-300` | `#e4a83c` ← **primary** |
| | `--amber-400` | `#c88820` |
| | `--amber-500` | `#9a6414` |
| | `--amber-600` | `#6d4410` |
| Brass (metallic) | `--brass` | `#c8a265` |
| | `--brass-ink` | `#8b6a2e` |
| Semantic | `--ok` | `#5a7a3e` |
| | `--warn` | `#c9751f` |
| | `--danger` | `#a43220` |
| Semantic BG | `--ok-bg` | `#eaf1d9` |
| | `--warn-bg` | `#fbe7cc` |
| | `--danger-bg` | `#f6d8cf` |

**Tweaks용 액센트 스왑** (런타임 변환 — RN에선 ThemeProvider value로 매핑):
- amber: `#e4a83c / #c88820 / #f2c977 / #9a6414`
- brass: `#c8a265 / #a1813f / #e0c791 / #7a5e2a`
- copper: `#c9793c / #9e5620 / #e0a479 / #773e16`

**일관성 평가: A (Excellent)**
- 화면 코드에 하드코딩된 hex는 일러스트의 그라디언트 stop(병/잔의 유리·액체 컬러)에만 존재 — 의도된 비주얼 디테일이며 토큰 외부값 사용 ≈10여 곳, 모두 illustrations.jsx와 community.jsx 아바타 그라디언트에 국한.
- 의미 색(텍스트, 표면, accent)은 100% 토큰 사용.

### 1-2. 폰트 사이즈 (px)

스케일 토큰 정의 (tokens.css):

| 토큰 | px | 용도 |
|---|---|---|
| `--fs-display` | 44 | 거의 미사용(여분) |
| `--fs-h1` | 30 | 화면 헤로 제목 |
| `--fs-h2` | 22 | 섹션 제목 |
| `--fs-h3` | 17 | 카드 제목 |
| `--fs-body` | 14 | 본문 |
| `--fs-sm` | 12 | 보조 텍스트 |
| `--fs-xs` | 10.5 | eyebrow / mono 라벨 |

**실제로 코드에 등장한 폰트 사이즈 전부** (px, 일관성 점검용):

> `9 · 9.5 · 10 · 10.5 · 11 · 11.5 · 12 · 12.5 · 13 · 13.5 · 14 · 15 · 16 · 17 · 18 · 20 · 22 · 28 · 30 · 36 · 48`

- **문제**: 토큰을 정의해 두고 화면에서는 `fontSize: 11`, `12.5`, `13.5`, `9.5` 같은 **숫자 리터럴**을 직접 쓴 곳이 많음. 시각적으로 의도한 미세한 조정(eyebrow 10.5, mono caption 9.5 등)이지만 RN 변환 시 토큰화가 필요함.
- **권장 RN 스케일** (정수화):
  ```ts
  fs.xxs = 10  // mono caption (was 9 / 9.5 / 10)
  fs.xs  = 11  // small caption (was 10.5 / 11 / 11.5)
  fs.sm  = 12  // small (was 12 / 12.5)
  fs.md  = 14  // body (was 13 / 13.5 / 14 / 15)
  fs.lg  = 17  // card title
  fs.xl  = 22  // section
  fs.h2  = 28  // hero
  fs.h1  = 36  // recipe hero
  fs.display = 48  // counter number
  ```

### 1-3. 간격 (padding/margin)

스케일 토큰 정의:

| 토큰 | px |
|---|---|
| `--sp-1` | 4 |
| `--sp-2` | 8 |
| `--sp-3` | 12 |
| `--sp-4` | 16 |
| `--sp-5` | 20 |
| `--sp-6` | 24 |
| `--sp-7` | 32 |

**실제 코드 등장값**: `2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 32, 36, 40` — 4의 배수가 주류이지만 **화면 코드에서 토큰을 거의 참조하지 않고 px 리터럴로 작성됨**.
- 가장 많은 변형: 14, 18, 22 — 8/16에서 살짝 어긋난 값들
- **일관성 평가: B-** — 스케일은 합리적이나 토큰 사용률이 낮아, RN 이식 시 손으로 4-step 그리드(`spacing(n) = n * 4`)에 맞춰 재정렬 필요.

### 1-4. Border Radius

스케일 토큰 (✅ Tweak으로 `--r-mult` 곱셈 적용):

| 토큰 | px (mult=1) |
|---|---|
| `--r-xs` | 4 |
| `--r-sm` | 8 |
| `--r-md` | 12 |
| `--r-lg` | 18 |
| `--r-xl` | 28 |
| `--r-pill` | 999 |

**실제 코드 등장값**: 토큰(`var(--r-*)`)을 잘 사용. 예외:
- `borderRadius: '50%'` — 원형 아바타/체크 도트 (RN: `borderRadius: width/2`)
- `borderRadius: 2 / 3 / 4 / 6` — 작은 디테일 (라벨, 진행바, 일러스트 내부)
- `borderRadius: '50% 50% 10% 10% / 60% 60% 10% 10%'` — 일러스트의 병 어깨/잔 모양 (RN에선 SVG 또는 별도 처리 필요 ⚠)

**일관성 평가: A** — 의미 있는 라운딩은 모두 토큰. Tweak에서 멀티플라이어로 한 번에 조정 가능.

### 1-5. Shadow (box-shadow)

스케일 토큰:

| 토큰 | 값 |
|---|---|
| `--sh-sm` | `0 1px 2px rgba(60,32,10,0.06)` |
| `--sh-md` | `0 4px 14px rgba(60,32,10,0.08)` |
| `--sh-lg` | `0 18px 40px rgba(45,25,8,0.16)` |
| `--sh-inset` | `inset 0 1px 0 rgba(255,255,255,0.55)` |

**실제 등장한 비-토큰 shadow** (10여 군데):
- 토글 thumb: `0 1px 3px rgba(0,0,0,0.25)`
- 아바타: `0 4px 14px rgba(60,32,10,0.18)` (= sh-md 변형)
- 일러스트 내부: `inset 2px 0 3px rgba(255,255,255,0.1)` 등 다중 inset
- 디바이스 프레임 자체: 4겹 box-shadow (Prototype.html의 화면 외부 — RN에선 무시)

**일관성 평가: B+** — 카드/모달 음영은 토큰 잘 사용. 일러스트 내부 inset shadow는 RN에서 표현 불가 ⚠ (아래 §4 참고).

### 1-6. 종합 일관성 평가

| 항목 | 등급 | 비고 |
|---|:-:|---|
| Color | A | 토큰화 완료, 거의 100% 적용 |
| Font Size | B- | 토큰 정의되어 있으나 화면 코드에서 px 리터럴 다수 |
| Spacing | B- | 합리적 스케일이나 화면에서 토큰 미사용 |
| Radius | A | 토큰 사용률 높음, Tweak 가능 |
| Shadow | B+ | 카드 OK, 일러스트 inset shadow는 RN 변환 필요 |

---

## 2. 화면 인벤토리

총 **15개 스크린**, 단일 `App.jsx`의 `byName` 맵으로 라우팅. 별도 HTML 파일이 아닌 React 컴포넌트로 분기됨.

### 2-1. 전체 화면 목록 + 라우트 매핑 제안

| # | 컴포넌트 ID | 섹션 | 한국어 명 | 위치 | 제안 RN 라우트 |
|--:|---|---|---|---|---|
| 1 | `login` | Onboarding | Front Door (랜딩+로그인 분기) | onboarding.jsx | `(auth)/login` |
| 2 | `signup1` | Onboarding | Account (이메일/비번) | onboarding.jsx | `(auth)/register` (step 1) |
| 3 | `signup2` | Onboarding | Profile (닉네임/생년/레벨) | onboarding.jsx | `(onboarding)/step1` |
| 4 | `signup3` | Onboarding | Taste Shelf (선호 카테고리) | onboarding.jsx | `(onboarding)/step2` |
| 5 | `welcome` | Onboarding | Welcome In (입장) | onboarding.jsx | `(onboarding)/step3` |
| 6 | `bar` | My Bar | The Counter (인벤토리 메인) ★ 홈 | mybar.jsx | `(tabs)/index` (홈 탭) |
| 7 | `barDetail` | My Bar | Bottle Biography (병 상세) | mybar.jsx | `bottle/[id]` (신규) |
| 8 | `barAdd` | My Bar | Pour In (재료 등록) | mybar.jsx | `bottle/new` (신규) |
| 9 | `barInsight` | My Bar | Monthly Counter (소비 통계) | mybar.jsx | `bar/insight` (신규) |
| 10 | `recipe` | Recipe | The Recipe Book (레시피 메인) | recipe.jsx | `(tabs)/recipes` (신규 탭) |
| 11 | `recipeDetail` | Recipe | Cocktail Recipe (레시피 상세) | recipe.jsx | `recipe/[id]` (신규) |
| 12 | `recipeMissing` | Recipe | Almost There (재료 부족) | recipe.jsx | `recipe/[id]/missing` (신규) |
| 13 | `feed` | Community | Counter Talk (피드) | community.jsx | `(tabs)/feed` (신규 탭) |
| 14 | `post` | Community | Post Detail (게시글 상세) | community.jsx | `post/[id]` (신규) |
| 15 | `profile` | Community | The Shelf View (프로필) | community.jsx | `(tabs)/profile` |

### 2-2. 요청한 라우트 그룹 매핑

#### `(auth)`
- ✅ `login` → 1번 화면 (Front Door)
- ⚠️ `register` → 2번 화면(signup1)만 해당. signup2/3은 onboarding 단계로 분리 권장.
- ❌ `forgot-password` → **없음** (디자인 누락)

#### `(onboarding)`
- `step1` → 3번 (signup2, 프로필 입력)
- `step2` → 4번 (signup3, 취향 선택)
- `step3` → 5번 (welcome)
> 또는 step1=signup1·step2=signup2·step3=signup3 으로 매핑하고 welcome을 별도 인트로 화면으로 둘 수도 있음. **결정 필요**.

#### `(tabs)`
- `index` (홈) → 6번 `bar` (The Counter)
- `profile` → 15번 `profile` (The Shelf View)
- 추가 탭 후보 (현재 디자인의 하단 탭바엔 `My Bar / Recipe / AR / Social` 4개가 존재): `recipes`, `feed`, `ar` (AR 탭은 디자인 미구현 — 라벨만 존재)

#### 그 외 신규(스택) 화면
- `bottle/[id]`, `bottle/new`, `bar/insight`
- `recipe/[id]`, `recipe/[id]/missing`
- `post/[id]`

---

## 3. 컴포넌트 추출

### 3-1. 이미 컴포넌트화된 것 (`src/primitives.jsx`)

| 컴포넌트 | Variants | RN 이식 난이도 |
|---|---|:-:|
| `SysBar` | One UI 상태바 (시간 좌, 신호/와이파이/배터리 우) — `dark` prop으로 ink/paper 톤 전환 | 쉬움 (`expo-status-bar` 또는 SafeAreaView 위에 배치) |
| `AppBar` | left/title/right slot, `serif` boolean | 쉬움 |
| `BackBtn` / `IconBtn` | `dark` boolean | 쉬움 |
| `CTA` (primary button) | `variant`: `dark` / `amber` / `paper` · `disabled` | 쉬움 (Pressable + style) |
| `Chip` (selectable) | `active` boolean · `size`: `sm`/`md`/`lg` | 쉬움 |
| `Input` | `label`, `hint`, `hintType`: `ok`/`err`/`default` | 쉬움 (`TextInput`) |
| `Toggle` | `on` boolean | 보통 (커스텀 또는 RN `Switch`) |
| `Card` | `dark` boolean, `style` prop | 쉬움 |
| `Eyebrow` | (variant 없음 — mono uppercase 라벨) | 쉬움 |
| `TabBar` (하단 탭) | 현재 탭 ID 4종: `bar`/`recipe`/`ar`/`feed` | **React Navigation Tab.Navigator**로 대체 권장 |
| `ProgressDots` | `step` / `total` (현재 `total=3` 고정 사용) | 쉬움 |

### 3-2. 화면에서 반복되지만 아직 미컴포넌트화 (RN에서 추출 권장)

| 패턴 | 등장 화면 | 변형 | 우선순위 |
|---|---|---|:-:|
| **Inventory Row** (병 미니 + 이름/카테고리/% + 액션) | bar, recipe(재료 리스트) | dark/light, `canMake` 분기 | ★★★ |
| **Hero Card** (어두운 그라데이션 + eyebrow + 큰 세리프 제목 + 메타 + 화살표) | recipe(tonight), barAdd, post 등 | (단일 변형) | ★★★ |
| **Stats Row** (3 칼럼, 각 mono 라벨 + 큰 세리프 숫자 + 디바이더) | recipeDetail, barInsight | (단일) | ★★ |
| **Ingredient Chip** (`IngChip`) | recipeDetail, recipeMissing — illustrations.jsx에 정의됨 | `kind`: lemon/lime/orange/cherry/sugar/salt | ★★ |
| **Section Header** (eyebrow + 세리프 제목 + "더보기 →") | bar, recipe, feed | (단일) | ★ |
| **Bottle Illustration** (`Bottle`) | bar(미니), barDetail(히어로), 일러스트 메인 | `tone`: amber/clear/red/green · `height`/`label` | ★★ (정적 SVG로 변환) |
| **Cocktail Glass** (`CocktailGlass`) | recipeDetail, post, feed | `glassStyle`: rocks/coupe/highball · `tone` | ★★ (정적 SVG로 변환) |
| **Bottle Gauge** (병 모양 액체 게이지) | bar(병 + 잔량 막대) | `level`(0~1) | ★ |

### 3-3. 추출 평가

- ✅ **Primitives 레벨**은 추출 잘 되어 있음. 변형(variant) prop도 명확.
- ⚠️ **Composite 레벨** (Inventory Row, Hero Card, Stats Row 등)은 화면별로 인라인 작성 — RN 이식 시 한 번 더 컴포넌트화 권장 (3개 이상 화면에서 반복되는 패턴).
- ⚠️ **`<input>` 류**는 두 가지 처리가 섞여 있음:
  - `Input` 컴포넌트(label+hint 포함) — onboarding에서 사용
  - 익명 `<input>` 인라인 스타일 — barAdd의 용량/ABV 입력에서 직접 사용
  - **RN 이식 시 `Input`을 단일 진입점으로 통일** 필요.

---

## 4. React Native 변환 시 주의점

### 4-1. 웹 전용 CSS 속성 사용처

| 속성 | 어디서 사용 | RN 대응 |
|---|---|---|
| `position: absolute` | 일러스트 레이어, 하단 고정 CTA, 모달 레일 | ✅ RN도 지원 (단, parent에 `relative` 불필요) |
| `position: fixed` | ❌ 미사용 — `absolute` + `bottom: 0`으로 처리 | — |
| `:hover` / `:focus` 가상 클래스 | ❌ 화면 코드 미사용 (커서 변화는 `cursor: 'pointer'` 정도) | — |
| `::before` / `::after` | Prototype.html의 RN 노트 헤더 ▲ 마커 1곳만. 디자인 본체엔 없음 | 무시 가능 |
| `transform: translateX(-50%)` | 일러스트 중앙 정렬에 다수 사용 | RN은 `transform`은 되나 `%` 안 됨 → flex 정렬로 재작성 필요 ⚠ |
| `filter: drop-shadow(...)` | `Bottle` 일러스트 1곳 | RN 미지원 → SVG 변환 시 `<defs><filter>` 또는 그림자 제거 ⚠ |
| `backdrop-filter: blur(8px)` | Prototype.html의 좌측 레일 1곳 (디바이스 외부) | 본체 무관 |
| `overflow-x: auto` (가로 스크롤 칩 행) | recipe, bar, feed의 카테고리 칩 | `<ScrollView horizontal showsHorizontalScrollIndicator={false}>` |
| `-webkit-overflow-scrolling`, `scrollbar-width` | content 영역 | RN의 `<ScrollView>`가 기본 처리 |
| **`linear-gradient(...)` (background)** | 일러스트 다수, hero card, 토글 thumb 등 | ⚠️ **RN 네이티브 미지원** → `expo-linear-gradient` 필수 |
| `box-shadow` (multi-layer / inset) | 일러스트 inset 하이라이트, 디바이스 프레임 | inset shadow는 RN 미지원 → 무시 또는 SVG로 재현 ⚠ |
| `display: grid` | ❌ 미사용 — 모두 flex | — |
| `border-radius` 비대칭 (`50% 50% 10% 10% / 60% 60% 10% 10%`) | 잔/병 어깨 표현 (illustrations.jsx 내부) | RN 부분 지원 (`borderTopLeftRadius` 등은 되지만 elliptical 비율 표기 불가) → **SVG로 변환 권장** ⚠ |
| `font-variation-settings`, `font-feature-settings` | tokens.css의 `.serif`, body | RN에서 폰트 자체에 weight 명시 (Fraunces 가변폰트 → 9개 weight 모두 로드 또는 700/600/500/400만) |
| `cursor: pointer` | 다수 | 무시 (RN은 Pressable의 시각 피드백) |
| `transition: ...` (CSS transition) | 토글, 진행바, 액체 게이지 등 | `Animated` 또는 `react-native-reanimated`로 재작성 (§4-5 참고) |
| `text-wrap: pretty` | recipe 본문 1곳 | 무시 |
| `placeholder` 색 | Input 컴포넌트 | `placeholderTextColor` prop 사용 |

### 4-2. SVG 사용 현황

**모두 인라인 SVG** — 외부 .svg 파일 0개. 별도 에셋 폴더 없음.

| 위치 | 종류 | 변환 방법 |
|---|---|---|
| `primitives.jsx` | 상태바 신호/와이파이/배터리, 뒤로가기 화살표, 탭바 4개 아이콘 | `react-native-svg`로 그대로 이식 가능 |
| `recipe.jsx`, `mybar.jsx` | 검색·메뉴·체크·플러스·하트·메모 아이콘 (각 1줄짜리 path) | 동일 |
| `onboarding.jsx`, `community.jsx` | 체크/플러스/메뉴/별 아이콘 | 동일 |

**권장**: 인라인 SVG들을 `src/icons/` 폴더로 추출해 `react-native-svg`의 `<Svg><Path/></Svg>`로 변환 후 `<Icon name="back" size={14} color="..." />` 인터페이스로 통일. 라이브러리(lucide-react-native, ionicons 등)는 **사용하지 않음** — 모두 자체 디자인.

### 4-3. 아이콘 라이브러리/방식

- ✅ **모든 아이콘이 inline SVG** (라이브러리 의존 없음)
- ❌ 이모지 미사용 (♡ 만 1군데 — 좋아요 토글, RN에선 SVG 하트로 교체 권장)
- ❌ 아이콘 폰트 미사용
- ❌ 외부 PNG/JPG 미사용

### 4-4. 이미지/에셋 파일

**현재 프로젝트에 실제 이미지 에셋 0개.**
- `uploads/` — 사용자가 첨부한 와이어프레임 HTML (디자인 입력일 뿐, 출력 아님)
- `scratch/galaxy-frame.png`, `scratch/missing-before.png` — 디자인 검토용 스크린샷
- 모든 시각 요소는 CSS/SVG로 그려짐
  - 병/잔 → CSS `linear-gradient` + 비대칭 `border-radius` (✅ illustrations.jsx)
  - 아바타 → `linear-gradient(135deg, ...)` (community.jsx 내부)
  - 재료(레몬/체리 등) → CSS gradient + `border-radius: 50%` + inset shadow

→ **RN 이식 시점에 placeholder 자리에 실제 사진/아이콘 자산을 채울지, SVG로 그릴지 결정 필요.**

### 4-5. 애니메이션

| 위치 | 종류 | RN 이식 |
|---|---|---|
| `Toggle` thumb 좌우 이동 | `transition: left 0.2s` + `transition: background 0.2s` | `Animated.timing` (transform.translateX) |
| `Toggle` thumb 그림자 | 정적 | — |
| `BottleGauge` 액체 높이 | `transition: height 0.4s` | `Animated.timing` 또는 `Reanimated`의 `useDerivedValue` |
| `Bottle` 라벨 액체 높이 | 동일 | 동일 |
| `ProgressDots` 점 색상 | `transition: background 0.3s` | `Animated.View` + interpolate (혹은 단순 setState로 충분) |
| `CTA` 클릭 피드백 | `transition: transform 0.1s` (현재 active scale은 미정의) | RN의 `Pressable` 자체 피드백으로 충분 |
| 화면 전환 | ❌ 없음 — `App.jsx`에서 `setScreen()`으로 즉시 교체 | React Navigation의 default 트랜지션 사용 |

**복잡한 keyframes 애니메이션 없음.** 모두 단순 transition. **`react-native-reanimated`까지 안 가도 됨**, `Animated` API로 충분.

### 4-6. 폼 요소

| 요소 | 현재 사용 | 사용 화면 | 비고 |
|---|---|---|---|
| `<input type="text">` | `Input` 컴포넌트 + barAdd 인라인 | onboarding signup1·2, barAdd, post(댓글) | RN `TextInput` |
| `<input type="password">` | `Input` 컴포넌트 (보안 처리는 디자인에만 표시) | signup1 | `secureTextEntry` |
| `<input type="email">` | (미지정 type, 디자인만) | signup1 | `keyboardType="email-address"` |
| `<input type="number">` | (미지정, 단순 텍스트) | barAdd 용량/ABV | `keyboardType="numeric"` |
| `<select>` | ❌ 미사용 | — | — |
| Checkbox | ❌ HTML 체크박스 미사용 — 커스텀 UI(앰버 사각 + 체크 SVG)로 표현 | signup1 약관 동의 | 커스텀 컴포넌트 |
| Radio | ❌ 미사용 — Chip 또는 카드 선택으로 대체 | signup2 레벨 선택, signup3 카테고리 | 커스텀 |
| Toggle | `Toggle` 컴포넌트 (커스텀) | profile 등 | RN `Switch` 또는 커스텀 유지 |
| Date Picker | ❌ 미사용 — 단순 텍스트 입력 (생년월일) | signup2 | 디자인 누락 — RN에선 `@react-native-community/datetimepicker` 도입 필요 ⚠ |
| Slider / Range | ❌ 미사용 | — | — |

---

## 5. 인터랙션 명세

### 5-1. 탭/클릭 동작

`App.jsx`의 `go(screen)` 라우팅이 모든 화면 전환을 담당. 주요 동작:

| 화면 | 인터랙션 | 동작 |
|---|---|---|
| login | "계정 만들기" CTA | `go('signup1')` |
| login | "이미 있어요 · 로그인" | `go('bar')` (디자인 단축) |
| signup1 | "다음" | `go('signup2')` |
| signup2 | "다음" | `go('signup3')` |
| signup3 | "완료" | `go('welcome')` |
| welcome | "들어가기" | `go('bar')` |
| bar | 인벤토리 행 탭 | `go('barDetail')` |
| bar | 우상단 + | `go('barAdd')` |
| bar | "이번 달 통계 →" | `go('barInsight')` |
| barAdd | "카운터에 추가" | `toast('카운터에 추가되었어요')` + `go('bar')` |
| recipe | tonight 카드 | `go('recipeDetail')` |
| recipe | 레시피 행 (canMake=true) | `go('recipeDetail')` |
| recipe | 레시피 행 (canMake=false) | `go('recipeMissing')` |
| recipeMissing | "재료 등록" | `go('barAdd')` |
| recipeMissing | "쇼핑 목록 추가" | (그래픽만, 디자인 액션 미정 ⚠) |
| feed | 게시글 카드 | `go('post')` |
| feed | 프로필 아바타 | `go('profile')` |
| 모든 상세 화면 | 좌상단 ← | `go('상위 화면')` |
| TabBar | 4개 탭 | `bar` / `recipe` / `feed` (`ar`은 `bar`로 fallback ⚠) |

**평가: B+** — 주요 흐름은 모두 명시. 다만:
- ⚠️ AR 탭은 라벨만 있고 화면 미구현
- ⚠️ recipeMissing의 "쇼핑 목록 추가"는 액션 정의 안 됨
- ⚠️ login의 "이미 있어요"는 실제 이메일 로그인 폼 없이 바로 홈으로 점프 (auth flow 디자인 미완)
- ⚠️ 검색 아이콘은 모든 화면에 있으나 검색 결과 화면 디자인 없음

### 5-2. 화면 간 네비게이션 흐름

```
[login]
  ├─→ [signup1] → [signup2] → [signup3] → [welcome] → [bar]
  └─→ [bar] (단축)

[bar] (홈)
  ├─→ [barDetail] (행 탭)
  ├─→ [barAdd] (+ 버튼)
  └─→ [barInsight] (통계 카드)

[recipe]
  ├─→ [recipeDetail] (canMake)
  └─→ [recipeMissing] (!canMake)
        └─→ [barAdd] / [recipeDetail](대체 칵테일)

[feed]
  ├─→ [post]
  └─→ [profile]

탭바: bar ↔ recipe ↔ ar(미구현) ↔ feed
```

### 5-3. 상태 변화 디자인

| 상태 | 디자인 유무 |
|---|:-:|
| **입력 검증** — 정상 | ✅ Input의 `hint`+`hintType="ok"` (signup1 이메일 "사용 가능") |
| **입력 검증** — 에러 | ✅ `hintType="err"` (컴포넌트는 있음, 명시적 사용 화면은 없음 ⚠) |
| **로딩** | ❌ 디자인 없음 ⚠ |
| **빈 상태** (Empty State) | ⚠️ bar의 인벤토리는 항상 7병이 mock 데이터로 표시 — 0병일 때 디자인 없음 |
| **재료 부족** | ✅ `recipeMissing` 화면 자체가 이 상태 |
| **잔량 부족 경고** | ✅ BottleGauge가 30% 미만이면 빨간 그라데이션, 마커선 표시 |
| **canMake / cannot make** | ✅ 레시피 카드의 dot 색상 + 화살표(→) vs 경고(!) 분기 |
| **토스트** | ✅ "카운터에 추가되었어요" 1종, 1.8초 fade |
| **모달/시트** | ❌ 사용 안 함 — 모두 풀스크린 화면 분기 |

---

## 6. 누락 또는 모호한 부분

### 6-1. 디자인 누락 화면

| 누락 | 영향도 |
|---|:-:|
| 비밀번호 찾기 (`forgot-password`) | ★★★ — auth flow 필수 |
| 이메일 로그인 폼 (현재 `login`은 랜딩만) | ★★★ |
| 검색 결과 화면 (검색 아이콘은 다수 화면에 존재) | ★★ |
| AR 탭 / AR 인식 화면 | ★★ — 탭은 있으나 미구현 |
| 빈 상태 (병 0개, 게시글 0개, 댓글 0개) | ★★ |
| 로딩 / 스켈레톤 | ★ |
| 에러 화면 (네트워크, 404 등) | ★ |
| 설정 화면 | ★★ — profile에서 진입 가능해 보이나 디자인 없음 |
| 알림 / 인박스 | ★ |
| 팔로우 / 팔로잉 리스트 | ★ |
| 게시글 작성 폼 | ★★ — feed에 입력 시작점 없음 |

### 6-2. 동일 화면 다중 버전?

**현재는 단일 버전만 존재.** `Tweaks` 패널의 `radius`(0/0.6/1) · `accent`(amber/brass/copper)는 **CSS 변수 런타임 스왑**일 뿐 별개 화면이 아님 → RN에선 ThemeProvider로 처리. **최종본은 `tokens.css`의 기본값** (radius=1, accent=amber).

### 6-3. 디자인 너비 기준

- **393 dp** (Galaxy S24 FE의 logical width).
- 일반 iOS 디자인 기준인 375pt와 약 18px 차이 — **그대로 가져가도 큰 깨짐은 없을 것**으로 예상되나, 일부 픽셀 정렬(예: 좌우 여백 20px)은 좁은 화면에서 약간 답답해질 수 있음.
- 세로는 854dp 기준이지만 디자인이 ScrollView 패턴이라 큰 영향 없음.

### 6-4. 다크모드?

- ❌ **다크모드 디자인 없음.**
- 단, 시스템 자체가 dual-tone — `ink-*` 다크 표면과 `paper-*` 라이트 표면이 한 화면 안에서 공존하는 디자인 언어 (예: `bar` 화면 상단 카운터 카드는 ink-900, 본문은 paper-50). 개별 컴포넌트의 `dark` boolean prop이 이를 처리.
- 따라서 RN에서 `useColorScheme()` 기반 다크모드를 지원하려면 **별도의 다크 팔레트 설계가 처음부터 필요** (단순 swap이 아님).

---

## 7. 일러스트 RN 이식 명세

### 7-1. 전략 결정사항

- ✅ **전체 일러스트를 `react-native-svg`로 재드로잉** (CSS gradient + 비대칭 radius로는 RN 이식 불가)
- ✅ **MVP 범위는 `Bottle`, `CocktailGlass`만** — 재료(IngChip)는 단순 처리
- ✅ **추가 라이브러리**:
  - `react-native-svg` — SVG 렌더링
  - `expo-linear-gradient` — hero card · 토글 · 진행바 등 일반 UI 그라데이션 (일러스트는 SVG `<LinearGradient>` 사용)

### 7-2. Phase 1 — MVP 범위 (필수)

| 컴포넌트 | 변형 | 사용 화면 | RN 컴포넌트 시그니처 |
|---|---|---|---|
| `Bottle` | `tone` × 4 (amber/clear/red/green), `height`(0~100%) | bar(미니), barDetail(히어로) | `<Bottle tone="amber" level={0.7} label="..." />` |
| `CocktailGlass` | `glassStyle` × 3 (rocks/coupe/highball), `tone` × 3 (amber/clear/red) | recipeDetail, post, feed | `<CocktailGlass style="rocks" tone="amber" />` |

각 컴포넌트는 현재 `illustrations.jsx`의 CSS 그라데이션을 `react-native-svg`의 `<LinearGradient>`로 변환.
비대칭 `border-radius` (예: `'50% 50% 10% 10% / 60% 60% 10% 10%'`)는 SVG `<Path>`로 표현.

**Bottle SVG 구조 가이드**:
- `<Path>` 1: 캡 (어두운 그라데이션, 사다리꼴)
- `<Path>` 2: 넥 (얇은 직사각형)
- `<Path>` 3: 어깨 (타원형 곡선)
- `<Path>` 4: 바디 (사각형 + 둥근 하단)
- `<Rect>` 5: 액체 (clipPath로 바디 내부에 클립, height = level × bodyHeight)
- `<Rect>` 6: 라벨 (paper-100 배경 + serif text)

**CocktailGlass SVG 구조 가이드**:
- rocks: 둥근 사각 + 액체 fill
- coupe: 얕은 컵 곡선 + 스템 + 베이스
- highball: 얇은 사각 + 액체 fill

### 7-3. Phase 1 — IngChip 단순 처리

재료 칩(`IngChip`)은 MVP에서 SVG 안 만들고 **단색 원형**으로 단순화:
- 형태: `borderRadius: width/2` (완전 원형)
- 채움: 단색 또는 1단계 LinearGradient (라이트/다크 두 stop)
- 라벨: `--fs-sm` (12px) — 필요 시만

**색상 매핑**:

| kind | fill | hex |
|---|---|---|
| lemon | `--amber-100` | `#f9e3b8` |
| lime | `--ok-bg` | `#eaf1d9` |
| orange | `--warn-bg` | `#fbe7cc` |
| cherry | `--danger-bg` | `#f6d8cf` |
| sugar | `--paper-100` | `#f4ece0` |
| salt | `--paper-50` | `#faf6ef` |

→ 현재 디자인의 광택 inset shadow는 **제거**. Phase 2에서 SVG 정밀 버전으로 교체.

### 7-4. Phase 2 — 출시 후 추가 (선택)

| 컴포넌트 | 메모 |
|---|---|
| `BottleGauge` (동적 액체 게이지) | bar 화면의 잔량 막대. SVG `<Mask>` + `Animated.Value`로 height 보간 |
| `IngChip` SVG 정밀 버전 | lemon/lime/orange/cherry/sugar/salt 6종을 SVG path로 (잎/꼭지/표면 텍스처 표현) |
| `Bottle` inset highlight | 유리 반사광 좌측 하이라이트. SVG `<LinearGradient>` 추가 stop으로 표현 가능. `<defs><feGaussianBlur>` 사용은 성능 영향 검토 후 |
| 아바타 그라데이션 (community) | 현재 CSS `linear-gradient(135deg, ...)` — `expo-linear-gradient`로 직접 이식 (SVG 불필요) |

### 7-5. RN 변환 시 제외/대체할 효과

| 효과 | 사용처 | RN 처리 |
|---|---|---|
| `box-shadow` (inset) | Bottle 내부 하이라이트, IngChip 광택 | **제거** (Phase 2에서 SVG로 재현) |
| `backdrop-filter: blur(...)` | Prototype.html 좌측 레일 (디바이스 외부) | **무시** (디자인 본체와 무관) |
| `filter: drop-shadow(...)` | Bottle 외곽 그림자 1곳 | SVG 내부 `<filter><feDropShadow>` 또는 **제거** |
| `transform: translateX(-50%)` | 일러스트 중앙 정렬 다수 | SVG는 viewBox 좌표로 직접 정렬, 외부 컨테이너는 `alignItems: 'center'`로 **재작성** |
| 비대칭 `border-radius` | 병 어깨, 잔 곡선 | **SVG path로 변환** (필수) |
| CSS `transition` (액체 height) | BottleGauge | `Animated.timing(value, { toValue: level, duration: 400 })` + height interpolate |
| `linear-gradient(...)` (background) | hero card, 토글 thumb, 진행바, 액체 색 | `expo-linear-gradient`의 `<LinearGradient colors={[...]} />` |

### 7-6. 작업 순서 권장

1. `react-native-svg` + `expo-linear-gradient` 설치 및 SVG 호환 환경 확인
2. `Bottle` 컴포넌트 1개 먼저 완성 → `bar` 화면에 들어가는 미니 버전 + `barDetail` 히어로 버전 동시 검증
3. `CocktailGlass` 3 변형 추가 → `recipeDetail` / `feed` / `post` 검증
4. `IngChip` 6 종을 단순 원형으로 → `recipeDetail` / `recipeMissing` 재료 리스트 채움
5. (Phase 2) `BottleGauge` 애니메이션 → 정밀 `IngChip` → inset highlight 순으로 충실도 끌어올리기

---



### 🥇 #1. 인증/온보딩 플로우의 빈 화면 채우기
- **이메일 로그인 폼**, **비밀번호 찾기**, **(선택) 소셜 로그인** 디자인이 없습니다.
- 현재 `login` 화면의 "이미 있어요 · 로그인" 버튼이 곧장 홈으로 점프 — RN으로 옮기면 실제 백엔드 연동 시 화면 공백이 그대로 드러납니다.
- **결정 필요**: 이메일/패스워드 vs 소셜(카카오·애플) vs 매직링크. 최소 1개 라우트라도 와이어를 정해야 `(auth)` 그룹이 완성됩니다.

### 🥈 #2. 폰트 사이즈·간격 토큰을 화면 코드에 일관 적용
- `tokens.css`에 **스케일은 정의되어 있으나 화면 코드는 px 리터럴 사용** (fontSize 11.5 / 12.5 / 13.5 등 23종, padding 14/18/22 등 다수).
- RN으로 옮길 때 `theme/typography.ts`, `theme/spacing.ts`로 정수 스케일을 만들고, 현재 디자인의 미세 차이 값들을 **가장 가까운 토큰으로 라운딩** 하는 사전 정리 작업을 **HTML 단계에서** 한 번 수행 권장. 안 하면 RN 코드에 마법의 숫자가 그대로 따라옵니다.
- 추천 정리:
  - fontSize 9 / 9.5 / 10 → `xxs(10)`
  - fontSize 10.5 / 11 / 11.5 → `xs(11)`
  - fontSize 12 / 12.5 → `sm(12)`
  - fontSize 13 / 13.5 → `md-sm(13)`
  - fontSize 14 / 15 → `md(14)`
  - padding 14 → 16, 18 → 16 또는 20, 22 → 20 또는 24

### 🥉 #3. 일러스트(병/잔/재료)의 RN 이식 전략 결정
- 현재 일러스트는 **CSS 그라데이션 + 비대칭 border-radius + multi-layer inset box-shadow**로 그려져 있어 **RN 네이티브 스타일로는 재현 불가**합니다.
- 선택지 (하나 결정 필요):
  - **(A) SVG로 재드로잉** — `react-native-svg` + `<LinearGradient>` (비대칭 radius·inset shadow는 path와 filter로 표현). 비용 ★★★, 충실도 ★★★
  - **(B) 정적 PNG/WebP로 export** — Bottle/Glass의 각 tone × size 조합을 미리 렌더링. 비용 ★★, 충실도 ★★★ (단, `BottleGauge`의 동적 액체 높이는 별도 처리)
  - **(C) 단순화** — 그라데이션을 단색 + 1단계 그림자로 축소, 라이브러리 일러스트로 교체. 비용 ★, 충실도 ★ (브랜드 시그니처 손실)
- 동시에 `expo-linear-gradient`는 **모든** 그라데이션 표현(hero card 배경, 토글, 액체)에 필수 — 도입 결정도 함께 가져가야 합니다.

---

*문서 끝.*
