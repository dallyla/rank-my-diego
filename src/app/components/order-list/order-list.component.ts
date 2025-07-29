import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [CommonModule, DragDropModule, SkeletonModule]
})
export class OrderListComponent {
  @Input() items: any[] = [];
  @Output() emitNewOrder = new EventEmitter<any[]>();
  @Output() emitItemClick = new EventEmitter<any>();
  @Input() loading = false;

  showPlayer = false;
  itemClickedId!: string | number;
  iframeLoading = false;
  iframeUrls: { [albumId: string]: SafeResourceUrl } = {};

  constructor(private sanitizer: DomSanitizer) {}

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
}
