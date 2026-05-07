# Verification Setup Guide

> 화면 작업을 검증하는 두 가지 트랙 — **Expo Web (Claude 셀프 검증용)** 과 **Expo Go (사용자 최종 확인용)** 의 셋업 가이드.
> 한 번 셋업해두면 이후 모든 작업이 이 환경에서 돌아간다.

---

## 트랙 1 — Expo Web + Chrome 확장 (Claude 셀프 검증)

Claude가 자기 결과물을 직접 보고 디자인과 비교할 때 쓰는 트랙. 1차 검증 / 빠른 반복용.

### 1-1. Chrome 확장 "Claude in Chrome" 설치

1. Chrome 웹스토어에서 **Claude in Chrome** 확장 설치 (또는 Anthropic 안내 링크에서)
2. 확장 아이콘 클릭 → **Claude Max 계정으로 로그인**
3. 로그인 후 확장이 활성 상태인지 확인 (아이콘에 색이 들어옴)

### 1-2. Claude Code 세션에서 활성화

1. 이 프로젝트 폴더에서 Claude Code 세션 시작
2. `/chrome` 슬래시 커맨드 입력 → 확장과의 연결 시도
3. Chrome 창에서 연결 승인 팝업이 뜨면 **Connect** 클릭
4. Claude가 "browser tools available" 메시지를 띄우면 셋업 완료

### 1-3. Expo Web 서버 띄우기 (사용자 측)

```bash
npx expo start --web
```

- 자동으로 브라우저에서 `http://localhost:8081`(또는 다음 포트) 열림
- 이 탭을 **그대로 둔 채** Claude에게 "지금 화면 확인해" 요청
- Claude는 Chrome 확장으로 풀페이지 스크린샷을 찍어 디자인과 비교

### 1-4. 사용 시 주의

- **풀페이지 스크린샷 1장만 사용**. 섹션별로 여러 번 캡처하지 말 것 (토큰 낭비)
- 로그인 / 모달 / 토스트는 직접 dismiss 후 검증 시작
- Web에서 안 되는 동작은 트랙 2로

---

## 트랙 2 — Expo Go + 폰 (사용자 최종 확인)

네이티브 동작(SafeArea·키보드·제스처)은 반드시 폰에서 확인.

### 2-1. 폰에 Expo Go 설치

| 플랫폼  | 설치 |
| ------- | --- |
| iOS     | App Store에서 "Expo Go" 검색 → 설치 |
| Android | Play Store에서 "Expo Go" 검색 → 설치 |

### 2-2. 첫 QR 스캔 연결

1. 프로젝트 루트에서 `npx expo start` 실행 (web 플래그 없이)
2. 터미널에 QR 코드 출력
3. **iOS**: 카메라 앱으로 QR 스캔 → "Expo Go에서 열기" 탭
4. **Android**: Expo Go 앱 안에서 "Scan QR code" 탭 → 스캔
5. 번들 다운로드 후 앱이 폰에 뜸

### 2-3. Wi-Fi 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| QR 스캔 후 "Network response timed out" | 폰과 PC가 다른 Wi-Fi (5GHz vs 2.4GHz 등). 같은 SSID에 접속 |
| 같은 Wi-Fi인데도 연결 안 됨 | `npx expo start --tunnel` 사용 (느리지만 NAT 우회) |
| 회사·학교 Wi-Fi에서 차단 | `--tunnel` 사용. 또는 폰 핫스팟에 PC 연결 |
| 연결 후 흰 화면 | 캐시 이슈. Expo Go에서 **Shake → Reload** |

---

## 두 트랙 사용 시점 정리

| 작업 단계 | 트랙 1 (Web) | 트랙 2 (폰) |
|---|:-:|:-:|
| 화면 1차 구현 (Claude) | ✅ 셀프 검증 | — |
| 디자인 매칭 (간격·색·정렬) | ✅ | — |
| 빠른 스타일 반복 | ✅ | — |
| SafeArea · 노치 처리 확인 | ❌ | ✅ |
| 키보드 동작 확인 | ❌ | ✅ |
| 제스처(스와이프 백) 확인 | ❌ | ✅ |
| 토큰 저장(SecureStore) 확인 | ❌ | ✅ |
| 최종 인수 검증 | — | ✅ |

---

## FAQ

**Q1. Web에서 SafeArea가 안 보여요. 화면이 노치에 가려진 것처럼.**
정상입니다. `useSafeAreaInsets()`는 web에서 항상 `{ top: 0, bottom: 0, left: 0, right: 0 }`을 반환합니다. SafeArea 보정은 트랙 2(폰)에서만 검증됩니다.

**Q2. 콘솔에 `expo-secure-store` 관련 경고가 떠요.**
정상입니다. `expo-secure-store`는 web에서 미지원이라 SDK가 localStorage 폴백을 쓰며 경고를 출력합니다. 트랙 2(폰)에서는 정상 동작합니다.

**Q3. Web에서 Reanimated 애니메이션이 어색해요.**
일부 Reanimated 동작(특히 worklets)이 web에서 완전 호환되지 않습니다. Toggle/ProgressDots 같은 단순 `Animated.timing`은 잘 됩니다. 의심되면 폰에서 확인.

**Q4. 폰에서 Expo Go가 자꾸 끊겨요.**
- PC 절전 모드 → Wi-Fi 끊김. 절전 끄기.
- 회사 Wi-Fi → `npx expo start --tunnel` 또는 폰 핫스팟.
- 같은 Wi-Fi인데 안 되면 PC 방화벽에서 8081 포트 허용.

**Q5. Web 빌드는 되는데 화면이 안 떠요.**
브라우저 콘솔에서 에러 확인. 가장 흔한 원인:
- 라우트 파일에 `default export` 누락
- 폰에서만 동작하는 native 모듈을 web에서 import (try/catch 또는 Platform.OS 분기)
- `npx expo start --clear`로 캐시 초기화 후 재시도
