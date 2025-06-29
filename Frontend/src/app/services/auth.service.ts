import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrlLog = 'http://localhost:3000/api/logs';
  private currentUser: any;

  constructor(private http: HttpClient) {}
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.saveToken(res.token);
        this.setCurrentUser(res);
      })
    );
  }


  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
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

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user._id : null;
  }

  getCurrentUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  getUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.role || [];
  }




}
