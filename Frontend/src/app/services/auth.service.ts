import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUser: any;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.setCurrentUser(res);
      })
    );
  }



  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  getCurrentUser(): any {
    if (this.currentUser) return this.currentUser;
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Erreur parsing user localStorage', e);
      localStorage.removeItem('user'); // supprimer la donnée corrompue
      return null;
    }
  }



  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


}
