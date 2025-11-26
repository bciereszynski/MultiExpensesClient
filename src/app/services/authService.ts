import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user/user';
import { Observable, tap } from 'rxjs';
import { Authresponse } from '../models/authresponse/authresponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7163/api/Auth'

  constructor(private http: HttpClient, private router: Router) {

  }

  login(credentials: User): Observable<Authresponse> {
    return this.http.post<Authresponse>(this.apiUrl + '/login', credentials).pipe(tap(response => {
      localStorage.setItem('authToken', response.token);
    }));
  }

  register(credentials: User): Observable<Authresponse> {
    return this.http.post<Authresponse>(this.apiUrl + '/register', credentials).pipe(tap(response => {
      localStorage.setItem('authToken', response.token);
    }));
  }

  isAuthenticated(): boolean {  
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}
