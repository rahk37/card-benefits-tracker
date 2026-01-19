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

  formatFee(annualFeeCents: number): string {
    if (annualFeeCents === 0) {
      return 'No annual fee';
    }
    return `$${(annualFeeCents / 100).toFixed(0)}`;
  }
}
