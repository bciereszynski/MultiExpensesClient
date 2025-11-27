import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Authresponse } from '../models/authresponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7163/api/Auth'

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.currentUserSubject.next('user');
    }
  }

  login(credentials: User): Observable<Authresponse> {
    return this.http.post<Authresponse>(this.apiUrl + '/login', credentials).pipe(tap(response => {
      localStorage.setItem('authToken', response.token);
      this.currentUserSubject.next('user');
    }));
  }

  register(credentials: User): Observable<Authresponse> {
    return this.http.post<Authresponse>(this.apiUrl + '/register', credentials).pipe(tap(response => {
      localStorage.setItem('authToken', response.token);
      this.currentUserSubject.next('user');
    }));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
     this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

}
