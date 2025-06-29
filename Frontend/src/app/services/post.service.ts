import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  // Créer une nouvelle post message
    createPost(data: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/createPost`, data);
    }

    // Créer une nouvelle post fichier
    createFilePost(data: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/createFilePost`, data);
    }

  getPostsByUe(codeUe: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/showPosts/${codeUe}`);
  }

  // Modifier un post
  updatePost(postId: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, data);
  }

  // ajouter un devoir
  addDevoir(postId: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/addDevoir/${postId}`, data);
  }

  // ajouter une note et un commentaire
  corriger(postId: string, devoirId : string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/corriger/${postId}/${devoirId}`, data);
  }

// Supprimer un post
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
  
private apiUrlLog = 'http://localhost:3000/api/logs';
//creer log
    createLog(data: FormData): Observable<any> {
      return this.http.post(`${this.apiUrlLog}/createLog`, data);
    }
}


