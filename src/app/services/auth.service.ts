import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { LoginResponse } from '../models/login-response.model';
import { API_URL } from './api-url';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly tokenState = signal<string | null>(localStorage.getItem('token'));

  public readonly isLoggedIn = computed(() => this.tokenState() !== null);

  public login(username: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${API_URL}/auth/login`, { username, password });
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenState.set(token);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.tokenState.set(null);
  }
}