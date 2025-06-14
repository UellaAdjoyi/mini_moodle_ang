import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Ue} from "../models/ue.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UeService {

  private apiUrl = 'http://localhost:3000/api/ues';

  constructor(private http: HttpClient) { }

  getAllUes(): Observable<Ue[]> {
    return this.http.get<Ue[]>(this.apiUrl);
  }

  // Créer une nouvelle UE
  createUe(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateUe(code: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.put(`${this.apiUrl}/${code}`, formData, { headers });
  }


  getUesSuivies(): Observable<Ue[]> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Ue[]>(`${this.apiUrl}/ues/suivies/${userId}`);
  }

  getUesEnseignees(): Observable<Ue[]> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Ue[]>(`${this.apiUrl}/ues/enseignees/${userId}`);
  }

  deleteUe(code: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }
  removeUeFromUser(userId: string, ueId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/remove-ue`, { userId, ueId });
  }

}
