import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [CommonModule, DragDropModule]
})
export class OrderListComponent {
  @Input() items: any[] = [];
  @Output() emitNewOrder = new EventEmitter<any[]>();
  @Output() emitItemClick = new EventEmitter<any>();

  showPlayer = false;
  itemClickedId!: string | number;

  constructor(private sanitizer: DomSanitizer) {}

  emitPlayerClick(item: any, action: 'play' | 'close') {
    if (action === 'close' || this.itemClickedId === item.id) {
      this.showPlayer = false;
      this.itemClickedId = '';
    } else {
      this.showPlayer = true;
      this.itemClickedId = item.id;
    }

    this.emitItemClick.emit({
      showPlayer: this.showPlayer,
      track: this.itemClickedId,
    });
  }

  getSpotifyEmbedUrl(albumId: string): SafeResourceUrl {
    const url = `https://open.spotify.com/embed/album/${albumId}?utm_source=generator`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.emitNewOrder.emit(this.items);
  }
}
