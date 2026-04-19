import apiClient from './client';
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  UserPreferenceResponse,
  SavePreferencesRequest,
  UpdateUsernameRequest,
  UsernameResponse,
} from '../types/user';
import type { ApiResponse } from '../types/auth';

export const userApi = {
  /** 내 프로필 조회 */
  getMyProfile: async (): Promise<ApiResponse<UserProfileResponse>> => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  /** 기본 정보 저장 (온보딩 Step 2) */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfileResponse>> => {
    const res = await apiClient.patch('/users/me/profile', data);
    return res.data;
  },

  /** 취향 저장 (온보딩 Step 3) */
  savePreferences: async (
    data: SavePreferencesRequest,
  ): Promise<ApiResponse<UserPreferenceResponse>> => {
    const res = await apiClient.post('/users/me/preferences', data);
    return res.data;
  },

  /** 취향 조회 */
  getPreferences: async (): Promise<ApiResponse<UserPreferenceResponse>> => {
    const res = await apiClient.get('/users/me/preferences');
    return res.data;
  },

  /** 닉네임 변경 */
  updateUsername: async (
    data: UpdateUsernameRequest,
  ): Promise<ApiResponse<UsernameResponse>> => {
    const res = await apiClient.patch('/users/me/username', data);
    return res.data;
  },
};
