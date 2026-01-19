import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreditCardService } from '../../services/credit-card.service';
import { CreditCard } from '../../models/credit-card.model';

@Component({
  selector: 'app-card-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.scss']
})
export class CardSelectionComponent implements OnInit {
  cards: CreditCard[] = [];
  selectedIds = new Set<number>();
  isLoading = false;
  errorMessage = '';

  constructor(private readonly creditCardService: CreditCardService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.isLoading = true;
    this.creditCardService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load cards right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleCard(cardId: number): void {
    if (this.selectedIds.has(cardId)) {
      this.selectedIds.delete(cardId);
    } else {
      this.selectedIds.add(cardId);
    }
  }

  viewBenefits(): void {
    const ids = Array.from(this.selectedIds);
    this.router.navigate(['/benefits'], {
      queryParams: { cardIds: ids.join(',') }
    });
  }

  formatAnnualFee(annualFeeCents: number): string {
    if (annualFeeCents === 0) {
      return 'No annual fee';
    }
    const dollars = (annualFeeCents / 100).toFixed(0);
    return `$${dollars} annual fee`;
  }
}
