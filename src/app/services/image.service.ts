import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';
import { Observable, throwError, from, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private cloudName = 'dqon7a1wv'; // <- substitua aqui
  private uploadPreset = 'public_unsigned'; // <- seu preset unsigned
  private vercelPreviewBaseUrl = 'https://rank-my-diego.vercel.app/api/preview';


  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  capturarImagemComoBlob(elementId: string): Observable<Blob> {
    const element = document.getElementById(elementId);
    if (!element) return throwError(() => new Error('Elemento não encontrado'));

    const imagens = Array.from(element.getElementsByTagName('img'));
    const imagensProntas = Promise.all(
      imagens.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>(resolve => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );

    return from(imagensProntas).pipe(
      switchMap(() => {
        element.classList.add('capture-mode');
        return from(
          html2canvas(element, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#fff'
          })
        );
      }),
      switchMap(canvas => {
        const blobPromise = new Promise<Blob>(resolve => {
          canvas.toBlob(blob => resolve(blob!), 'image/png');
        });
        return from(blobPromise);
      }),
      switchMap(blob => {
        element.classList.remove('capture-mode');
        return of(blob);
      })
    );
  }

  enviarImagemParaCloudinary(blob: Blob): Observable<string> {
    const formData = new FormData();
    const publicId = 'rank-diego-' + Date.now();

    formData.append('file', blob);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('public_id', publicId);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post<any>(url, formData).pipe(
      switchMap(res => {
        return of(res.public_id); // ✅ já vem com o folder incluso
      })
    );
  }

  compartilharNoTwitter(publicId: string, texto: string) {
    const previewUrl = `${this.vercelPreviewBaseUrl}/${encodeURIComponent(publicId)}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(previewUrl)}`;
    window.open(tweetUrl, '_blank');
  }

  capturarEnviarECompartilhar(elementId: string, textoTweet: string) {
    this.capturarImagemComoBlob(elementId).subscribe({
      next: blob => {
        this.enviarImagemParaCloudinary(blob).subscribe({
          next: publicId => this.compartilharNoTwitter(publicId, textoTweet),
          error: (err) => {
            console.error('Erro no upload da imagem:', err);
            this.messageService.add({
              severity: 'error',
              summary: `${err.status} - Ahhh :( Erro no upload da imagem.`,
              detail: 'Contate a adm.',
              life: 5000
            });}
        });
      },
      error: (err) => {
        console.error('Erro ao capturar imagem:', err);
        this.messageService.add({
          severity: 'error',
          summary: `${err.status} - Que pena :( Erro ao capturar imagem.`,
          detail: 'Contate a adm.',
          life: 5000
        });
      }
    });
  }
}
