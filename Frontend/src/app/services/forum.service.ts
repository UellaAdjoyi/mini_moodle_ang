import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Forum, Message } from '../models/forum.model'; 
import { AuthService } from './auth.service'; // Pour obtenir le token

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Créer un forum pour une UE (si un seul par UE)
  createForumForUe(ueId: string, forumData: { titre: string, description?: string }): Observable<Forum> {
    return this.http.post<Forum>(`${this.apiUrl}/ues/${ueId}/forum`, forumData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Récupérer le forum d'une UE
  getForumByUe(ueId: string): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiUrl}/ues/${ueId}/forum`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Ajouter un message à un forum
  addMessageToForum(forumId: string, messageData: { contenu: string }): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/forums/${forumId}/messages`, messageData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour les détails d'un forum (titre/description)
  updateForumDetails(forumId: string, forumData: { titre?: string, description?: string }): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/forums/${forumId}`, forumData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An API error occurred', error);
    // On pourrait retourner un message d'erreur plus convivial pour l'utilisateur
    return throwError(() => new Error(error.error?.message || 'Something bad happened; please try again later.'));
  }
}