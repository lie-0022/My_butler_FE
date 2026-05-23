import apiClient from './client';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  BaseSpirit,
  RecipeCategory,
  RecipeDetailResponse,
  RecipeHomeResponse,
  RecipeRatingResponse,
  RecipeRecommendationResponse,
  RecipeSummary,
  UpsertRatingRequest,
} from '../types/recipe';

interface RecipeSearchParams {
  category?: RecipeCategory;
  baseSpirit?: BaseSpirit;
  /** 1~3 */
  difficulty?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const recipeApi = {
  /** GET /recipes/home — Recipe Book 홈 (3가지 추천 묶음) */
  getHome: async () => {
    const res = await apiClient.get<ApiResponse<RecipeHomeResponse>>('/recipes/home');
    return res.data;
  },

  /** GET /recipes — 베이스 레시피 검색/필터 */
  search: async (params?: RecipeSearchParams) => {
    const res = await apiClient.get<ApiResponse<PageResponse<RecipeSummary>>>('/recipes', {
      params,
    });
    return res.data;
  },

  /** GET /recipes/my — 내가 만든 커스텀 레시피 */
  listMine: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<RecipeSummary>>>('/recipes/my', {
      params,
    });
    return res.data;
  },

  /** GET /recipes/recommended/by-inventory — 내 인벤토리 기반 추천 */
  getByInventory: async () => {
    const res = await apiClient.get<ApiResponse<RecipeRecommendationResponse>>(
      '/recipes/recommended/by-inventory',
    );
    return res.data;
  },

  /** GET /recipes/recommended/by-preference — 내 취향 기반 추천 */
  getByPreference: async () => {
    const res = await apiClient.get<ApiResponse<PageResponse<RecipeSummary>>>(
      '/recipes/recommended/by-preference',
    );
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<RecipeDetailResponse>>(`/recipes/${id}`);
    return res.data;
  },

  // ─── Rating ──────────────────────────────────────────────────────────────

  upsertRating: async (recipeId: number, data: UpsertRatingRequest) => {
    const res = await apiClient.post<ApiResponse<RecipeRatingResponse>>(
      `/recipes/${recipeId}/ratings`,
      data,
    );
    return res.data;
  },

  getMyRating: async (recipeId: number) => {
    const res = await apiClient.get<ApiResponse<RecipeRatingResponse>>(
      `/recipes/${recipeId}/ratings/me`,
    );
    return res.data;
  },

  deleteMyRating: async (recipeId: number) => {
    await apiClient.delete(`/recipes/${recipeId}/ratings/me`);
  },
};
