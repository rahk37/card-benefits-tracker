import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CreditCardService } from '../../services/credit-card.service';
import { CardBenefits, Benefit } from '../../models/benefit.model';
import { CreditCard } from '../../models/credit-card.model';
import { CardComparisonComponent } from '../card-comparison/card-comparison.component';

@Component({
  selector: 'app-benefits-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComparisonComponent],
  templateUrl: './benefits-overview.component.html',
  styleUrls: ['./benefits-overview.component.scss']
})
export class BenefitsOverviewComponent implements OnInit {
  cardIds: number[] = [];
  benefitsByCard: CardBenefits[] = [];
  selectedCards: CreditCard[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private readonly route: ActivatedRoute, private readonly creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const rawIds = params.get('cardIds') ?? '';
      this.cardIds = rawIds
        .split(',')
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value));
      if (this.cardIds.length === 0) {
        this.errorMessage = 'No cards selected. Please return and choose your cards.';
        return;
      }
      this.fetchData();
    });
  }

  fetchData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.creditCardService.getCards().subscribe({
      next: (cards) => {
        this.selectedCards = cards.filter((card) => this.cardIds.includes(card.id));
      },
      error: () => {
        this.errorMessage = 'Unable to load cards right now.';
      }
    });

    this.creditCardService.getBenefits(this.cardIds).subscribe({
      next: (benefits) => {
        this.benefitsByCard = benefits;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load benefits right now.';
        this.isLoading = false;
      }
    });
  }

  getGroupedBenefits(type: Benefit['type']): CardBenefits[] {
    return this.benefitsByCard.map((entry) => ({
      ...entry,
      benefits: entry.benefits.filter((benefit) => benefit.type === type)
    }));
  }
}
