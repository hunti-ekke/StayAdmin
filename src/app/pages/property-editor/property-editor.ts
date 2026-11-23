import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyCategory, propertyCategoryLabels } from '../../models/property-category';
import { PropertyInput } from '../../models/property.model';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-editor',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './property-editor.html',
  styleUrl: './property-editor.scss',
})
export class PropertyEditor implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);

  public readonly propertyId = this.route.snapshot.paramMap.get('id');
  public readonly isEditMode = this.propertyId !== null;
  public readonly categories = Object.values(PropertyCategory);
  public readonly categoryLabels = propertyCategoryLabels;
  public readonly loading = signal(false);
  public readonly saving = signal(false);
  public readonly loadError = signal('');
  public readonly saveError = signal('');
  public readonly previewFailed = signal(false);

  public readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/\S/),
    ]),
    location: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/\S/),
    ]),
    address: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/\S/),
    ]),
    category: this.formBuilder.nonNullable.control<PropertyCategory | ''>(
      '',
      Validators.required,
    ),
    description: this.formBuilder.nonNullable.control(''),
    imageUrl: this.formBuilder.nonNullable.control(''),
    standardPrice: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    superiorPrice: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    familyPrice: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  public ngOnInit(): void {
    if (this.propertyId !== null) {
      this.loadProperty();
    }
  }

  public loadProperty(): void {
    const id = this.propertyId;

    if (id === null) {
      return;
    }

    this.loading.set(true);
    this.loadError.set('');

    this.propertyService.getProperty(id).subscribe({
      next: (property) => {
        this.form.reset({
          name: property.name,
          location: property.location,
          address: property.address,
          category: property.category,
          description: property.description,
          imageUrl: property.imageUrl,
          standardPrice: property.roomPrices.Standard,
          superiorPrice: property.roomPrices.Superior,
          familyPrice: property.roomPrices.Family,
        });
        this.previewFailed.set(false);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.loadError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : error.status === 404
              ? 'A szálláshely nem található.'
              : 'Nem sikerült betölteni a szálláshelyet.',
        );
      },
    });
  }

  public clampPrice(event: Event, field: 'standardPrice' | 'superiorPrice' | 'familyPrice'): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (input.value !== '' && value < 0) {
      input.value = '0';
      this.form.controls[field].setValue(0);
    }
  }

  public save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (
      !value.category ||
      value.standardPrice === null ||
      value.superiorPrice === null ||
      value.familyPrice === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const property: PropertyInput = {
      name: value.name.trim(),
      location: value.location.trim(),
      address: value.address.trim(),
      category: value.category,
      description: value.description.trim(),
      imageUrl: value.imageUrl.trim(),
      roomPrices: {
        Standard: value.standardPrice,
        Superior: value.superiorPrice,
        Family: value.familyPrice,
      },
    };

    const id = this.propertyId;
    const request =
      id === null
        ? this.propertyService.createProperty(property)
        : this.propertyService.updateProperty(id, property);

    this.saving.set(true);
    this.saveError.set('');

    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/properties');
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigateByUrl('/login');
          return;
        }

        this.saveError.set(
          error.status === 0
            ? 'Az API nem érhető el.'
            : error.status === 400
              ? 'Hibás adatok. Ellenőrizd az űrlap mezőit.'
              : 'Nem sikerült menteni a szálláshelyet.',
        );
      },
    });
  }
}