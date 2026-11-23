import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { PropertyCategory, propertyCategoryLabels } from '../../models/property-category';
import { PropertySummary } from '../../models/property-summary.model';

@Component({
  selector: 'app-property-card',
  imports: [MatCard, MatCardContent],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
})
export class PropertyCard {
  @Input({ required: true }) public property!: PropertySummary;

  public readonly categoryLabels: Record<PropertyCategory, string> = propertyCategoryLabels;
}