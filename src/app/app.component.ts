import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('dm-ranking');
  value = ''
  mobileMenuOpen = false;

  constructor(
    private primeng: PrimeNG,
    private messageService: MessageService
  ) {}

  ngOnInit() {
     this.primeng.ripple.set(true);
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
