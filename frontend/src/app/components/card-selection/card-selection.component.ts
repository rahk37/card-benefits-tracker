import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { CreditCardService } from '../../services/credit-card.service';
import { CreditCard } from '../../models/credit-card.model';
import { BenefitsOverviewComponent } from '../benefits-overview/benefits-overview.component';
import { getIssuerImageUrl } from '../../utils/card-images';
import { OptimizationResponse } from '../../models/optimization.model';

@Component({
  selector: 'app-card-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BenefitsOverviewComponent
  ],
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.scss']
})
export class CardSelectionComponent implements OnInit {
  @ViewChild('cardSearchInput') cardSearchInput?: ElementRef<HTMLInputElement>;
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
  showOptimize = true;
  spendByCategory: Record<string, number> = {};
  householdEnabled = false;
  householdSpendByCategory: Record<string, number> = {};
  recommendAllCards = true;
  editingCards = false;
  step1Completed = false;
  showSpendInputs = true;
  optimizationResult?: OptimizationResponse;
  optimizationError = '';
  isOptimizing = false;
  private optimizeTimer?: ReturnType<typeof setTimeout>;

  readonly allCategories = [
    'travel',
    'dining',
    'cashback',
    'groceries',
    'online-groceries',
    'gas',
    'transit',
    'entertainment',
    'streaming',
    'drugstores',
    'business',
    'online-shopping',
    'mobile-wallet',
    'rent',
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
    this.scheduleOptimize();
  }

  removeCard(card: CreditCard): void {
    this.selectedIds.delete(card.id);
    this.selectedCards = this.selectedCards.filter((item) => item.id !== card.id);
    this.updateCoverage();
    this.scheduleOptimize();
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.selectedCards = [];
    this.cardInputControl.setValue('');
    this.updateCoverage();
    this.optimizationResult = undefined;
    this.step1Completed = false;
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

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

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
      this.scheduleOptimize();
    }
  }

  setSpend(category: string, value: string): void {
    const parsed = Number(value);
    this.spendByCategory[category] = Number.isNaN(parsed) ? 0 : parsed;
    this.scheduleOptimize();
  }

  setHouseholdSpend(category: string, value: string): void {
    const parsed = Number(value);
    this.householdSpendByCategory[category] = Number.isNaN(parsed) ? 0 : parsed;
    this.scheduleOptimize();
  }

  toggleHousehold(): void {
    this.householdEnabled = !this.householdEnabled;
    this.scheduleOptimize();
  }

  toggleRecommendAllCards(): void {
    this.recommendAllCards = !this.recommendAllCards;
    this.scheduleOptimize();
  }

  editCards(): void {
    this.step1Completed = false;
  }

  completeStep1(): void {
    if (this.selectedCards.length === 0) {
      return;
    }
    this.step1Completed = true;
    this.scrollTo('optimize');
  }

  toggleSpendInputs(): void {
    if (!this.showOptimize) {
      this.showOptimize = true;
    }
    this.showSpendInputs = !this.showSpendInputs;
  }


  focusCardInput(): void {
    if (this.cardSearchInput?.nativeElement) {
      this.cardSearchInput.nativeElement.focus();
    }
    this.openDropdown();
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
    const baseSpend = Object.values(this.spendByCategory).reduce((total, value) => total + (value ?? 0), 0);
    if (!this.householdEnabled) {
      return baseSpend;
    }
    const householdSpend = Object.values(this.householdSpendByCategory)
      .reduce((total, value) => total + (value ?? 0), 0);
    return baseSpend + householdSpend;
  }

  getEstimatedMonthlyRewards(): number {
    if (this.optimizationResult?.cardSummaries?.length) {
      return this.optimizationResult.cardSummaries
        .reduce((total, summary) => total + summary.monthlyNetRewards, 0);
    }
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

  getCoveredSpend(): number {
    const coveredCategories = new Set<string>();
    this.selectedCards.forEach((card) => {
      (card.categories ?? []).forEach((category) => coveredCategories.add(category));
    });
    return Object.entries(this.spendByCategory).reduce((total, [category, value]) => {
      return coveredCategories.has(category) ? total + value : total;
    }, 0);
  }

  getUncoveredSpend(): number {
    return Math.max(0, this.getTotalMonthlySpend() - this.getCoveredSpend());
  }

  getSpendValue(category: string): number {
    const baseSpend = this.spendByCategory[category] ?? 0;
    if (!this.householdEnabled) {
      return baseSpend;
    }
    const householdSpend = this.householdSpendByCategory[category] ?? 0;
    return baseSpend + householdSpend;
  }

  getSpendPercent(category: string): number {
    const values = Object.values(this.spendByCategory);
    const maxValue = Math.max(1, ...values);
    return Math.min(100, Math.round((this.getSpendValue(category) / maxValue) * 100));
  }

  getEstimatedYearlyRewards(): number {
    if (this.optimizationResult?.cardSummaries?.length) {
      return this.optimizationResult.cardSummaries
        .reduce((total, summary) => total + summary.yearlyNetRewards, 0);
    }
    return this.getEstimatedMonthlyRewards() * 12;
  }

  hasSelectedCards(): boolean {
    return this.selectedCards.length > 0;
  }

  showStep1Input(): boolean {
    return !this.step1Completed;
  }

  showStep2Input(): boolean {
    return this.step1Completed;
  }

  hasSpendInputs(): boolean {
    return Object.values(this.spendByCategory).some((value) => (value ?? 0) > 0) ||
      (this.householdEnabled &&
        Object.values(this.householdSpendByCategory).some((value) => (value ?? 0) > 0));
  }

  hasRewardData(): boolean {
    return !!this.optimizationResult?.cardSummaries?.some(
      (summary) => summary.categoryRewards && summary.categoryRewards.length > 0 && summary.monthlyRewards > 0
    );
  }

  getCardById(cardId: number): CreditCard | undefined {
    return this.selectedCards.find((card) => card.id === cardId);
  }

  formatCurrencyFromCents(cents: number | null | undefined): string {
    if (!cents) {
      return '$0';
    }
    return `$${(cents / 100).toFixed(0)}`;
  }

  formatCategory(category: string): string {
    return category.replace(/-/g, ' ');
  }

  getImageUrlByCardId(cardId: number): string {
    const card = this.getCardById(cardId);
    return card ? getIssuerImageUrl(card.issuer) : getIssuerImageUrl('generic');
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

  private scheduleOptimize(): void {
    if (!this.showOptimize) {
      return;
    }
    if (this.optimizeTimer) {
      clearTimeout(this.optimizeTimer);
    }
    this.optimizeTimer = setTimeout(() => {
      this.runOptimization();
    }, 300);
  }

  runOptimization(): void {
    if (this.selectedCards.length === 0) {
      this.optimizationResult = undefined;
      return;
    }
    this.isOptimizing = true;
    this.optimizationError = '';
    this.creditCardService.optimizeRewards({
      selectedCardIds: this.selectedCards.map((card) => card.id),
      monthlySpendByCategory: this.spendByCategory,
      household: this.householdEnabled,
      householdSplit: this.householdEnabled ? this.householdSpendByCategory : undefined,
      includeAllCards: this.recommendAllCards
    }).subscribe({
      next: (response) => {
        this.optimizationResult = response;
        this.isOptimizing = false;
      },
      error: (error) => {
        const status = error?.status ? ` (HTTP ${error.status})` : '';
        const detail = error?.error?.message ? `: ${error.error.message}` : '';
        this.optimizationError = `Unable to calculate recommendations right now${status}${detail}.`;
        this.isOptimizing = false;
      }
    });
  }
}
