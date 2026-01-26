export interface OptimizationRequest {
  selectedCardIds: number[];
  monthlySpendByCategory: Record<string, number>;
  household?: boolean;
  householdSplit?: Record<string, number>;
  includeAllCards?: boolean;
}

export interface CategoryReward {
  category: string;
  monthlySpend: number;
  rateValue: number;
  earnRate: string;
  monthlyReward: number;
  notes?: string | null;
}

export interface CardSummary {
  cardId: number;
  cardName: string;
  issuer: string;
  type: string;
  annualFeeCents: number;
  annualFee: string;
  description: string;
  imageUrl: string;
  categoryRewards: CategoryReward[];
  monthlyRewards: number;
  yearlyRewards: number;
  monthlyNetRewards: number;
  yearlyNetRewards: number;
}

export interface CategoryWinner {
  category: string;
  cardId: number;
  cardName: string;
  rateValue: number;
  earnRate: string;
  notes?: string | null;
  perks?: string[];
}

export interface Recommendation {
  cardId: number;
  cardName: string;
  monthlyNetRewards: number;
  yearlyNetRewards: number;
  reasoning: string;
}

export interface SimilarCardRecommendation {
  currentCardId: number;
  currentCardName: string;
  alternativeCardId: number;
  alternativeCardName: string;
  annualFeeSavingsCents: number;
  sharedCategories: string[];
  currentOnlyCategories: string[];
  alternativeOnlyCategories: string[];
  reasoning: string;
}

export interface OptimizationResponse {
  cardSummaries: CardSummary[];
  bestByCategory: CategoryWinner[];
  topRecommendations: Recommendation[];
  similarCardRecommendations: SimilarCardRecommendation[];
  optimizationTips: string[];
}
