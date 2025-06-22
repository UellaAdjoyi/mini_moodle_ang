import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Ue} from "../models/ue.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrlImg = 'http://localhost:3000';
  private apiUrlUser = 'http://localhost:3000/api/user';
  private apiUrlAdmin = 'http://localhost:3000/api/admin';


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    ) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }



  createUser(userData: FormData): Observable<any> {
   return this.http.post(`${this.apiUrl}/register`, userData);
  }

  updateUser(id: string, userData: FormData) {


    return this.http.put(`${this.apiUrl}/updateUser/${id}`, userData);
  }


  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`);
  }


  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }



  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, formData);
  }

  // assignUe(userId: string, ueId: string, role: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/assign-ue/${userId}`, {
  //     ueId,
  //     role
  //   });
  // }

  getUserCourses(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/cours`);
  }

  removeUserCourse(userId: string, ueId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-ue`, { userId, ueId });
  }

  removeUeFromUser(userId: string, ueId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/cours/${ueId}`);
  }


  assignUeToUser(userId: string, ueId: string, role: string) {
    return this.http.post(`${this.apiUrl}/assign-ue/${userId}`, {
      ueId,
      role
    });
  }

  getUesByUser(userId: string): Observable<Ue[]> {
    return this.http.get<Ue[]>(`${this.apiUrlUser}/${userId}/cours`);
  }

  getStats() {
    return this.http.get<any>(`${this.apiUrlAdmin}/stats`);
  }

}
