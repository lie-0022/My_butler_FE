import apiClient, { tokenStorage } from './client';
import type {
  CheckUsernameResponse,
  LoginRequest,
  PasswordResetConfirm,
  PasswordResetRequest,
  RegisterRequest,
  TokenResponse,
} from '../types/auth';
import type { ApiResponse } from '../types/common';

/**
 * 토큰 응답에서 accessToken + refreshToken을 SecureStore에 저장.
 * register / login / refresh 응답 후 공통 처리.
 */
const persistTokens = async (tokens?: TokenResponse) => {
  if (!tokens) return;
  if (tokens.accessToken) {
    await tokenStorage.setAccessToken(tokens.accessToken);
  }
  if (tokens.refreshToken) {
    await tokenStorage.setRefreshToken(tokens.refreshToken);
  }
};

export const authApi = {
  /** 아이디(=username) 중복 확인 */
  checkUsername: async (username: string): Promise<ApiResponse<CheckUsernameResponse>> => {
    const res = await apiClient.get('/auth/check-username', { params: { username } });
    return res.data;
  },

  /** 회원가입 — 응답 body의 accessToken + refreshToken 자동 저장 */
  register: async (data: RegisterRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/register', data);
    await persistTokens(res.data?.data);
    return res.data;
  },

  /** 로그인 — email + password */
  login: async (data: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', data);
    await persistTokens(res.data?.data);
    return res.data;
  },

  /**
   * 토큰 갱신.
   * PR #18 이후 BE는 body의 refresh_token을 읽음. cookie 방식 폐기.
   * client.ts의 401 인터셉터가 이미 같은 로직으로 처리하므로 이 함수는
   * 수동 갱신이 필요한 케이스(예: 앱 시작 직후 토큰 검증)에만 호출.
   */
  refresh: async (): Promise<ApiResponse<TokenResponse>> => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');
    const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh', {
      refreshToken,
    });
    await persistTokens(res.data?.data);
    return res.data;
  },

  /** 로그아웃 — 서버 호출 + 로컬 토큰 클리어 */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await tokenStorage.clear();
    }
  },

  requestPasswordReset: async (data: PasswordResetRequest): Promise<ApiResponse<null>> => {
    const res = await apiClient.post('/auth/password/reset-request', data);
    return res.data;
  },

  resetPassword: async (data: PasswordResetConfirm): Promise<ApiResponse<null>> => {
    const res = await apiClient.post('/auth/password/reset', data);
    return res.data;
  },
};
