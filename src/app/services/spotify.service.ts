import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private proxyUrl = 'https://rank-my-diego-backend.onrender.com';

  token!: any;

  constructor(private http: HttpClient) {}

  // Obtém o token do proxy
  private getToken() {
    return this.http.get<{ access_token: string }>(`${this.proxyUrl}/spotify-token`);
  }

  // Exemplo: buscar um artista por ID
  getArtist(artistId: string) {
    return this.getToken().pipe(
      switchMap(token =>
        this.http.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token.access_token}`,
          }),
        })
      )
    );
  }

  // Exemplo: buscar por nome
  searchArtistByName(name: string) {
    return this.getToken().pipe(
      switchMap(token =>
        this.http.get(`https://api.spotify.com/v1/search`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token.access_token}`,
          }),
          params: {
            q: name,
            type: 'artist',
            limit: 5,
          },
        })
      )
    );
  }


  getAllTracksWithInfoFromArtist(artistId: string) {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token.access_token}`
        });

        // 1. Buscar os álbuns do artista
        return this.http.get<any>(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
          headers,
          params: {
            include_groups: 'album,single',
            market: 'BR',
            limit: 50
          }
        }).pipe(
          switchMap((albumsRes: any) => {
            const albumIds = albumsRes.items.map((album: any) => album.id);

            // 2. Buscar as faixas de todos os álbuns
            const albumTrackCalls = albumIds.map((albumId: string) =>
              this.http.get<any>(`https://api.spotify.com/v1/albums/${albumId}/tracks`, { headers })
            );

            return forkJoin(albumTrackCalls).pipe(
              switchMap((albumsTracks: any) => {
                const allTracks = albumsTracks.flatMap((album: any) => album.items);

                // 3. Buscar info de cada faixa individualmente
                const trackDetailCalls = allTracks.map((track: any) =>
                  this.http.get<any>(`https://api.spotify.com/v1/tracks/${track.id}`, { headers })
                );

                return forkJoin(trackDetailCalls); // agora retorna as faixas com info completa (incluindo álbum)
              })
            );
          })
        );
      })
    );
  }


}
