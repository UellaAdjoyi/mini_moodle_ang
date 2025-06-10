import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Ue} from "../models/ue.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UeService {

  private apiUrl = 'http://localhost:5000/api/ues';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les UEs
  getAllUes(): Observable<Ue[]> {
    return this.http.get<Ue[]>(this.apiUrl);
  }

  // Créer une nouvelle UE
  createUe(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Mettre à jour une UE existante
  updateUe(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  getUesSuivies(): Observable<Ue[]> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Ue[]>(`${this.apiUrl}/ues/suivies/${userId}`);
  }

  getUesEnseignees(): Observable<Ue[]> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Ue[]>(`${this.apiUrl}/ues/enseignees/${userId}`);
  }

  deleteUe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
