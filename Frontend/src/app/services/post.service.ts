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
}
