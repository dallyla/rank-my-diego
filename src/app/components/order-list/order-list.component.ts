import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import html2canvas from 'html2canvas';
import { ImageService } from '../../services/image.service';
import { LoadingBarService } from '../../services/progress-bar.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [CommonModule, DragDropModule, SkeletonModule, ButtonModule],
})
export class OrderListComponent {
  @Input() items: any[] = [];
  @Output() emitNewOrder = new EventEmitter<any[]>();
  @Output() emitItemClick = new EventEmitter<any>();
  @Input() loading = false;
  fabOpen = false;

  showPlayer = false;
  itemClickedId!: string | number;
  iframeLoading = false;
  iframeUrls: { [albumId: string]: SafeResourceUrl } = {};
  textoTweet = "🎧 Meu Ranking das músicas da Diego Martins já tá pronto! 🔥✨ www.rankmydiego.com.br #RankMyDiego #DiegoMartins\n";

  constructor(
    private sanitizer: DomSanitizer,
    private imageService: ImageService,
    private loadingBarService: LoadingBarService

  ) {}

  emitPlayerClick(item: any, action: 'play' | 'close') {
    if (action === 'close' || this.itemClickedId === item.id) {
      this.showPlayer = false;
      this.itemClickedId = '';
    } else {
      this.showPlayer = true;
      this.itemClickedId = item.id;
      this.iframeLoading = true;
    }

    this.emitItemClick.emit({
      showPlayer: this.showPlayer,
      track: this.itemClickedId,
    });
  }

  getSpotifyEmbedUrl(albumId: string): SafeResourceUrl {

    if (!this.iframeUrls[albumId]) {
      const url = `https://open.spotify.com/embed/album/${albumId}`;
      this.iframeUrls[albumId] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this.iframeUrls[albumId];
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.emitNewOrder.emit(this.items);
  }

  onIframeLoad() {
    setTimeout(() => {
      this.iframeLoading = false;
    }, 500); // delay de 500ms para ver o skeleton
  }

  async capturarImagem() {
    const container = document.getElementById('ranking-compartilhavel');
    if (!container) return;
    this.loadingBarService.show();
    // Aguarda o carregamento de todas as imagens
    const imagens = Array.from(container.getElementsByTagName('img'));
    await Promise.all(imagens.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // mesmo se der erro, continua
      });
    }));

    // Aplica estilo para esconder os botões (opcional)
    container.classList.add('capture-mode');

    html2canvas(container, {
      useCORS: true,      // Permite baixar imagens externas
      allowTaint: false,  // Bloqueia imagens "sujas" com cookies
      scale: 3,           // Aumenta qualidade
      backgroundColor: '#f5f3ff'
    }).then(canvas => {
      this.loadingBarService.hide ();

      container.classList.remove('capture-mode');

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'meu-ranking.png';
      link.click();
    });
  }

  compartilharNasRedes(rede: string) {
    this.imageService.capturarEnviarECompartilhar('ranking-compartilhavel', this.textoTweet, rede);
  }

}
