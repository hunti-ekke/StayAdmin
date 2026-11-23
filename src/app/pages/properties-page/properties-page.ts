import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { PropertyCard } from '../../components/property-card/property-card';
import { PropertyCategory, propertyCategoryLabels } from '../../models/property-category';
import { PropertySummary } from '../../models/property-summary.model';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties-page',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelectModule,
    RouterLink,
    PropertyCard,
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.scss',
})
export class PropertiesPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly categories = Object.values(PropertyCategory);
  public readonly categoryLabels = propertyCategoryLabels;
  public readonly properties = signal<PropertySummary[]>([]);
  public readonly loading = signal(false);
  public readonly deleting = signal(false);
  public readonly errorMessage = signal('');
  public readonly actionError = signal('');

  public readonly filterForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control(''),
    category: this.formBuilder.nonNullable.control<PropertyCategory | ''>(''),
  });

  public ngOnInit(): void {
    this.loadProperties();
  }

  public loadProperties(): void {
    const { name, category } = this.filterForm.getRawValue();
    this.loading.set(true);
    this.errorMessage.set('');
    this.actionError.set('');

    this.propertyService.getProperties(name, category).subscribe({
      next: (properties) => {
        this.properties.set(properties);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.errorMessage.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : 'Nem sikerült betölteni a szálláshelyeket.',
        );
      },
    });
  }

  public clearFilters(): void {
    this.filterForm.reset({ name: '', category: '' });
    this.loadProperties();
  }

  public deleteProperty(property: PropertySummary): void {
    if (this.deleting()) {
      return;
    }

    const confirmed = window.confirm(
      `Biztosan törlöd a(z) „${property.name}” szálláshelyet? A hozzá tartozó foglalások is törlődnek.`,
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    this.actionError.set('');

    this.propertyService.deleteProperty(property.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.loadProperties();
      },
      error: (error: HttpErrorResponse) => {
        this.deleting.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.actionError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : 'Nem sikerült törölni a szálláshelyet.',
        );
      },
    });
  }
}