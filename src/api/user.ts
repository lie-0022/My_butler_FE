import apiClient from './client';
import type {
  MyProfileResponse,
  SavePreferencesRequest,
  UpdateProfileRequest,
  UpdateUsernameRequest,
  UserPreferenceResponse,
  UserProfileResponse,
  UsernameResponse,
} from '../types/user';
import type { ApiResponse } from '../types/common';

export const userApi = {
  /** GET /users/me — 인증된 사용자의 프로필 (탭 진입 시 호출) */
  getMyProfile: async (): Promise<ApiResponse<UserProfileResponse>> => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  /**
   * GET /users/me/profile — 마이프로필 화면 병합 응답.
   * profile + stats(postCount/receivedLikeCount/myRecipeCount) + 최근 게시물 9개.
   */
  getMyProfilePage: async (): Promise<ApiResponse<MyProfileResponse>> => {
    const res = await apiClient.get('/users/me/profile');
    return res.data;
  },

  /**
   * PATCH /users/me/profile — gender/ageGroup/drinkingFrequency 보강용.
   * 디자인의 step1 "닉네임/생일/레벨"과는 매핑되지 않음 (별도 엔드포인트 사용).
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfileResponse>> => {
    const res = await apiClient.patch('/users/me/profile', data);
    return res.data;
  },

  /** POST /users/me/preferences — 디자인 step2 "취향+플레이버" 매핑 위치 */
  savePreferences: async (
    data: SavePreferencesRequest,
  ): Promise<ApiResponse<UserPreferenceResponse>> => {
    const res = await apiClient.post('/users/me/preferences', data);
    return res.data;
  },

  getPreferences: async (): Promise<ApiResponse<UserPreferenceResponse>> => {
    const res = await apiClient.get('/users/me/preferences');
    return res.data;
  },

  /** PATCH /users/me/username — 닉네임 변경. 디자인 step1 "닉네임" 매핑 위치 */
  updateUsername: async (data: UpdateUsernameRequest): Promise<ApiResponse<UsernameResponse>> => {
    const res = await apiClient.patch('/users/me/username', data);
    return res.data;
  },
};
