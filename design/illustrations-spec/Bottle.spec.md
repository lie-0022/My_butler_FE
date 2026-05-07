# Bottle.spec.md — `<Bottle>` 일러스트 SVG 정밀 명세

> 원본: `src/illustrations.jsx` `Bottle` 컴포넌트
> RN 이식: `react-native-svg` 기반 재드로잉 (CSS gradient + 비대칭 radius는 RN 미지원)

---

## 0. 좌표계 & 기본 비율

- **viewBox**: `0 0 100 200` (가로 100 × 세로 200, 1유닛 = `height` prop의 1%)
- **prop 매핑** (`height` prop이 실제 px 높이를 결정, 폭은 자동 계산):
  - `bodyH = height × 0.62` → viewBox 단위 **124**
  - `neckH = height × 0.24` → viewBox 단위 **48**
  - `capH  = height × 0.08` → viewBox 단위 **16**
  - `shoulderH = height × 0.06` → viewBox 단위 **12** (어깨 곡선 영역)
  - `gap = height × 0.04` → viewBox 단위 **8** (어깨와 본체 사이 간격)
  - `w(폭) = height × 0.38` → viewBox 단위 **38** (본체 가장 넓은 폭)

> 본체 X 중심은 viewBox `x=50`. 모든 path는 `x=50` 기준 좌우대칭.

---

## 1. 외곽 path (4 파트)

병은 **4개의 분리된 path**로 구성합니다 (단일 path 대신 분리 — 광택과 그라데이션을 파트별로 다르게 적용하기 위함).

### 1-1. 캡 (cork/cap)

- **위치**: top=0
- **폭**: `w × 0.5` = 19 (viewBox 단위)
- **높이**: capH = 16
- **path**: `M 40.5 0 L 59.5 0 L 59.5 16 L 40.5 16 Z` (사각형)
- **상단 코너 radius**: 2px (RN: `rx=2 ry=2`은 사각형 전체에 걸리므로 `<Path>`로 작성하거나 `<Rect rx=2>` + 하단 별도 마스킹)

### 1-2. 넥 (neck)

- **위치**: top=16 (capH 직후)
- **폭**: `w × 0.35` = 13.3
- **높이**: neckH = 48
- **path (직사각형)**: `M 43.35 16 L 56.65 16 L 56.65 64 L 43.35 64 Z`

### 1-3. 어깨 (shoulder, 곡선)

- **위치**: top = 16+48-2 = **62** (넥과 2 유닛 겹침)
- **폭**: w = 38
- **높이**: shoulderH = 12
- **곡선 형태**: 위는 좁고 아래는 넓은 종 모양 — 원본 CSS의 `border-radius: 50% 50% 10% 10% / 60% 60% 10% 10%` 재현
- **path (Q 곡선 사용)**:
  ```
  M 43.35 62
  Q 31 62, 31 74
  L 69 74
  Q 69 62, 56.65 62
  Z
  ```
  → 좌우 모서리에서 바깥쪽으로 둥글게 벌어지는 곡선. control point는 `(x±12, 62)`.

### 1-4. 본체 (body)

- **위치**: top = 16+48+8 = **72** (capH+neckH+gap)
- **폭**: w = 38
- **높이**: bodyH = 124
- **하단 radius**: 6 (viewBox 단위. 원본 CSS `border-radius: 3px 3px 6px 6px`)
- **상단 radius**: 3 (어깨와 자연스럽게 연결)
- **path**:
  ```
  M 31 72
  L 69 72
  L 69 190
  Q 69 196, 63 196
  L 37 196
  Q 31 196, 31 190
  Z
  ```

---

## 2. 그라데이션 정의 (tone × 4)

각 병은 **2개의 LinearGradient**를 사용:
1. `glassGrad` — 본체 + 어깨 + 넥에 적용 (유리 자체 색)
2. `liquidGrad` — 액체 영역(클립된 사각형)에 적용

방향 표기: `(x1,y1)→(x2,y2)` 비율 기반 (SVG `<LinearGradient x1="0" y1="0" x2="1" y2="0">` 형태).

### 2-1. amber (위스키/버번 — **MVP 기본 톤**)

| Gradient | 방향 | Stop | Offset | Color |
|---|---|---|---|---|
| `liquidGrad-amber` | 수직 (0,0)→(0,1) | 0% | `#e4a83c` | (`--amber-300`, 호박) |
|  |  | 100% | `#8b4f10` | (다크 카라멜) |
| `glassGrad-amber` | 수평 (0,0)→(1,0) | 0% | `rgba(200,150,80,0.28)` | (왼쪽 하이라이트) |
|  |  | 100% | `rgba(80,40,15,0.42)` | (오른쪽 그림자) |

### 2-2. clear (진/보드카)

| Gradient | 방향 | Stop | Offset | Color |
|---|---|---|---|---|
| `liquidGrad-clear` | 수직 | 0% | `#d9c89a` |
|  |  | 100% | `#7a6138` |
| `glassGrad-clear` | 수평 | 0% | `rgba(220,200,160,0.30)` |
|  |  | 100% | `rgba(130,100,60,0.35)` |

### 2-3. green (아마로/허브)

| Gradient | 방향 | Stop | Offset | Color |
|---|---|---|---|---|
| `liquidGrad-green` | 수직 | 0% | `#7a8a4a` |
|  |  | 100% | `#2e3a14` |
| `glassGrad-green` | 수평 | 0% | `rgba(100,130,60,0.35)` |
|  |  | 100% | `rgba(30,50,10,0.45)` |

### 2-4. red (와인/캄파리)

| Gradient | 방향 | Stop | Offset | Color |
|---|---|---|---|---|
| `liquidGrad-red` | 수직 | 0% | `#c63820` |
|  |  | 100% | `#4a0e05` |
| `glassGrad-red` | 수평 | 0% | `rgba(180,60,40,0.35)` |
|  |  | 100% | `rgba(60,10,5,0.45)` |

### 2-5. 캡 그라데이션 (모든 tone 공통)

| Gradient | 방향 | Stop | Offset | Color |
|---|---|---|---|---|
| `capGrad` | 수직 (0,0)→(0,1) | 0% | `#6d4410` (`--amber-600`) |
|  |  | 100% | `#3d240a` |

---

## 3. 광택/하이라이트 효과

원본 CSS의 `box-shadow: inset 2px 0 3px rgba(255,255,255,0.1), inset -2px 0 4px rgba(0,0,0,0.3)`은 RN 미지원. SVG에서 다음으로 대체:

### 3-1. 좌측 하이라이트 띠 (필수)

본체 좌측 안쪽에 세로로 흐르는 흰색 반사광.

- **`<Rect>`**:
  - `x = 31 + 0.15×38` = **36.7** (본체 폭의 15% 지점)
  - `y = 72`
  - `width = 2`
  - `height = 124`
  - `fill = rgba(255,255,255,0.20)`

### 3-2. 우측 음영 (선택, 입체감 강화 시)

- 본체 우측 끝에서 안쪽 4유닛까지 어두운 그라데이션 stop을 `glassGrad`에 추가하거나, 별도 `<Rect width=4 fill="rgba(0,0,0,0.18)">`를 우측에 배치.

### 3-3. 외곽 그림자 (drop-shadow)

원본 `filter: drop-shadow(0 3px 6px rgba(40,20,5,0.3))`를 SVG `<filter>` 내부에서 재현:

```xml
<filter id="bottleShadow" x="-20%" y="-10%" width="140%" height="120%">
  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#281405" flood-opacity="0.30"/>
</filter>
```

→ 외곽 path 4개를 묶은 `<g filter="url(#bottleShadow)">` 컨테이너에 적용.

> 성능 우려 시: 그림자는 제거하고 RN `View`의 `elevation: 4`로 대체 가능.

---

## 4. 라벨 영역

`label` prop이 truthy일 때만 렌더.

- **위치**: 본체 상단에서 38% 지점 → `y = 72 + 124×0.38` = **119.1**
- **폭**: 본체 폭 - 좌우 2 padding → `width = 38 - 4 = 34`, `x = 33`
- **높이**: `fontSize × 1.05 + 8` (lineHeight 1.05 + padding 4 상하)
- **배경**: `<Rect fill="#f4ece0" rx="1" ry="1">` (`--paper-100`)
- **텍스트**:
  - `<Text>` 사용
  - `fontFamily = "Fraunces"` (serif)
  - `fontWeight = 700`
  - `fontSize = max(5.5, height × 0.075)` viewBox 단위
  - `fill = "#1a1412"` (`--ink-900`)
  - `letterSpacing = 0.04em` (RN SVG: `letterSpacing="0.5"` 정도, fontSize 비례)
  - `textTransform = "uppercase"` (RN: 텍스트를 대문자로 미리 변환)
  - `textAnchor = "middle"`, `x = 50`, `y = 119.1 + fontSize`

---

## 5. 액체 fill (level prop)

본체 내부에 클립된 그라데이션 직사각형.

- **clipPath**: 본체 path와 동일한 path를 `<clipPath id="bodyClip-{tone}">`에 정의
- **Liquid Rect**:
  - `x = 31`
  - `y = 196 - liquidH` (바닥에서 위로)
    - `liquidH = bodyH × clamp(level, 0, 1)` = `124 × level`
  - `width = 38`
  - `height = liquidH`
  - `fill = url(#liquidGrad-{tone})`
  - `clip-path = url(#bodyClip-{tone})`

### 애니메이션 (RN `Animated`)

```jsx
const liquidY = animatedLevel.interpolate({
  inputRange: [0, 1],
  outputRange: [196, 72],   // 바닥 ↔ 본체 상단
});
const liquidH = animatedLevel.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 124],
});
// AnimatedRect에 y, height 적용. duration: 400ms (원본 CSS와 동일)
```

---

## 6. size별 픽셀 매핑

`height` prop은 **실제 렌더 높이(px)**. viewBox는 항상 `100 × 200` 고정이고, RN에서 `<Svg width={height × 0.5} height={height} viewBox="0 0 100 200">`.

| size 명 | height (px) | width (px, =height×0.5) | 라벨 fontSize (px) | 사용처 |
|---|---|---|---|---|
| sm | 80 | 40 | 6 | bar 화면 인벤토리 행 |
| md | 150 | 75 | 11.25 | login 우측 그룹 (AMARO) |
| lg | 180 | 90 | 13.5 | login 우측 그룹 (DRY GIN) |
| xl | 220 | 110 | 16.5 | login 우측 그룹 (RESERVE), barDetail 히어로 |

> `fontSize`는 `max(5.5, height × 0.075)` 공식 그대로. RN SVG `<Text fontSize>`는 viewBox 단위가 아닌 사용자 좌표. viewBox 단위로 환산 시 `height × 0.075 × (200/height) = 15` (모든 size에서 동일하게 viewBox 15유닛). 따라서 **viewBox 단위로 `fontSize=15` 고정**해도 무방.

---

## 7. RN 컴포넌트 시그니처 (참고)

```tsx
type Tone = 'amber' | 'clear' | 'red' | 'green';
interface BottleProps {
  tone: Tone;
  height: number;          // sm=80, md=150, lg=180, xl=220
  level?: number;          // 0..1, default 1.0
  label?: boolean;
  labelText?: string;      // ex. "RESERVE"
}
```

---

## 8. 체크리스트 (RN 구현 후 자기검증)

- [ ] viewBox `0 0 100 200`, width=height×0.5
- [ ] 캡/넥/어깨/본체 4 path 분리 렌더
- [ ] amber tone 액체 그라데이션 `#e4a83c → #8b4f10` 수직
- [ ] 좌측 하이라이트 띠 `x=36.7, w=2, opacity=0.20`
- [ ] 라벨 Fraunces 700, 대문자, paper-100 배경
- [ ] level=0.7 일 때 액체 height=86.8 (=124×0.7), bottom=196
- [ ] drop-shadow 또는 elevation 4
