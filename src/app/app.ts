import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}