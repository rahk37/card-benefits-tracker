import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../../models/credit-card.model';
import { CardComparisonComponent } from '../card-comparison/card-comparison.component';
import { getIssuerImageUrl } from '../../utils/card-images';
import { CardSummary, OptimizationResponse } from '../../models/optimization.model';

@Component({
  selector: 'app-benefits-overview',
  standalone: true,
  imports: [CommonModule, CardComparisonComponent],
  templateUrl: './benefits-overview.component.html',
  styleUrls: ['./benefits-overview.component.scss']
})
export class BenefitsOverviewComponent {
  @Input() selectedCards: CreditCard[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() optimizationResult?: OptimizationResponse;
  @Input() hasSpendInputs = false;

  getImageUrl(card: CreditCard): string {
    return getIssuerImageUrl(card.issuer);
  }

  formatCategory(category: string): string {
    return category.replace(/-/g, ' ');
  }

  getMonthlyFee(card: CreditCard): string {
    if (!card.annualFeeCents) {
      return '$0';
    }
    return `$${(card.annualFeeCents / 100 / 12).toFixed(2)}`;
  }

  getSummary(card: CreditCard): CardSummary | undefined {
    return this.optimizationResult?.cardSummaries?.find((summary) => summary.cardId === card.id);
  }

  getEstimatedYearlyReward(card: CreditCard): string {
    const summary = this.getSummary(card);
    if (!summary) {
      return '$0';
    }
    return `$${summary.yearlyNetRewards.toFixed(0)}`;
  }
}
