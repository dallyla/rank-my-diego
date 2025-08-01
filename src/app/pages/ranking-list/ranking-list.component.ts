import { Component, OnInit } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { CardModule } from 'primeng/card';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Button } from "primeng/button";
import { LoadingBarService } from '../../services/progress-bar.service';


@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
  imports: [OrderListComponent, CardModule, CommonModule]
})
export class RankingListComponent implements OnInit {
  showPlayer = false;
  songsList!: any[]
  loading = false;

  artist: any;
  artistId = '2UufgQQgpWU5q0qBflqUeP?si=CKMzgKyIRlOs8NygciqivQ';

  constructor(
    private spotify: SpotifyService,
    private messageService: MessageService,
    private loadingBarService: LoadingBarService
  ) {}

  ngOnInit() {
   this.getAllTracks();
  }

  showSpotifyPlayer(event: any) {
    this.showPlayer = event.showPlayer;
  }

  getAllTracks(){
    this.spotify.getArtist(this.artistId).subscribe({
      next: data => {
        this.artist = data;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: `${err.status} - Aff :( Erro ao buscar artista`,
          detail: 'Contate a adm.',
          life: 5000
        });
      }
    });

    this.loading = true;
    this.loadingBarService.show();
    this.spotify.getAllTracksWithInfoFromArtist('2UufgQQgpWU5q0qBflqUeP').subscribe({
      next: (tracks: any) => {

        this.songsList = [];

        if (tracks.length) {
          tracks.forEach((item: any) => {
            const obj = {
              id: item.id,
              icon: item.album.images[1].url,
              name: item.name,
              albumId: item.album.id
            };
            this.songsList.push(obj);
          });
        }
        this.loading = false;
        this.loadingBarService.hide();
      },
      error: err => {
        this.loading = false;
        this.loadingBarService.hide();
        this.messageService.add({
          severity: 'error',
          summary: `${err.status} - Ixi! Erro ao buscar músicas.`,
          detail: 'Contate a adm.',
          life: 5000
        });
      }
    });

  }

}
