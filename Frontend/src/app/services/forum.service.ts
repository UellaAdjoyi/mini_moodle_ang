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
  private apiUrl = 'http://localhost:3000/api/forums'; // adapte le port si besoin

  constructor(private http: HttpClient) { }

  getForumsByUE(ueId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ue/${ueId}`);
  }

  getForumById(forumId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${forumId}`);
  }

  createForum(forumData: any): Observable<any> {
    return this.http.post(this.apiUrl, forumData);
  }

  addMessageToForum(forumId: string, message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${forumId}/messages`, message);
  }
}
