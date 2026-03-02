import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  username: string;
}

interface VerifyResponse {
  valid: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signal to track auth state
  isAuthenticated = signal<boolean>(this.hasToken());

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  verifyToken(): Observable<VerifyResponse> {
    const token = this.getToken();
    if (!token) {
      return of({ valid: false, username: '' });
    }

    return this.http.get<VerifyResponse>(`${this.BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(response => {
        this.isAuthenticated.set(response.valid);
      }),
      catchError(() => {
        this.isAuthenticated.set(false);
        this.removeToken();
        return of({ valid: false, username: '' });
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
