import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
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

  // getAllTracksWithInfoFromArtist(artistId: string) {
  //   // ✅ Cache para evitar múltiplas chamadas
  //   if ((this as any)._trackCache?.[artistId]) {
  //     return of((this as any)._trackCache[artistId]);
  //   }

  //   return this.getToken().pipe(
  //     switchMap(token => {
  //       const headers = new HttpHeaders({
  //         Authorization: `Bearer ${token.access_token}`
  //       });

  //       // 1. Buscar os álbuns do artista
  //       return this.http.get<any>(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
  //         headers,
  //         params: {
  //           include_groups: 'album,single',
  //           market: 'BR',
  //           limit: 50
  //         }
  //       }).pipe(
  //         switchMap((albumsRes: any) => {
  //           const albumIds: string[] = albumsRes.items.map((album: any) => album.id);

  //           // 2. Dividir em grupos de até 20 álbuns por chamada
  //           const batchedAlbumIds: string[][] = [];
  //           for (let i = 0; i < albumIds.length; i += 20) {
  //             batchedAlbumIds.push(albumIds.slice(i, i + 20));
  //           }

  //           const albumDetailCalls = batchedAlbumIds.map(group =>
  //             this.http.get<any>(`https://api.spotify.com/v1/albums`, {
  //               headers,
  //               params: { ids: group.join(',') }
  //             })
  //           );

  //           return forkJoin(albumDetailCalls).pipe(
  //             map((albumGroups: any[]) => {
  //               // 3. Unir todas as faixas de todos os álbuns
  //               const allTracks = albumGroups.flatMap(group =>
  //                 group.albums.flatMap((album: any) =>
  //                   album.tracks.items.map((track: any) => ({
  //                     id: track.id,
  //                     name: track.name,
  //                     preview_url: track.preview_url,
  //                     duration_ms: track.duration_ms,
  //                     album: {
  //                       id: album.id,
  //                       name: album.name,
  //                       images: album.images,
  //                       release_date: album.release_date
  //                     },
  //                     artists: track.artists
  //                   }))
  //                 )
  //               );

  //               // ✅ Armazena em cache simples na instância
  //               (this as any)._trackCache = (this as any)._trackCache || {};
  //               (this as any)._trackCache[artistId] = allTracks;

  //               return allTracks;
  //             })
  //           );
  //         })
  //       );
  //     })
  //   );
  // }


}
