import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { PropertyOverview } from '../../models/property-overview.model';
import { PropertySummary } from '../../models/property-summary.model';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-overview-page',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatSelectModule,
  ],
  templateUrl: './overview-page.html',
  styleUrl: './overview-page.scss',
})
export class OverviewPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly properties = signal<PropertySummary[]>([]);
  public readonly overview = signal<PropertyOverview | null>(null);
  public readonly loadingProperties = signal(false);
  public readonly loadingOverview = signal(false);
  public readonly propertiesError = signal('');
  public readonly overviewError = signal('');
  public readonly propertyControl = this.formBuilder.nonNullable.control('');

  public ngOnInit(): void {
    this.loadProperties();
  }

  public loadProperties(): void {
    this.loadingProperties.set(true);
    this.loadingOverview.set(false);
    this.propertiesError.set('');
    this.overviewError.set('');
    this.properties.set([]);
    this.overview.set(null);
    this.propertyControl.setValue('');

    this.propertyService.getProperties('', '').subscribe({
      next: (properties) => {
        this.properties.set(properties);
        this.loadingProperties.set(false);

        if (properties.length > 0) {
          this.propertyControl.setValue(properties[0].id);
          this.loadOverview();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingProperties.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.propertiesError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : 'Nem sikerült betölteni a szálláshelyeket.',
        );
      },
    });
  }

  public loadOverview(): void {
    const id = this.propertyControl.value;
    this.overview.set(null);
    this.overviewError.set('');

    if (!id) {
      this.loadingOverview.set(false);
      return;
    }

    this.loadingOverview.set(true);

    this.propertyService.getOverview(id).subscribe({
      next: (overview) => {
        if (this.propertyControl.value !== id) {
          return;
        }

        this.overview.set(overview);
        this.loadingOverview.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (this.propertyControl.value !== id) {
          return;
        }

        this.loadingOverview.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.overviewError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : error.status === 404
              ? 'A szálláshely már nem található.'
              : 'Nem sikerült betölteni az áttekintést.',
        );
      },
    });
  }
}