import { Component, OnInit } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { CardModule } from 'primeng/card';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
  imports: [OrderListComponent, CardModule, CommonModule]
})
export class RankingListComponent implements OnInit {
  showPlayer = false;
  songsList!: any[]


  artist: any;
  artistId = '2UufgQQgpWU5q0qBflqUeP?si=CKMzgKyIRlOs8NygciqivQ';

  constructor(private spotify: SpotifyService) {}

  ngOnInit() {
    this.spotify.getArtist(this.artistId)
      .subscribe(data => this.artist = data);

      this.spotify.getAllTracksWithInfoFromArtist('2UufgQQgpWU5q0qBflqUeP').subscribe((tracks: any) => {
        console.log('Total de músicas:', tracks.length);
        console.log('Músicas:', tracks);
        this.songsList = [];
        if (tracks.length) {
          tracks.forEach((item: any) => {
            let obj = {
              id: item.id,
              icon: item.album.images[1].url,
              name: item.name,
              albumId: item.album.id
            }
            this.songsList.push(obj)
          });
          console.log(this.songsList);


        }


      });
  }

  showSpotifyPlayer(event: any) {
    this.showPlayer = event.showPlayer;
  }



}
