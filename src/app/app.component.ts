import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { LoadingBarService } from './services/progress-bar.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, ToastModule, MenuModule, ButtonModule, ProgressBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('dm-ranking');
  value = ''
  mobileMenuOpen = false;
  items: MenuItem[] | undefined;
  year = new Date().getFullYear();
  visible$!: Observable<boolean>; // ou BehaviorSubject<boolean>

  constructor(
    private primeng: PrimeNG,
    private messageService: MessageService,
    private loadingBarService: LoadingBarService
  ) {
    this.visible$ = this.loadingBarService.visible$;
  }


  ngOnInit() {
     this.primeng.ripple.set(true);
     this.items = [
      {
        label: 'Diego Martins',
        icon: 'fa fa-music',
        routerLink: '/diego-martins'
      },
      {
        label: 'Sobre o app',
        icon: 'fa fa-mobile-screen',
        routerLink: '/sobre'
      },
      {
        label: 'Início',
        icon: 'fa fa-house',
        routerLink: '/'
      }
    ];
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso!'});
  }

  showError() {
    this.messageService.add({severity:'error', summary: 'Erro', detail: 'Ocorreu um erro no servidor.'});
  }

  showWarn() {
    this.messageService.add({severity:'warn', summary: 'Aviso', detail: 'Atenção com esse alerta.'});
  }

  showInfo() {
    this.messageService.add({severity:'info', summary: 'Info', detail: 'Mensagem informativa.'});
  }
}
