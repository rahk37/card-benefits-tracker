import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../../models/credit-card.model';
import { CardComparisonComponent } from '../card-comparison/card-comparison.component';
import { getIssuerImageUrl } from '../../utils/card-images';

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

  getImageUrl(card: CreditCard): string {
    return getIssuerImageUrl(card.issuer);
  }
}
