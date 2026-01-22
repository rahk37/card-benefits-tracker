import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { CreditCardService } from '../../services/credit-card.service';
import { CreditCard } from '../../models/credit-card.model';
import { BenefitsOverviewComponent } from '../benefits-overview/benefits-overview.component';
import { getIssuerImageUrl } from '../../utils/card-images';

@Component({
  selector: 'app-card-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BenefitsOverviewComponent
  ],
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.scss']
})
export class CardSelectionComponent implements OnInit {
  cards: CreditCard[] = [];
  selectedCards: CreditCard[] = [];
  selectedIds = new Set<number>();
  cardInputControl = new FormControl('');
  filteredCards: CreditCard[] = [];
  showDropdown = false;
  isLoading = false;
  errorMessage = '';
  coveredCategories: string[] = [];
  uncoveredCategories: string[] = [];
  showOptimize = false;
  spendByCategory: Record<string, number> = {};

  readonly allCategories = [
    'travel',
    'dining',
    'cashback',
    'groceries',
    'gas',
    'transit',
    'entertainment',
    'streaming',
    'business',
    'perks'
  ];

  constructor(private readonly creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.isLoading = true;
    this.creditCardService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.filteredCards = cards;
        this.cardInputControl.valueChanges
          .pipe(startWith(''))
          .subscribe((value) => {
            this.filteredCards = this.filterCards(value ?? '');
          });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load cards right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectCard(card: CreditCard): void {
    if (!card || this.selectedIds.has(card.id)) {
      this.cardInputControl.setValue('');
      return;
    }
    this.selectedIds.add(card.id);
    this.selectedCards = [...this.selectedCards, card];
    this.cardInputControl.setValue('');
    this.updateCoverage();
    this.showDropdown = true;
  }

  removeCard(card: CreditCard): void {
    this.selectedIds.delete(card.id);
    this.selectedCards = this.selectedCards.filter((item) => item.id !== card.id);
    this.updateCoverage();
  }

  viewBenefits(): void {
    this.scrollTo('benefits');
  }

  filterCards(value: string): CreditCard[] {
    const textValue = typeof value === 'string' ? value : '';
    const filterValue = textValue.toLowerCase().trim();
    return this.cards.filter((card) => {
      const matches = `${card.name} ${card.issuer}`.toLowerCase().includes(filterValue);
      return matches && !this.selectedIds.has(card.id);
    });
  }

  openDropdown(): void {
    this.showDropdown = true;
  }

  closeDropdown(): void {}

  updateCoverage(): void {
    const covered = new Set<string>();
    this.selectedCards.forEach((card) => {
      (card.categories ?? []).forEach((category) => covered.add(category));
    });
    this.coveredCategories = this.allCategories.filter((category) => covered.has(category));
    this.uncoveredCategories = this.allCategories.filter((category) => !covered.has(category));
  }

  toggleOptimize(): void {
    this.showOptimize = !this.showOptimize;
    if (this.showOptimize) {
      this.scrollTo('optimize');
    }
  }

  setSpend(category: string, value: string): void {
    const parsed = Number(value);
    this.spendByCategory[category] = Number.isNaN(parsed) ? 0 : parsed;
  }

  getRecommendations(): CreditCard[] {
    const spendEntries = Object.entries(this.spendByCategory).filter(([, value]) => value > 0);
    if (spendEntries.length === 0) {
      return [];
    }
    return [...this.cards]
      .map((card) => {
        const annualFee = this.parseAnnualFee(card.annualFee);
        const coverageScore = spendEntries.reduce((total, [category, amount]) => {
          return card.categories?.includes(category) ? total + amount : total;
        }, 0);
        return { card, score: coverageScore - annualFee };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.card);
  }

  parseAnnualFee(annualFee: string): number {
    const normalized = annualFee.replace(/[^0-9]/g, '');
    return normalized ? Number(normalized) : 0;
  }

  getTotalMonthlySpend(): number {
    return Object.values(this.spendByCategory).reduce((total, value) => total + (value ?? 0), 0);
  }

  getEstimatedMonthlyRewards(): number {
    const totalSpend = this.getTotalMonthlySpend();
    if (totalSpend === 0 || this.selectedCards.length === 0) {
      return 0;
    }
    const coveredCategories = new Set<string>();
    this.selectedCards.forEach((card) => {
      (card.categories ?? []).forEach((category) => coveredCategories.add(category));
    });

    const coveredSpend = Object.entries(this.spendByCategory).reduce((total, [category, value]) => {
      return coveredCategories.has(category) ? total + value : total;
    }, 0);
    const uncoveredSpend = totalSpend - coveredSpend;
    const annualFees = this.selectedCards.reduce((sum, card) => sum + this.parseAnnualFee(card.annualFee), 0);

    const coveredRewards = coveredSpend * 0.02;
    const uncoveredRewards = uncoveredSpend * 0.01;
    return Math.max(0, coveredRewards + uncoveredRewards - annualFees / 12);
  }

  getSpendValue(category: string): number {
    return this.spendByCategory[category] ?? 0;
  }

  getSpendPercent(category: string): number {
    const values = Object.values(this.spendByCategory);
    const maxValue = Math.max(1, ...values);
    return Math.min(100, Math.round((this.getSpendValue(category) / maxValue) * 100));
  }

  isBusinessCard(card: CreditCard): boolean {
    return /business|ink/i.test(card.name);
  }

  getImageUrl(card: CreditCard): string {
    return getIssuerImageUrl(card.issuer);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
