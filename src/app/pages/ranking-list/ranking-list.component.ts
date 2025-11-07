import { SONG_LIST } from './ranking.model';
import { Component, OnInit } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { CardModule } from 'primeng/card';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Button } from "primeng/button";
import { LoadingBarService } from '../../services/progress-bar.service';
import { TabsModule } from 'primeng/tabs';


@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
  imports: [OrderListComponent, CardModule, CommonModule, TabsModule]
})
export class RankingListComponent implements OnInit {
  showPlayer = false;
  songsList: any[] = [];
  tantoSongsList: any[] = [];
  loading = false;

  artist: any;
  artistId = '2UufgQQgpWU5q0qBflqUeP';

  constructor(
    private spotify: SpotifyService,
    private messageService: MessageService,
    private loadingBarService: LoadingBarService
  ) {}

  ngOnInit() {
    this.getAllTracks()
    /*  this.spotify.getArtistWithTracks().subscribe(data => {
      console.log('Artista:', data.artist);
      console.log('Álbuns:', data.albums);
      console.log('Faixas:', data.tracks);
    }); */
  }

  showSpotifyPlayer(event: any) {
    this.showPlayer = event.showPlayer;
  }

  getAllTracks(){
    this.loading = true;
    this.loadingBarService.show();
     this.spotify.getArtistWithTracks().subscribe({
      next: (data: any) => {

        this.buildTantoList(data);
        this.buildGeneralList(data);

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


  private buildTantoList(data: any) {
    console.log(data.albums);

    const tanto = data.albums.filter((album: any) => {
      return album.name === 'TANTO';
    });
    console.log(tanto);

   this.tantoSongsList = tanto.length ? tanto[0].tracks.map((item: any) => {

      if (item.name === 'Teu Namorado, Meu Amor') {
        item.name = 'Teu Namorado';
      }
      if (item.name === 'Rubrica 1 (Interlude)') {
        item.name = 'Rubrica 1';
      }
      if (item.name === 'Rubrica 2 (Interlude)') {
        item.name = 'Rubrica 2';
      }
      if (item.name === 'De Quinta A Domingo') {
        item.name = 'De Qui A Dom';
      }
      return {
        id: item?.id,
        icon: tanto[0].images[1].url,
        name: item?.name,
        albumId: tanto[0].id
      };
    }) : SONG_LIST;
  }

  private buildGeneralList(data: any) {
    this.songsList = [];

    if (data.tracks.length) {
      const tracks = data.tracks;
      tracks.forEach((item: any) => {
        const obj = {
          id: item.id,
          icon: item.album.images[1].url,
          name: item.name,
          albumId: item.album.id
        };
        if (obj.name === 'De Quinta A Domingo') {
          obj.name = 'De Qui A Dom';
        }
        if (obj.name === 'Teu Namorado, Meu Amor') {
          obj.name = 'Teu Namorado';
        }
        if (obj.name === 'Rubrica 1 (Interlude)') {
          obj.name = 'Rubrica 1';
        }
        if (obj.name === 'Rubrica 2 (Interlude)') {
          obj.name = 'Rubrica 2';
        }
        this.songsList.push(obj);
      });
    } else {
      this.songsList = SONG_LIST;
    }
    console.log(this.songsList);
  }

  private getArtist() {
   /*  this.spotify.getArtist(this.artistId).subscribe({
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
    }); */
  }
}
