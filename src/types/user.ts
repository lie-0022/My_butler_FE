/**
 * User 도메인 타입.
 * BE: com.mybutler.auth.entity.User, com.mybutler.user.entity.UserPreference,
 *     com.mybutler.user.dto (UserRequest.kt / UserResponse.kt)
 *
 * 참고: BE PR #20에서 birth_date 컬럼 추가, TastePreference enum 5종 확장.
 *      "닉네임"은 BE의 username. 별도 엔드포인트(PATCH /users/me/username)로 변경.
 */

import type { PageResponse } from './common';

// ─── Enum (BE source: User.kt, UserPreference.kt) ──────────────────────────

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AgeGroup = 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'FIFTIES_PLUS';
export type DrinkingFrequency = 'RARELY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';

/**
 * BE PR #20에서 5개(SMOKY/SPICY/FRUITY/CITRUS/DRY) 신규 추가. 기존 5개는
 * 이미 저장된 데이터 호환 위해 유지. 디자인 플레이버 칩과 1:1 매핑 가능.
 */
export type TastePreference =
  | 'SWEET'
  | 'SOUR'
  | 'BITTER'
  | 'STRONG'
  | 'LIGHT'
  | 'SMOKY'
  | 'SPICY'
  | 'FRUITY'
  | 'CITRUS'
  | 'DRY';
export type PreferredAbv = 'LOW' | 'MEDIUM' | 'HIGH';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// ─── Response ──────────────────────────────────────────────────────────────

export interface UserProfileResponse {
  id: number;
  email: string;
  /** = 닉네임. FE에서 user.name으로 쓰던 자리. */
  username: string;
  profileImageUrl?: string | null;
  gender?: Gender | null;
  ageGroup?: AgeGroup | null;
  drinkingFrequency?: DrinkingFrequency | null;
  /** ISO date "YYYY-MM-DD" (BE PR #20에서 추가) */
  birthDate?: string | null;
  onboardingCompleted: boolean;
}

export interface UserPreferenceResponse {
  tastePreferences: TastePreference[];
  preferredAbv?: PreferredAbv | null;
  experienceLevel?: ExperienceLevel | null;
}

export interface UsernameResponse {
  username: string;
}

// ─── My Profile (마이프로필 화면 병합 응답) ────────────────────────────────
// GET /users/me/profile — profile + stats + posts 한 번에. 마이프로필 화면 진입용.

export interface MyProfileUser {
  id: number;
  username: string;
  email: string;
}

export interface MyProfileStats {
  postCount: number;
  receivedLikeCount: number;
  myRecipeCount: number;
}

export interface MyPostSummary {
  id: number;
  type: 'PHOTO' | 'TEXT';
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface MyProfileResponse {
  profile: MyProfileUser;
  stats: MyProfileStats;
  posts: PageResponse<MyPostSummary>;
}

// ─── Request ───────────────────────────────────────────────────────────────

/** PATCH /users/me/profile — gender/ageGroup/drinkingFrequency/birthDate 보강. */
export interface UpdateProfileRequest {
  gender?: Gender;
  ageGroup?: AgeGroup;
  drinkingFrequency?: DrinkingFrequency;
  /** "YYYY-MM-DD" — BE PR #20 추가 필드 */
  birthDate?: string;
}

/** POST /users/me/preferences — 온보딩 step2 (디자인의 취향 + 플레이버) 매핑 위치. */
export interface SavePreferencesRequest {
  /** @NotEmpty. 디자인 8개 카드 중 BE enum과 매칭되는 항목을 5종으로 변환해 전송. */
  tastePreferences: TastePreference[];
  preferredAbv?: PreferredAbv;
  experienceLevel?: ExperienceLevel;
}

/** PATCH /users/me/username — 닉네임 변경. 디자인의 step1 "닉네임" 매핑 위치. */
export interface UpdateUsernameRequest {
  username: string;
}
