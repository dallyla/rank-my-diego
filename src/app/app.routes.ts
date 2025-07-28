import { Routes } from '@angular/router';
import { RankingListComponent } from './pages/ranking-list/ranking-list.component';

export const routes: Routes = [
  {
    path: '',
    component: RankingListComponent,
    title: 'DM Ranking',
  },
];
