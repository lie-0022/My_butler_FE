/**
 * Recipe 도메인 타입.
 * BE: com.mybutler.recipe.dto (RecipeRequest/Response.kt),
 *     com.mybutler.recipe.entity.Recipe
 */

// ─── Enum ──────────────────────────────────────────────────────────────────

export type RecipeCategory =
  | 'CLASSIC'
  | 'TROPICAL'
  | 'WHISKEY'
  | 'GIN'
  | 'VODKA'
  | 'NON_ALCOHOLIC';

export type BaseSpirit =
  | 'WHISKEY'
  | 'VODKA'
  | 'RUM'
  | 'GIN'
  | 'TEQUILA'
  | 'LIQUEUR'
  | 'OTHER'
  | 'NONE';

/** UserPreference.TastePreference와 값은 동일하지만 별도 enum. */
export type TasteTag = 'SWEET' | 'SOUR' | 'BITTER' | 'STRONG' | 'LIGHT';

// ─── Response ──────────────────────────────────────────────────────────────

export interface RecipeSummary {
  id: number;
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  category: RecipeCategory;
  baseSpirit?: BaseSpirit | null;
  /** 1~3 */
  difficulty: number;
  estimatedMinutes?: number | null;
  abv?: number | null;
  averageRating: number;
  ratingCount: number;
  tasteTags: TasteTag[];
  isCustom: boolean;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  amount?: string | null;
  unit?: string | null;
  displayOrder: number;
}

export interface RecipeStep {
  id: number;
  stepOrder: number;
  description: string;
}

export interface RecipeDetailResponse extends RecipeSummary {
  authorId?: number | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  communityPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeHomeResponse {
  availableRecipes: RecipeSummary[];
  nearlyAvailableRecipes: RecipeSummary[];
  preferenceRecommendations: RecipeSummary[];
}

export interface RecipeRecommendationResponse {
  availableRecipes: RecipeSummary[];
  nearlyAvailableRecipes: RecipeSummary[];
}

// ─── Rating ────────────────────────────────────────────────────────────────

export interface RecipeRatingResponse {
  id: number;
  recipeId: number;
  userId: number;
  /** 1~5 */
  score: number;
  comment?: string | null;
  createdAt: string;
}

export interface UpsertRatingRequest {
  score: number;
  comment?: string;
}
