/**
 * Auth 도메인 타입.
 * BE: com.mybutler.auth.dto (AuthRequest.kt / AuthResponse.kt)
 *
 * 주요 규칙:
 *  - login은 email + password (username 아님)
 *  - register는 email + username + password + 3가지 동의 플래그
 *  - TokenResponse에 onboardingCompleted 포함 (로그인 후 라우팅 분기에 사용)
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  /** 8자+, 문자+숫자+특수문자 */
  password: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}
/**
 * 가입 시 username은 더 이상 받지 않는다. BE가 `user_<random8>` 형식으로 자동 생성하고,
 * 사용자는 온보딩 step1에서 PATCH /users/me/username 으로 닉네임을 교체한다.
 * (BE PR #20 변경 사항)
 */

export interface TokenResponse {
  accessToken: string;
  /** PR #18 이후 body로 내려옴 (이전엔 HttpOnly Cookie). 7일 TTL, rotation. */
  refreshToken: string;
  /** true면 메인 탭으로, false면 온보딩으로 라우팅 */
  onboardingCompleted: boolean;
}

export interface CheckUsernameResponse {
  available: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}
