export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  name: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: string;    // "MALE" | "FEMALE" | "OTHER"
}

export interface UserPreferenceResponse {
  id: number;
  userId: number;
  categories: string[];
  preferenceDetails?: Record<string, string[]>;
}

export interface SavePreferencesRequest {
  categories: string[];
  preferenceDetails?: Record<string, string[]>;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UsernameResponse {
  username: string;
}
