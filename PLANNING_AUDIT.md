# 나만의 버틀러 — 기획서 점검 결과 (코드 대조)

> 기획서 기재값을 실제 코드베이스(라우트 트리, 컴포넌트, API 클라이언트, package.json)와 1:1 대조한 결과.
> 표기: **맞음** / **다름**(실제값 명시) / **불명확**(코드로 판단 불가)
> 점검일: 2026-05-22 · 대상 브랜치: develop

---

## 요약 표

| # | 항목 | 판정 |
|---|---|---|
| 1 | 인증 가드 `/_debug` 직진(TEMP-DEBUG) | ✅ 맞음 |
| 2 | 온보딩 라우트 매핑 | ✅ 맞음 |
| 3 | `(auth)/login-email` 존재·구현 | ✅ 맞음 |
| 4 | `forgot-password` 2-step | ✅ 맞음 |
| 5 | 인벤토리에 부재료 포함 / IngChip 용도 | ⚠️ 다름 |
| 6 | 잔량 입력 방식 | ⚠️ 다름 |
| 7 | 잔량 30% 빨강 임계값 코드에 존재 | ❌ 다름 |
| 8 | 새 필드 4개 임시 텍스트 입력 | ✅ 맞음 |
| 9 | `bar/insight` 지표 | ⚠️ 다름 |
| 10 | 보틀 "..." 메뉴 가짜 | ✅ 맞음 |
| 11 | `POST /inventory/scan` OCR stub | ❌ 다름 |
| 12 | canMake 판정(보유 vs 잔량) | ⚠️ 다름 |
| 13 | 레시피 데이터 출처 | ⚠️ 다름 |
| 14 | 대체 레시피 추천 로직 | ❌ 다름(없음) |
| 15 | 레시피 별점 BE 연동 | ⚠️ 혼재 |
| 16 | recipes 검색 입력 동작 | ⚠️ 다름 |
| 17 | 팔로우 BE/FE 모두 없음 | ✅ 맞음 |
| 18 | 피드 정렬 기준 | ⚠️ 다름(최신/인기) |
| 19 | 레시피 태그 대상 | ❓ 불명확 |
| 20 | 포스트 작성 "+" 가짜·작성 화면 없음 | ✅ 맞음 |
| 21 | 댓글/대댓글 1-depth·답글/삭제 UI | ⚠️ 부분 |
| 22 | 프로필 바이오 mock·게시물 그리드 미구현 | ✅ 맞음 |
| 23 | 알림 화면/라우트 없음 | ✅ 맞음 |
| 24 | 폴링/푸시 정책 | ❌ 다름(둘 다 없음) |
| 25 | 헤더 unread 뱃지 컴포넌트 | ❌ 다름(없음) |
| 26 | 알림 link 스키마 | ❌ 다름(타입 미구현) |
| 27 | AR 목적/컨셉 코드에 드러남 | ✅ 맞음 |
| 28 | AR placeholder만·Unity 흔적 없음 | ✅ 맞음 |
| 29 | 로딩/빈상태/에러 처리 | ⚠️ 부분 |
| 30 | 모달/바텀시트 없음·전부 풀스크린 | ✅ 맞음 |
| 31 | 토스트 1종 | ❌ 다름(미구현) |
| 32 | 스택 버전 일치 | ✅ 맞음 |
| 33 | axios 설정·refresh 인터셉터 | ✅ 맞음 |
| 34 | 라우트 트리 일치 | ⚠️ 추가/누락 있음 |

---

## A. 인증 / 온보딩

**1. 인증 가드 `/_debug` 직진 — ✅ 맞음**
`app/index.tsx:8`이 무조건 `<Redirect href="/_debug" />`. 라인 4~7에 TEMP-DEBUG 주석("배포 전 (auth)/login으로 원복"). `isAuthenticated` 상태/세터는 `src/store/authStore.ts:29,36`에 존재하나 `index.tsx`에서 사용 안 됨 → 우회 상태. `_layout.tsx`에도 가드 없음(initialize만).

**2. 온보딩 라우트 매핑 — ✅ 맞음**
- signup1→`(auth)/register`: register.tsx:73,86 → `replace('/(onboarding)/step1')`, "01 / 03"
- signup2→`(onboarding)/step1`: step1.tsx:114,131 → step2, "02 / 03" (닉네임/음주경력/생년월일)
- signup3→`(onboarding)/step2`: step2.tsx:74,93 → step3, "03 / 03" (취향 선택)
- welcome→`(onboarding)/step3`: step3.tsx:16 → `replace('/(tabs)')`

**3. `(auth)/login-email` — ✅ 맞음**
완전 구현. zod(email+password 8자), react-hook-form, `authApi.login`(BACKEND_ENABLED 분기), onboardingCompleted 분기(login-email.tsx:51-57).

**4. `forgot-password` 2-step — ✅ 맞음**
forgot-password.tsx:23 `type ResetState = 'input' | 'sent'`. InputView(→`authApi.requestPasswordReset`) → SentView(전송 완료) 2단계.

---

## B. My Bar / 인벤토리

**5. 부재료 포함 / IngChip 용도 — ⚠️ 다름**
`bottle/new.tsx`(제목 "재료 등록")의 등록 대상은 **술병뿐**. 카테고리(:27-37)는 위스키~기타 주류만, 부재료 항목 없음. **IngChip은 인벤토리 등록용 아님** — bottle/new에서 import 안 함. IngChip(6종 lemon/lime/orange/cherry/sugar/salt)은 레시피 표시용 단순 원형. 현재 코드상 어느 화면에서도 실사용 import 미확인.

**6. 잔량 입력 방식 — ⚠️ 다름**
`bottle/new.tsx`에 잔량 입력 UI 없음 — 생성 시 `levelStatus: 'FULL'` 하드코딩(:80). 잔량 변경은 `bottle/[id].tsx`의 "한 잔" 버튼으로 **3단계 enum(FULL→HALF→LOW) 단계 감소**(:21-26,57-73, `inventoryApi.updateLevel`). **%/ml/슬라이더/직접입력 모두 아님.**

**7. 30% 빨강 임계값 — ❌ 다름**
별도 BottleGauge 컴포넌트 없음. `Bottle.tsx`는 `level`(0~1)로 액체 높이 애니메이션(:126-133)만, **30% 임계 빨강 경고 로직 없음**. `red`는 단순 tone 색상(:77,86)일 뿐. 0.3/30% 임계 분기 코드 없음.

**8. 새 필드 4개 임시 텍스트 — ✅ 맞음**
bottle/new.tsx:55-59,208-242 tastingNotes/purchasedAt/purchasePlace/origin 모두 단순 텍스트 입력. 주석에 "디자인 시안 없음, 칩/날짜피커로 교체 예정, NEEDS_DESIGN.md 참조" 명시.

**9. `bar/insight` 지표 — ⚠️ 다름**
실제 표시: 총 보유 병 수, 총 가치(원), 만들 수 있는 칵테일 수, 유통기한 경고 수, 카테고리별 분포 막대, Butler 추천(임박 항목). **"월간 소비 통계" 아님** — 시간축 소비량 지표 없음. 컬렉션 현황/유통기한 중심.

**10. "..." 메뉴 가짜 — ✅ 맞음**
bottle/[id].tsx:101 점3개 IconBtn → `router.push('/_debug')`. `inventoryApi.remove/update`는 inventory.ts:47-57에 있으나 화면에서 미호출.

**11. `POST /inventory/scan` OCR stub — ❌ 다름**
scan 엔드포인트 **존재하지 않음** — inventory.ts에 scan 메서드 없고 src 전체 scan/ocr 매치 0건. bottle/new.tsx:110-133 "라벨 스캔" 카드는 onPress 없는 **순수 정적 View**(장식용). BE stub 흔적 없음.

---

## C. Recipe

**12. canMake 판정 — ⚠️ 다름 (보유 여부만, 휴리스틱)**
`canMake` 식별자는 코드에 없음(문서에만 존재). 실제 판정은 `recipe/[id]/missing.tsx`의 `hasIngredient`(:38-44) — **인벤토리 보틀 이름과 재료명 단순 substring 매칭**(주석에 "휴리스틱이 최선"). 잔량 전혀 계산 안 함. recipes 탭 "지금 만들 수 있어요"는 BE `home.availableRecipes`를 그대로 신뢰(recipes.tsx:103).

**13. 레시피 데이터 출처 — ⚠️ 다름**
mock 아님, BE API 기반(`recipeApi.getHome/search/getById`). 커스텀 레시피 개념 존재 — `recipeApi.listMine`(`GET /recipes/my`, recipe.ts:41), `RecipeSummary.isCustom`(types/recipe.ts:46). **단, 레시피 생성 API·화면 없음**(createRecipe/POST /recipes 부재). 프로필 RECIPES 탭은 빈 문구만.

**14. 대체 레시피 추천 — ❌ 다름 (없음)**
missing.tsx는 부족 재료 나열 + 각 행 누르면 `/bottle/new`로 이동(:171, "↳ 추가하기")만. 대체 레시피 추천 로직·기준 없음.

**15. 레시피 별점 — ⚠️ 혼재**
화면(recipe/[id].tsx) 별점/즐겨찾기는 **로컬 state 토글뿐**(`favorited` useState:48, API 미호출). BE는 존재: `recipeApi.upsertRating/getMyRating/deleteMyRating`(recipe.ts:71-88), 타입 `averageRating`·`ratingCount`(types/recipe.ts:43-44). **결론: BE endpoint 구현됐으나 화면 미연결, 평균 별점 UI 없음.**

**16. recipes 검색 — ⚠️ 다름**
검색 TextInput 자체가 화면에 없음. 돋보기 버튼은 `router.push('/_debug')` 가짜(recipes.tsx:111). 단, 필터 칩(위스키/진/논알콜 등)은 실제 `recipeApi.search` 호출로 동작(:64-80).

---

## D. Community

**17. 팔로우 BE/FE 모두 없음 — ✅ 맞음**
follow API src/api 어디에도 없음. profile.tsx:138-139 "팔로우" 버튼은 `/_debug` 가짜. post/[id].tsx의 `followBtn` 스타일은 "AR" 배지에 재사용됨(:178-181) — 팔로우 아님.

**18. 피드 정렬 — ⚠️ 다름 (최신/인기 2종)**
`FILTERS = [All/LATEST, 인기/POPULAR]`(feed.tsx:23-26), `PostSortKey = 'LATEST' | 'POPULAR'`(types/post.ts:86). `GET /posts?sort=`. **팔로잉 정렬 없음.**

**19. 레시피 태그 대상 — ❓ 불명확**
`CreatePostRequest.recipeId`(types/post.ts:83) 하나만. `RecipeTag`는 recipeId/recipeName만(:14-17) → 베이스/커스텀 구분 불가. **게시글 작성 화면 자체가 없어**(20번) 태그 선택 UI 확인 불가. 커스텀 레시피 id도 가리킬 수 있으나 코드상 제약 없어 단정 불가.

**20. 포스트 작성 "+" 가짜·화면 없음 — ✅ 맞음**
feed.tsx:95 "+" → `/_debug`. 작성 화면 라우트(post/new 등) 없음. `CreatePostRequest` 타입은 있으나 `postApi.create`도 없음.

**21. 댓글/대댓글 1-depth·답글/삭제 UI — ⚠️ 부분**
- 데이터·API는 1-depth 완비: `CommentResponse.replies`(types/post.ts:63), `addReply/deleteReply/deleteComment/remove`(post.ts:39,73-87).
- **화면(post/[id].tsx)에는** 답글 개수 텍스트만(`답글 N`, :252-254). **답글 입력창·대댓글 목록 렌더링·댓글/게시글 삭제 UI 전부 없음.** 댓글 작성 입력창은 1-depth만(:272-287).

**22. 프로필 바이오 mock·그리드 미구현 — ✅ 맞음**
바이오 하드코딩("위스키 3년차 · 스모키한…", profile.tsx:132-135), eyebrow "SEOUL · HOME BAR"(:130) 고정. 게시물 그리드 미구현 — POSTS/RECIPES/SAVED 탭 빈 문구만(:183-189). `postApi.listMine`은 있으나 미호출. 단, 상단 통계(POSTS/LIKES/RECIPES)·THE SHELF 보틀은 실제 BE 데이터(:42-55).

---

## E. 알림

**23. 알림 화면/라우트 없음 — ✅ 맞음**
app/ 전체 notification 라우트 없음. notification/알림 매치는 전부 문서(.md). src/api에도 notification 모듈 없음(auth/user/inventory/recipe/post 5종만).

**24. 폴링/푸시 — ❌ 다름 (둘 다 없음)**
`expo-notifications` 의존성 없음(package.json:15-51). setInterval/refetchInterval/polling/addNotificationListener 매치 0건. **폴링 정책·푸시 연동 모두 부재.**

**25. unread 뱃지 컴포넌트 — ❌ 다름 (없음)**
`unread` 매치 0건. badge 매치는 전부 무관(post의 RECIPE 뱃지, feed의 AR 뱃지). 헤더(AppBar)에 unread 뱃지 없음.

**26. 알림 link 스키마 — ❌ 다름 (타입 미구현)**
src/types에 notification 타입 없음(common/recipe/post/auth/inventory/user 6종만). `INVENTORY_DETAIL`/`POST_DETAIL`/`targetId` 스키마 코드 0건. **claim 스키마는 FE에 미구현.**

---

## F. AR

**27. AR 목적/컨셉 — ✅ 맞음**
ar.tsx:42 "카메라로 술병을 비추면 바로 인벤토리에 등록할 수 있어요." → **병 인식 → 인벤토리 자동 등록** 컨셉 명시. AR 전용 api 모듈은 없음(참고: post 타입에 AR 세션 관련 필드 존재, types/post.ts:26).

**28. AR placeholder만·Unity 흔적 없음 — ✅ 맞음**
ar.tsx 전체가 정적 "COMING SOON / AR 모드 준비 중"(:37-43). Unity/MCP 코드·import 전혀 없음.

---

## G. 디자인 / 상태 처리

**29. 로딩/빈상태/에러 — ⚠️ 부분**
- 로딩: `ActivityIndicator` 다수 화면(index, recipes, feed, recipe/[id], missing, post/[id], bar/insight). **스켈레톤 없음, 전부 스피너.** bottle/new는 없음.
- 빈 상태: 구현됨(index.tsx:175-177 "아직 등록된 보틀이 없어요", feed.tsx:135-137 "아직 게시물이 없어요").
- 에러/네트워크 끊김: **전용 처리 미흡.** Alert/parseApiError/catch 46건 있으나 대부분 폼·상세 fetch용. 리스트 화면(feed/index/recipes)에 "네트워크 끊김/재시도" 전용 에러 UI 없음.

**30. 모달/바텀시트 없음·전부 풀스크린 — ✅ 맞음**
`Modal`/`BottomSheet` import·사용 0건. 전부 풀스크린 라우트 분기.

**31. 토스트 1종 — ❌ 다름 (미구현)**
`Toast`/`toast` 컴포넌트·사용 0건. "카운터에 추가되었어요" 문구 없음. 유사 텍스트는 버튼 라벨 "카운터에 추가"(bottle/new.tsx:252)뿐. **토스트 시스템 미구현.**

---

## H. 기술 스택 / 공통

**32. 스택 버전 — ✅ 맞음**
package.json: `expo: ~54.0.34`, `react-native: 0.81.5`, `react: 19.1.0`. tsconfig.json:4 `"strict": true`. 전부 일치.

**33. axios 설정 — ✅ 맞음**
client.ts:31 `baseURL: ${BASE_URL}/api/v1`(BASE_URL=`EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'`), timeout 10000(10s), refresh 인터셉터 실제 구현(:75-139, 401→`/auth/refresh` 재발급 + failedQueue 동시성 + rotation 저장).

**34. 라우트 트리 — ⚠️ 추가/누락 있음**
실제 25개 화면 파일:
- `(auth)`: login, login-email, register, forgot-password (+_layout)
- `(onboarding)`: step1, step2, step3 (+_layout)
- `(tabs)`: index(홈), recipes, feed, ar, profile (+_layout)
- 스택: bottle/[id], bottle/new, bar/insight, recipe/[id], recipe/[id]/missing, post/[id]
- 루트: index, _layout
- **추가(예상 외):** `app/_debug.tsx`, `app/_test-bottle.tsx` — 디버그/테스트용
- **누락:** 알림, 게시글 작성 폼, 검색 결과, 설정 화면 (CLAUDE.md §14 보류 목록과 일치)

---

## 기획서 반영 시 핵심 정정 포인트

1. **잔량 = 3단계 enum(FULL/HALF/LOW)**, %/ml 아님. "한 잔" 버튼으로 단계 감소. (#6)
2. **30% 빨강 경고 임계값은 코드에 없음** — 디자인 의도일 뿐 미구현. (#7)
3. **라벨 OCR(scan)은 BE 엔드포인트조차 없음** — FE 카드는 장식용 정적 View. (#11)
4. **canMake는 이름 substring 매칭 휴리스틱**, 잔량 미반영. (#12)
5. **별점·검색·포스트작성·팔로우·답글·삭제·알림**은 BE 일부만 있고 FE는 `/_debug` 가짜 또는 미구현. (#15,16,17,20,21,23)
6. **알림 link 스키마는 FE 타입에 아예 없음** — 기획서 스키마는 BE 명세 추정값일 가능성. (#26)
7. **토스트 시스템 미구현** — 기존 기획서의 "토스트 1종" 기재는 디자인 명세일 뿐. (#31)
8. **bar/insight는 "월간 소비 통계"가 아니라 컬렉션/유통기한 현황**. (#9)
