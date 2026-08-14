# 나만의 버틀러 — 기획 자료 모음 (PLANNING_DUMP)

> 기획서 작성용 원자료 취합본. 정식 기획서는 코워커에서 별도 작성 예정.
> 출처: `CLAUDE.md`, `PROJECT_STATUS.md`, `design/README.md`, `design/DESIGN_HANDOFF_v2.md`, `NEEDS_DESIGN.md`
> 취합일: 2026-05-22

---

## 1. 제품 개요

- **앱 이름**: 나만의 버틀러 (My Butler)
- **목적**: 홈 바 / 칵테일 인벤토리(My Bar) + 레시피 + 커뮤니티를 결합한 모바일 서비스. 사용자가 보유한 술병의 잔량을 관리하고, 만들 수 있는 칵테일을 제안하며, 같은 취향의 사용자들과 게시글로 소통한다.
- **타겟 사용자**: 홈텐딩에 관심 있는 20~30대. 취향과 소장품을 기록하고 싶어 하는 사용자.
- **핵심 가치 축**: 인벤토리 관리(잔량/유통기한) → 보유 재료 기반 칵테일 추천 → 취향 기반 커뮤니티 소통
- **타겟 디바이스**: Galaxy S24 FE (393 × 854 dp) 기준 검증. iOS/Android 양쪽 지원.
- **디자인 무드**: Warm Amber, editorial, bar-counter metaphor (위스키 바 카운터에서 영감)
- **다크모드**: MVP 미지원 (라이트 고정). 단, ink(다크 표면)/paper(라이트 표면)가 한 화면에 공존하는 dual-tone 디자인 언어.

---

## 2. 기술 스택

- Expo SDK **54**, React Native **0.81.5**, React **19.1.0**, TypeScript (strict)
- **Expo Router v6** (파일 기반 라우팅, typedRoutes)
- **Zustand** (클라이언트 상태) / **@tanstack/react-query** (서버 상태)
- **Axios** (refresh 토큰 인터셉터 구현됨) / **expo-secure-store** (토큰 영구 저장)
- **react-native-svg + expo-linear-gradient** (Bottle/CocktailGlass 일러스트)
- **expo-image** (이미지 최적화)
- **react-hook-form + zod + @hookform/resolvers** (폼 처리·검증)
- **@react-native-community/datetimepicker** (날짜 입력)
- baseURL: `${EXPO_PUBLIC_API_BASE_URL}/api/v1`, timeout 10s

---

## 3. 화면 인벤토리 (15 디자인 화면 + 신규 라우트)

| 컴포넌트 ID | 섹션 | 한국어 명 | RN 라우트 |
|---|---|---|---|
| `login` | Onboarding | Front Door (랜딩+로그인 분기) | `(auth)/login` |
| `loginEmail` | Onboarding | 이메일 로그인 | `(auth)/login-email` (신규) |
| `forgotPassword` | Onboarding | 비밀번호 찾기 (2-step) | `(auth)/forgot-password` |
| `signup1` | Onboarding | Account (이메일/비번) | `(auth)/register` |
| `signup2` | Onboarding | Profile (닉네임/생년/레벨) | `(onboarding)/step1` |
| `signup3` | Onboarding | Taste Shelf (선호 카테고리) | `(onboarding)/step2` |
| `welcome` | Onboarding | Welcome In (입장) | `(onboarding)/step3` |
| `bar` | My Bar | The Counter (인벤토리 메인) ★홈 | `(tabs)/index` |
| `barDetail` | My Bar | Bottle Biography (병 상세) | `bottle/[id]` |
| `barAdd` | My Bar | Pour In (재료 등록) | `bottle/new` |
| `barInsight` | My Bar | Monthly Counter (소비 통계) | `bar/insight` |
| `recipe` | Recipe | The Recipe Book (레시피 메인) | `(tabs)/recipes` |
| `recipeDetail` | Recipe | Cocktail Recipe (레시피 상세) | `recipe/[id]` |
| `recipeMissing` | Recipe | Almost There (재료 부족) | `recipe/[id]/missing` |
| `feed` | Community | Counter Talk (피드) | `(tabs)/feed` |
| `post` | Community | Post Detail (게시글 상세) | `post/[id]` |
| `profile` | Community | The Shelf View (프로필) | `(tabs)/profile` |
| (ar) | — | AR 탭 (준비 중 placeholder) | `(tabs)/ar` |

**하단 탭바**: My Bar / Recipe / AR / Social(Feed) 4개 (AR은 라벨만, 미구현)

---

## 4. 화면 흐름

```
[login]
  ├─→ [signup1/register] → [step1] → [step2] → [step3/welcome] → [bar]
  └─→ [login-email] → [bar]

[bar] (홈)
  ├─→ [barDetail] (행 탭)
  ├─→ [barAdd] (+ 버튼)
  └─→ [barInsight] (통계 카드)

[recipe]
  ├─→ [recipeDetail] (canMake=true)
  └─→ [recipeMissing] (canMake=false) → [barAdd] / 대체 레시피

[feed]
  ├─→ [post]
  └─→ [profile]

탭바: bar ↔ recipe ↔ ar(미구현) ↔ feed
```

---

## 5. 디자인 시스템 토큰

### 색상 (hex)
- **Ink (다크 표면)**: 900 `#1a1412` / 800 `#231b17` / 700 `#2e241f` / 600 `#3d2f27`
- **Paper (라이트 표면)**: 50 `#faf6ef` / 100 `#f4ece0` / 200 `#ebe0cf` / 300 `#d9cab3` / 400 `#b8a384`
- **Amber (primary accent)**: 50 `#fdf3e0` / 100 `#f9e3b8` / 200 `#f2c977` / **300 `#e4a83c` ← primary** / 400 `#c88820` / 500 `#9a6414` / 600 `#6d4410`
- **Brass (metallic)**: `#c8a265` / ink `#8b6a2e`
- **Semantic**: ok `#5a7a3e` / warn `#c9751f` / danger `#a43220`
- **Semantic BG**: ok-bg `#eaf1d9` / warn-bg `#fbe7cc` / danger-bg `#f6d8cf`

### 폰트
- **Noto Serif KR** (serif) — 기본 헤딩/슬로건 (한글-영문 커버)
- **Fraunces** (serifLatin) — 영문 전용 (eyebrow numerals, 영문 강조)
- **Inter** (sans) — 본문 전체
- **JetBrains Mono** (mono) — 이메일·숫자·코드성 텍스트

### 폰트 스케일 (정수화)
```
fs.xxs=10 (mono caption) / fs.xs=11 / fs.sm=12 / fs.md=14 (body)
fs.lg=17 (card title) / fs.xl=22 (section) / fs.h2=28 (hero)
fs.h1=36 (recipe hero) / fs.display=48
```

### 간격 (4-step grid)
`sp1=4 / sp2=8 / sp3=12 / sp4=16 / sp5=20 / sp6=24 / sp7=32`

### Radius
`r-xs=4 / r-sm=8 / r-md=12 / r-lg=18 / r-xl=28 / r-pill=9999`

### Shadow (RN 변환)
`sh-sm / sh-md / sh-lg` → shadowColor/Offset/Opacity/Radius + elevation. **inset shadow는 RN 미지원이라 제외**

---

## 6. 공용 컴포넌트

**Primitive (이미 디자인됨)**: AppBar, BackBtn/IconBtn, CTA(dark/amber/paper), Chip(sm/md/lg, active), Input(label/hint), Toggle, Card(dark), Eyebrow, ProgressDots
**Composite (추출 권장)**: Inventory Row, Hero Card, Stats Row, Ingredient Chip, Section Header, Bottle Illustration, Cocktail Glass, Bottle Gauge
**일러스트**: Bottle(tone×4, level), CocktailGlass(rocks/coupe/highball × tone×3), IngChip(MVP 단순 원형 6종: lemon/lime/orange/cherry/sugar/salt)

---

## 7. 백엔드 API 현황 (구현 완료)

### 인증/유저
- `/auth`: check-username, register, login, refresh, logout, password/reset-request, password/reset
- `/users/me`: profile(GET, 병합형 profile+stats+게시물9), profile(PATCH), preferences(GET/POST), username(PATCH)

### 도메인 (작업 18 BE PR #20 반영)
- **인벤토리**: CRUD 완성 (`PUT/DELETE /inventory/{id}`), 새 필드 4개(tastingNotes, purchasedAt, purchasePlace, origin), `POST /inventory/scan`(라벨 OCR — stub, 항상 실패 반환)
- **레시피**: `GET /recipes?keyword=` 검색, 별점 endpoint 4개(upsert/getAll/getMy/delete)
- **포스트**: `POST /posts`(multipart, 이미지 최대 10장, caption 2000자, recipeId 태그), 댓글/대댓글(1-depth), DELETE 시리즈
- **알림**: list, unread-count, mark-read, mark-all-read + 백그라운드 스케줄러
  - 타입: EXPIRY_WARNING(D-14~D-8 주황), EXPIRY_DANGER(D-7~ 빨강), POST_LIKE, POST_COMMENT, COMMENT_REPLY
  - 알림 link 정보: `{ screen: 'INVENTORY_DETAIL' | 'POST_DETAIL', targetId }`
- **AR**: `POST /ar/sessions` (Unity 클라이언트가 AR 인식 담당, RN은 결과만 업로드)

---

## 8. 미구현 / 디자인 필요 항목 (BE 준비됨, 시안 없음)

### 🟥 높음
1. **포스트 작성 화면** — BE 완성, FE는 + 버튼이 가짜 라우팅. 이미지 그리드, caption 2000자 카운터, 레시피 태그. **없으면 커뮤니티 기능 사실상 죽음.**
2. **알림 화면** — BE 완성 + 스케줄러 동작. 화면/라우트 없음. 리스트, 헤더 아이콘+unread 뱃지, 타입별 아이콘, 시간표시, 폴링 정책.
3. **보틀 수정/삭제** — BE 완성, FE "..." 가짜. 액션 시트(수정/삭제/취소) + 수정폼 + 삭제확인.

### 🟨 중간
4. **검색 화면** — recipes 검색 BE 완성, FE 가짜. 입력창/결과/빈상태.
5. **보틀 새 필드 UI** — 표시는 됨, 입력이 임시(텍스트). 칩 입력·날짜 피커 필요.
6. **레시피 별점 UI** — BE endpoint 있음, FE 로컬 토글만. 별점 입력+평균 표시.
7. **마이프로필 정교화** — 통계/선반 연결됨, 바이오 mock, 게시물 그리드/팔로우 없음(팔로우는 BE도 없음).

### 🟩 낮음
8. AR 카메라 (Unity 가정, RN placeholder 유지로 충분)
9. 빈상태/로딩/에러/네트워크 끊김 일관화
10. 설정 화면 (계정관리/알림설정/약관/탈퇴 — 약관·탈퇴는 BE 미구현, 법적 이슈로 출시 전 필수 가능성)
11. 답글 작성 입력창 (BE 완성)
12. 댓글/포스트 삭제 UI (BE 완성)
13. 라벨 OCR 스캔 (BE도 stub)
14. 인증 가드 — 현재 `/_debug` 직진(TEMP-DEBUG), 배포 전 `isAuthenticated` 분기 복원 필수

**디자이너 1회 미팅 우선순위 추천**: ① 포스트 작성 ② 알림 ③ 보틀 수정/삭제 액션시트 (이 3개로 FE 3~5일치 작업 풀림)

---

## 9. 보류 중인 결정 사항

- 인벤토리 행 / barAdd input padding 12 → 답답하면 16 보정 검토
- CTA 버튼 padding 15 → 14 또는 16 통일 결정
- 온보딩 라우트 매핑: 현재 `signup1→register, signup2→step1, signup3→step2, welcome→step3` vs 대안(welcome 별도 인트로 분리)
- 누락 화면(디자인 없음): 검색 결과, 빈 상태, 로딩/스켈레톤, 에러/네트워크, 설정, 알림, 게시글 작성 폼
- AR 탭: MVP placeholder("준비 중"), 실제 AR 디자인은 MVP 후
- 다크모드: 미지원. 지원하려면 dual-tone 특성상 별도 다크 팔레트 처음부터 설계 필요(단순 swap 불가)

---

## 10. 상태 변화 디자인 현황

| 상태 | 디자인 |
|---|---|
| 입력 검증 정상 | ✅ Input hint ok |
| 입력 검증 에러 | ✅ 컴포넌트 있음, 명시적 사용 화면 없음 |
| 로딩 | ❌ |
| 빈 상태 | ⚠️ mock 데이터만, 0건 디자인 없음 |
| 재료 부족 | ✅ recipeMissing 화면 |
| 잔량 부족 경고 | ✅ BottleGauge 30% 미만 빨강+마커 |
| canMake 분기 | ✅ dot 색상 + 화살표/경고 |
| 토스트 | ✅ 1종("카운터에 추가되었어요", 1.8초) |
| 모달/시트 | ❌ 전부 풀스크린 분기 |
