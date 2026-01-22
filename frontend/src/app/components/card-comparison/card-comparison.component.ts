import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../../models/credit-card.model';

@Component({
  selector: 'app-card-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-comparison.component.html',
  styleUrls: ['./card-comparison.component.scss']
})
export class CardComparisonComponent {
  @Input({ required: true }) cards: CreditCard[] = [];

  getTopRewards(card: CreditCard): string {
    return card.description;
  }

  formatFee(annualFee: string): string {
    return annualFee;
  }
}
