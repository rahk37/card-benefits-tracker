import { RewardCategory } from './reward-category.model';

export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  network?: string | null;
  annualFeeCents: number;
  business: boolean;
  description?: string | null;
  rewardCategories: RewardCategory[];
}
