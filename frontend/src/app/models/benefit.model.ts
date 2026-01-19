export type BenefitType = 'CREDIT' | 'PERK' | 'PROTECTION';

export interface Benefit {
  id: number;
  cardId: number;
  type: BenefitType;
  name: string;
  description?: string | null;
  valueCents?: number | null;
  valueText?: string | null;
}

export interface CardBenefits {
  cardId: number;
  cardName: string;
  benefits: Benefit[];
}
