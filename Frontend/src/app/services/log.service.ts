import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user.model";

export interface Log {
  _id: string;
  user_id: {
    _id: string;
    email: string;
  };
  action: string;
  date_heure: string;
}

@Injectable({
  providedIn: 'root'
})


export class LogService {
  private apiUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  getAllLogs(page = 1, limit = 20, filters: any = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get(`${this.apiUrl}/`, { params });
  }

  createLog(logData: Partial<Log>): Observable<Log> {
    return this.http.post<Log>(`${this.apiUrl}/createLog`, logData);
  }
}
