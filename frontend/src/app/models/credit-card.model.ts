export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  annualFee: string;
  description: string;
  imageUrl: string;
  categories: string[];
}
