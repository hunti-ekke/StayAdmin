import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  public readonly submitting = signal(false);
  public readonly loginForm = this.formBuilder.group({
    username: this.formBuilder.nonNullable.control('', Validators.required),
    password: this.formBuilder.nonNullable.control('', Validators.required),
  });

  public login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { username, password } = this.loginForm.getRawValue();

    this.authService.login(username, password).subscribe({
      next: ({ token }) => {
        this.authService.saveToken(token);
        this.submitting.set(false);
        void this.router.navigateByUrl('/overview');
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);

        const message =
          error.status === 401
            ? 'Hibás felhasználónév vagy jelszó.'
            : error.status === 0
              ? 'Az API nem érhető el.'
              : 'A bejelentkezés nem sikerült.';

        this.snackBar.open(message, 'Bezárás', {
          duration: 5000,
          verticalPosition: 'top',
        });
      },
    });
  }
}