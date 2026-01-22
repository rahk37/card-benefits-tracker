import { Routes } from '@angular/router';
import { CardSelectionComponent } from './components/card-selection/card-selection.component';

export const appRoutes: Routes = [
  { path: '', component: CardSelectionComponent },
  { path: '**', redirectTo: '' }
];
