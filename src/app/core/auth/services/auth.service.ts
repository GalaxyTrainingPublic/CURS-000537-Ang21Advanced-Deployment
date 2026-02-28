import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { TokenService } from './token.service';
import { AuthResponse } from '../models/auth-response.model';
import { IdleService } from './idle.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private idleService = inject(IdleService);

  private API = 'http://localhost:8081/auth';

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.API}/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          this.tokenService.setAccessToken(res.accessToken);
          this.tokenService.setRefreshToken(res.refreshToken);

          this.idleService.startWatching();
        }),
      );
  }

  refreshToken() {
    return this.http
      .post<AuthResponse>(`${this.API}/refresh`, {
        refreshToken: this.tokenService.getRefreshToken(),
      })
      .pipe(
        tap((res) => {
          this.tokenService.setAccessToken(res.accessToken);
          this.tokenService.setRefreshToken(res.refreshToken);
        }),
      );
  }

  logout() {
    this.idleService.stopWatching();

    const refreshToken = this.tokenService.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.API}/logout`, { refreshToken }).subscribe();
    }

    this.tokenService.clearTokens();
  }

  getUsername(): string | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.sub ?? null;
  }

  getFullName(): string | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    return decoded.fullName ?? null;
  }
  saveTokens(accessToken: string, refreshToken: string): void {
    this.tokenService.setAccessToken(accessToken);
    this.tokenService.setRefreshToken(refreshToken);
  }

  clearTokens(): void {
     this.tokenService.clearTokens();
  }
}
