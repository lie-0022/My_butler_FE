# login.spec.md — Login Front Door 화면 배치 명세

> 원본: `src/onboarding.jsx` `LoginScreen` 컴포넌트
> 화면 ID: `login` (앱 진입 첫 화면)
> 기준 viewport: **393 × 854 dp** (Galaxy S24 FE)

---

## 0. 화면 개요

- **배경**: `var(--ink-900)` = `#1a1412` (단색, 그라데이션 없음)
- **텍스트 톤**: `var(--paper-50)` = `#faf6ef` (밝은 크림)
- **화면 분할**: 상단 60% 일러스트 영역, 하단 40% 카피+CTA 영역 (시각적 비율)
- **레이아웃 모드**: SafeArea 내부 Flex column, 카피+CTA는 `justify-content: flex-end`로 하단 정렬

---

## 1. 화면 영역별 좌표 표

> top=0은 SafeArea 상단(=상태바 아래). 좌표는 viewport `393 × 854` 기준.

| 영역 | top | left | width | height | 비고 |
|---|---|---|---|---|---|
| StatusBar (SysBar) | -44 | 0 | 393 | 44 | iOS-style 상태바, dark 모드 |
| ScreenContainer | 0 | 0 | 393 | 854 | `padding: 20px 28px 30px` |
| BottleGroup | 60 | 285 | ≈230 | ≈250 | absolute, `right: -20`, opacity 0.7 |
| ContentBlock | (자동) | 28 | 337 | (자동) | flex column, `justify-content: flex-end` |
| ↳ Eyebrow | (=) | 28 | (자동) | 14 | `MY · BUTLER · 2026` |
| ↳ H1 (서재/한 잔의 기록) | mb=4 | 28 | 337 | ≈90 | Fraunces 44px, line-height 1.02, 2 줄 |
| ↳ Subcopy | mt=12 | 28 | 290 | ≈48 | Inter 14px, line-height 1.55, 2 줄 |
| CTA Stack | mt=32 | 28 | 337 | ≈140 | gap=12 |
| ↳ "계정 만들기" (amber CTA) | (=) | 28 | 337 | 50 | `var(--amber-300)` 배경 |
| ↳ "이미 있어요 · 로그인" (ghost) | gap=12 | 28 | 337 | 46 | 1.5px outline |
| ↳ 약관 캡션 | mt=16 | 28 | 337 | 14 | center, paper-400 |
| BottomSafeInset | 824 | 0 | 393 | 30 | 하단 SafeArea (Galaxy 기준 ~24-30) |

---

## 2. 컴포넌트 배치 (Flex/Absolute 명시)

### 2-1. ScreenContainer (root)

```jsx
<View style={{
  flex: 1,
  backgroundColor: '#1a1412',
  paddingTop: 20,        // SafeArea top + 20
  paddingHorizontal: 28,
  paddingBottom: 30,
  position: 'relative',
}}>
```

### 2-2. ContentBlock (카피 + CTA 컨테이너)

```jsx
<View style={{
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',  // 핵심: 하단 정렬
  zIndex: 2,                   // 일러스트 위에 떠야 함
}}>
```

→ 일러스트가 `position: absolute`로 빠지고, 텍스트는 일반 flow 위에서 하단으로 밀림.

### 2-3. BottleGroup (3 병 일러스트)

```jsx
<View style={{
  position: 'absolute',
  top: 60,
  right: -20,                  // 화면 우측 밖으로 일부러 흘러 나감
  flexDirection: 'row',
  alignItems: 'flex-end',      // 바닥 정렬 (병 높이 다름)
  opacity: 0.7,                // 카피 가독성 위해 살짝 투명
  zIndex: 1,
}}>
```

#### 3개 병의 정확한 배치 (좌→우 순서)

| 인덱스 | tone | labelText | height | marginRight | marginBottom | viewBox 폭 (px) |
|---|---|---|---|---|---|---|
| 0 (왼쪽) | amber | `RESERVE` | 220 | -20 | 0 | 110 |
| 1 (가운데) | clear | `DRY GIN` | 180 | -20 | -20 | 90 |
| 2 (오른쪽) | green | `AMARO` | 150 | 0 | -30 | 75 |

> `marginRight: -20`은 병끼리 좌우 20px 겹침. `marginBottom`은 음수로 바닥에서 살짝 떨어뜨려 어긋난 듯한 정물화 느낌.

**그룹 총 폭 계산**:
- 110 + 90 + 75 = 275
- 겹침 보정: -20 × 2 = -40
- → 실제 폭 ≈ **235px**, 우측 -20 오버플로우로 약 **215px**가 화면 안에 보임

**그룹 총 높이 계산**:
- 가장 높은 병(220) + 가장 깊은 marginBottom(-30) → 약 **250px**

### 2-4. CTA 버튼

#### 2-4-1. "계정 만들기" (Primary, amber)

```jsx
<Pressable
  onPress={() => navigation.navigate('register')}
  style={{
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#e4a83c',  // --amber-300
    borderRadius: 12,            // --r-md
    alignItems: 'center',
  }}
>
  <Text style={{
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1a1412',            // --ink-900
  }}>계정 만들기</Text>
</Pressable>
```

#### 2-4-2. "이미 있어요 · 로그인" (Ghost outline)

```jsx
<Pressable
  onPress={() => navigation.navigate('loginEmail')}
  style={{
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(250,246,239,0.25)',
    borderRadius: 12,
    alignItems: 'center',
  }}
>
  <Text style={{
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#faf6ef',
  }}>이미 있어요 · 로그인</Text>
</Pressable>
```

---

## 3. z-index 순서 (뒤에서 앞으로)

1. ScreenContainer 배경 `#1a1412` (z=0)
2. **BottleGroup** (z=1, opacity 0.7)
3. **ContentBlock** (z=2 — 카피와 CTA가 병 위에 떠야 함)
4. SysBar (z=10, 항상 최상단)

> 핵심: 카피 영역에 `zIndex: 2` 명시 안 하면 RN에서 absolute 일러스트 뒤로 깔릴 수 있음. 반드시 명시.

---

## 4. 일러스트 배치 정밀 좌표 (절대 위치)

> 컨테이너 `top: 60, right: -20` 기준 내부 좌표.

| 병 | container 내부 left | container 내부 top (bottom-aligned) | 화면상 절대 left | 화면상 절대 top |
|---|---|---|---|---|
| RESERVE (amber, h=220) | 0 | 0 (가장 높음, 기준선) | 393-235+(-20) = 138 | 60 |
| DRY GIN (clear, h=180) | ≈90 (110-20 overlap) | 40 (=220-180) + 20 (-20 mb)| 228 | 80+20=100 |
| AMARO (green, h=150) | ≈160 | 70 (=220-150) + 30 (-30 mb) | 298 | 130+30=160 |

> **계산 검증**: 가장 오른쪽 병(AMARO)의 우측 끝 = 298+75=373, 화면 폭 393에서 우측 여백 20. 컨테이너 `right:-20`이 적용되면 화면 밖으로 미세하게 흘러 나감 ✅

---

## 5. 카피 (정확한 텍스트 + 스타일)

### 5-1. Eyebrow

```
MY · BUTLER · 2026
```
- `fontFamily: 'JetBrainsMono_400Regular'`
- `fontSize: 11`
- `letterSpacing: 0.22em` → RN: `letterSpacing: 2.42`
- `color: '#c8a265'` (`--brass`)
- `textTransform: 'uppercase'`
- `marginBottom: 12`

### 5-2. H1

```
당신의 서재,
한 잔의 기록
```
(2번째 줄이 강조 — 다른 색)

- `fontFamily: 'Fraunces_700Bold'`
- `fontSize: 44`
- `lineHeight: 44 × 1.02 = 44.88` → RN `lineHeight: 45`
- `letterSpacing: -0.02em` → RN `letterSpacing: -0.88`
- `color: '#faf6ef'` (1번째 줄), `color: '#f2c977'` (`--amber-200`, 2번째 줄, `fontWeight: '500'`, 이탤릭)
- `marginBottom: 4`

> RN 구현: 한 `<Text>` 안에 두 `<Text>` 자식으로 분기. `style: { fontStyle: 'italic' }`로 이탤릭. Fraunces는 italic font도 expo-font로 같이 로드해야 함.

### 5-3. Subcopy

```
소장한 술과 취향을 기록하고,
오늘 밤의 한 잔을 제안받으세요.
```
- `fontFamily: 'Inter_400Regular'`
- `fontSize: 14`
- `lineHeight: 14 × 1.55 = 21.7` → RN `lineHeight: 22`
- `color: '#b8a384'` (`--paper-400`)
- `maxWidth: 290`
- `marginTop: 12`

### 5-4. 약관 캡션

```
계속 진행 시 이용약관 및 개인정보처리방침에 동의합니다
```
- `fontSize: 11`, `color: '#b8a384'`, `textAlign: 'center'`, `marginTop: 16`
- "이용약관"과 "개인정보처리방침"에 `textDecorationLine: 'underline'`

---

## 6. 반응형 노트

### 6-1. 좁은 화면 (375dp, iPhone SE 등)

- BottleGroup `right: -20` 그대로 유지 → 화면 밖으로 더 흘러 나가지만 의도된 디자인
- H1 `fontSize: 44`는 그대로 유지. 2 줄 wrap 자연스러움
- Subcopy `maxWidth: 290`이 화면 폭 375-28×2=319보다 작으므로 안전

### 6-2. 넓은 화면 (Pixel 6 Pro, 412dp)

- BottleGroup이 더 안쪽으로 보일 뿐 디자인 깨짐 없음
- 카피 영역은 `paddingHorizontal: 28` 유지. 폰트 크기 그대로

### 6-3. 키보드 동작

- Login Front Door는 **입력 필드 없음** → 키보드 처리 불필요
- "이미 있어요 · 로그인" 탭 → `loginEmail` 화면으로 이동, 그곳에서 `KeyboardAvoidingView` 적용

### 6-4. SafeArea

- 상단: SysBar 영역(44dp)은 `SafeAreaView` 또는 `useSafeAreaInsets().top` 사용
- 하단: `paddingBottom: 30 + insets.bottom`으로 홈 인디케이터/제스처 영역 보호

---

## 7. 핵심 배치 좌표 요약 (한눈에)

```
┌──────────────────────────────────┐ 393×854
│ [SysBar 44dp]                    │
├──────────────────────────────────┤
│                       ┌─┐        │
│                  ┌─┐  │R│  60dp  │ ← BottleGroup top
│                  │D│  │E│        │
│             ┌─┐  │R│  │S│        │
│             │A│  │Y│  │E│        │
│             │M│  │ │  │R│        │
│             │A│  │G│  │V│        │
│             │R│  │I│  │E│        │
│             │O│  │N│  │ │        │
│             └─┘  └─┘  └─┘        │ ← opacity 0.7
│                                  │
│                                  │
│                                  │
│ MY · BUTLER · 2026               │ ← brass mono
│                                  │
│ 당신의 서재,                       │ ← Fraunces 44
│ 한 잔의 기록                       │ ← amber-200 italic
│                                  │
│ 소장한 술과 취향을 기록하고,         │ ← paper-400 14
│ 오늘 밤의 한 잔을 제안받으세요.       │
│                                  │
│ ┌──────────────────────────────┐ │
│ │       계정 만들기              │ │ ← amber-300 fill
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │   이미 있어요 · 로그인           │ │ ← ghost outline
│ └──────────────────────────────┘ │
│                                  │
│  계속 진행 시 이용약관 및...         │ ← center caption
└──────────────────────────────────┘
   28dp   ←   gutter   →   28dp
```

---

## 8. RN 구현 후 자기검증 체크리스트

- [ ] 배경 `#1a1412` 단색
- [ ] BottleGroup `top:60, right:-20, opacity:0.7, zIndex:1`
- [ ] 병 3개 순서: `RESERVE(amber,220) → DRY GIN(clear,180) → AMARO(green,150)`
- [ ] 병 marginRight `-20, -20, 0`, marginBottom `0, -20, -30`
- [ ] ContentBlock `flex:1, justifyContent:'flex-end', zIndex:2`
- [ ] H1 2줄, 2번째 줄만 amber-200 italic
- [ ] CTA 2개 gap 12, 약관 캡션 mt 16, center
- [ ] paddingHorizontal 28, paddingBottom 30+inset
