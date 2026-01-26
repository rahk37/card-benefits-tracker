export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  annualFee: string;
  annualFeeCents?: number;
  description: string;
  imageUrl: string;
  categories: string[];
  rewardCategories: RewardCategory[];
  perks?: string[];
  officialReference?: string;
}

export interface RewardCategory {
  category: string;
  earnRate: string;
  rateValue: number;
  notes?: string | null;
  monthlyCap?: number | null;
}
