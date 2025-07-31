import { Routes } from '@angular/router';
import { RankingListComponent } from './pages/ranking-list/ranking-list.component';
import { DiegoMartinsComponent } from './pages/diego-martins/diego-martins.component';
import { SobreOAppComponent } from './pages/sobre-o-app/sobre-o-app.component';

export const routes: Routes = [
  {
    path: '',
    component: RankingListComponent,
    title: 'Rank My Diego',
  },
  {
    path: 'diego-martins',
    component: DiegoMartinsComponent,
    title: 'Diego Martins'
  },
  {
    path: 'sobre',
    component: SobreOAppComponent,
    title: 'Sobre o App'
  }
];
