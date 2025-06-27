import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface UsersByRole {
  _id: string;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  usersByRole: UsersByRole[];
  totalUEs: number;
  ueWithParticipants: number;
  ueWithEnseignants: number;
  totalForums: number;
  totalPosts: number;
  totalDevoirsRemis: number;
  totalMessages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(this.apiUrl);
  }
}
