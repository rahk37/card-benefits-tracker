import { Routes } from '@angular/router';
import { CardSelectionComponent } from './components/card-selection/card-selection.component';
import { BenefitsOverviewComponent } from './components/benefits-overview/benefits-overview.component';

export const appRoutes: Routes = [
  { path: '', component: CardSelectionComponent },
  { path: 'benefits', component: BenefitsOverviewComponent },
  { path: '**', redirectTo: '' }
];
