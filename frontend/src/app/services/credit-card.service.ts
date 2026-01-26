import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreditCard } from '../models/credit-card.model';
import { CardBenefits } from '../models/benefit.model';
import { OptimizationRequest, OptimizationResponse } from '../models/optimization.model';

@Injectable({ providedIn: 'root' })
export class CreditCardService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${this.baseUrl}/cards`);
  }

  getBenefits(cardIds: number[]): Observable<CardBenefits[]> {
    const params = new URLSearchParams();
    params.set('cardIds', cardIds.join(','));
    return this.http.get<CardBenefits[]>(`${this.baseUrl}/benefits?${params.toString()}`);
  }

  optimizeRewards(request: OptimizationRequest): Observable<OptimizationResponse> {
    return this.http.post<OptimizationResponse>(`${this.baseUrl}/optimize`, request);
  }

  // Future: add auth-aware endpoints when user accounts are introduced.
}
