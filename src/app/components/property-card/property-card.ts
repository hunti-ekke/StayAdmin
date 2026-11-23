import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PropertyCategory, propertyCategoryLabels } from '../../models/property-category';
import { PropertySummary } from '../../models/property-summary.model';

@Component({
  selector: 'app-property-card',
  imports: [MatButton, MatCard, MatCardContent, RouterLink],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
})
export class PropertyCard {
  @Input({ required: true }) public property!: PropertySummary;
  @Input() public busy = false;
  @Output() public deleteRequested = new EventEmitter<PropertySummary>();

  public readonly categoryLabels: Record<PropertyCategory, string> = propertyCategoryLabels;
}