import apiClient, { tokenStorage } from './client';
import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  ApiResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '../types/auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const authApi = {
  /** 아이디 중복 확인 */
  checkUsername: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    const res = await apiClient.get('/auth/check-username', {
      params: { username },
    });
    return res.data;
  },

  /** 회원가입 */
  register: async (data: RegisterRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await apiClient.post('/auth/register', data);
    // access token 저장
    const accessToken = res.data?.data?.accessToken;
    if (accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    }
    return res.data;
  },

  /** 로그인 */
  login: async (data: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await apiClient.post('/auth/login', data);
    const accessToken = res.data?.data?.accessToken;
    if (accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    }
    return res.data;
  },

  /** 토큰 갱신 */
  refresh: async (): Promise<ApiResponse<TokenResponse>> => {
    const refreshCookie = await tokenStorage.getRefreshCookie();
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      {},
      {
        headers: {
          Cookie: `refresh_token=${refreshCookie}`,
        },
      },
    );
    const accessToken = res.data?.data?.accessToken;
    if (accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    }
    return res.data;
  },

  /** 로그아웃 */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await tokenStorage.clear();
    }
  },

  /** 비밀번호 재설정 요청 (이메일 발송) */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<ApiResponse<null>> => {
    const res = await apiClient.post('/auth/password/reset-request', data);
    return res.data;
  },

  /** 비밀번호 재설정 확인 */
  resetPassword: async (data: PasswordResetConfirm): Promise<ApiResponse<null>> => {
    const res = await apiClient.post('/auth/password/reset', data);
    return res.data;
  },
};
