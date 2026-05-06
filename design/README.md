# 나만의 버틀러 — RN 인계 패키지

> 디자인 페이즈가 끝났습니다. 이 폴더는 React Native(Expo) 변환 작업을 시작하기 위한 인수인계 패키지입니다.

---

## 1. 인수자(RN 개발 Claude)에게

이 패키지는 **"나만의 버틀러"** 앱의 디자인 페이즈 산출물 전체입니다. 17개 화면(인증 3 · 온보딩 3 · My Bar 4 · 레시피 3 · 커뮤니티 3 · 기타)이 HTML/JSX 고충실도 프로토타입 형태로 구현되어 있고, 디자인 토큰이 CSS 변수로 정리되어 있습니다.

**읽는 순서**:

1. **이 README** — 5분 안에 전체 그림 파악
2. **`DESIGN_HANDOFF_v2.md`** — 핵심 문서. §1~§7 + TOP 3까지 끝에서 끝까지 통독 권장
3. **`tokens.css`** — 색·간격·폰트·라디우스·섀도 모든 토큰의 정의 원본
4. **`design-source/app.jsx`** — 상단 주석에 17개 화면 ↔ RN 라우트 매핑이 들어있음. RN 라우터 설정의 출발점
5. **`design-source/*.jsx`** — 화면별 구현. JSX이지만 className 대신 inline style을 쓰는 곳이 많아 RN으로 이식하기 비교적 직관적

**스크린샷**: HTML 프로토타입을 디바이스 프레임 안에서 직접 확인하는 게 가장 정확합니다. 별도 PNG는 첨부하지 않았으니 RN 변환 시 원본 프로토타입을 띄워서 비교하세요.

---

## 2. 핵심 결정사항 요약

> RN 작업자가 **모르고 작업하면 안 되는 것**들. 통째로 외우고 시작하세요.

- **디자인 시스템**: Warm Amber, editorial, **bar-counter metaphor** (위스키 바 카운터에서 영감)
- **폰트**:
  - **Fraunces** (serif) — 헤드라인, eyebrow numerals
  - **Inter** (sans) — 본문 전체
  - **JetBrains Mono** (mono) — 이메일·숫자·코드성 텍스트
- **타겟 디바이스**: **Galaxy S24 FE (393 × 854 dp)** 기준으로 모든 간격·폰트 검증됨
- **다크모드**: **MVP 미지원** (라이트 고정). 토큰은 paper(밝은 배경) 기반
- **일러스트**:
  - `react-native-svg` + `expo-linear-gradient` **필수 의존성**
  - MVP에서 **Bottle / CocktailGlass만 SVG 재드로잉**
  - **IngChip은 단순 원형** (단색 + 1단계 그라데이션) — Phase 2에서 정밀 SVG 교체
- **온보딩 라우트 매핑**:
  - `signup1` → `register`
  - `signup2` → `step1`
  - `signup3` → `step2`
  - `welcome` → `step3`
- **AR 탭**: **Placeholder만** (디자인 없음, MVP 후 구현 예정 — 하단 탭바에는 자리만 잡혀 있음)

---

## 3. 토큰 매핑 빠른 참조표

`tokens.css`의 CSS 변수를 RN `src/constants/*.ts`로 어떻게 분리할지:

| RN 파일 | 포함할 토큰 | 비고 |
|---|---|---|
| `src/constants/colors.ts` | `--ink-*`, `--paper-*`, `--amber-*`, `--brass*`, `--ok-*`, `--warn-*`, `--danger-*` | hex 값 그대로 이식 |
| `src/constants/spacing.ts` | `--sp-1` ~ `--sp-8` (4-step grid) | px 값을 number로 |
| `src/constants/typography.ts` | `--fs-xxs` ~ `--fs-display`, font family 3종, line-height, weight | `fontFamily: 'Fraunces_600SemiBold'` 같이 expo-font 키로 |
| `src/constants/radius.ts` | `--r-xs` ~ `--r-pill` | number로. `pill = 9999` |
| `src/constants/shadows.ts` | `--sh-sm`, `--sh-md`, `--sh-lg` | RN `shadowColor/Offset/Opacity/Radius` + `elevation`으로 변환. **`--sh-inset`는 RN 미지원이므로 제외** |

---

## 4. RN 변환 시 즉시 주의할 사항 (한 페이지 요약)

> `DESIGN_HANDOFF_v2.md` §4 + §7에서 가장 중요한 5가지만.

1. **CSS `linear-gradient` → `expo-linear-gradient` 필수**
   히어로 카드, CTA dark variant, 토글 thumb, 진행바, 일러스트 액체 등 다수. RN `style`로는 표현 불가.

2. **`box-shadow: inset` → 미지원**
   IngChip 광택, Bottle 내부 하이라이트 등에서 사용 중. **제거**하거나 Phase 2에서 SVG로 재현.

3. **`transform: translateX(-50%)` → flex 정렬로 재작성**
   현재 일러스트와 일부 정렬에서 사용. RN에서는 부모 `alignItems: 'center'` 또는 절대 위치 + 명시적 width로 처리.

4. **비대칭 `border-radius` (`'50% 50% 10% 10% / 60% 60% 10% 10%'`) → SVG path로**
   병 어깨, 잔 곡선 표현. RN은 4-corner radius만 지원. `react-native-svg`의 `<Path>`로 재드로잉 필수.

5. **CSS `transition` → `Animated` 또는 `Reanimated`**
   BottleGauge 액체 height, 토글 슬라이드, hover 등. `Animated.timing(value, { toValue, duration: 400 })` 패턴으로 이식.

---

## 5. 알려진 보류 사항 (RN 이식 후 결정)

디자인 페이즈에서 확정하지 않고 RN 이식 후 실제 디바이스에서 보고 결정하기로 한 것들:

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

---

## 6. 디자인 페이즈 작업 로그

| # | 작업 | 산출물 |
|---|---|---|
| 1 | 인증 화면 2개 추가 | `loginEmail`, `forgotPassword(2 step)` → `onboarding.jsx` |
| 2 | 폰트/간격 토큰 정리 | `tokens.css` + 화면 4개 파일 px 리터럴 일괄 치환 |
| 3 | App.jsx에 RN 라우트 매핑 주석 추가 | `app.jsx` 상단 17 화면 ↔ RN route 표 |
| 4 | DESIGN_HANDOFF v2 + §7 일러스트 명세 추가 | `DESIGN_HANDOFF_v2.md` §7-1 ~ §7-6 |
| 5 | 핸드오프 패키지 정리 | `handoff/` 폴더 (이 README 포함) |

---

## 폴더 구조

```
handoff/
├── README.md                    ← 지금 읽는 이 파일
├── DESIGN_HANDOFF_v2.md         ← 핵심 문서 (§1~§7 + TOP 3)
├── tokens.css                   ← 디자인 토큰 원본
└── design-source/               ← 원본 JSX 7개
    ├── app.jsx                  ← 상단 주석에 RN 라우트 매핑
    ├── primitives.jsx           ← 공용 컴포넌트 11종
    ├── illustrations.jsx        ← Bottle, CocktailGlass, IngChip
    ├── onboarding.jsx           ← 인증 + 회원가입 + welcome
    ├── mybar.jsx                ← bar, barDetail, barAdd, barInsight
    ├── recipe.jsx               ← recipe, recipeDetail, recipeMissing
    └── community.jsx            ← feed, post, profile
```

> 스크린샷 폴더는 별도 첨부하지 않았습니다. RN 변환 시 원본 HTML 프로토타입을 디바이스 프레임에서 직접 확인하는 것이 가장 정확합니다.
