import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PropertyCategory } from '../models/property-category';
import { PropertySummary } from '../models/property-summary.model';
import { API_URL } from './api-url';
import { getAuthHttpHeaders } from './auth-headers';

@Service()
export class PropertyService {
  private readonly httpClient = inject(HttpClient);

  public getProperties(name: string, category: PropertyCategory | '') {
    let params = new HttpParams();

    if (name.trim()) {
      params = params.set('name', name.trim());
    }

    if (category) {
      params = params.set('category', category);
    }

    return this.httpClient.get<PropertySummary[]>(`${API_URL}/properties`, {
      headers: getAuthHttpHeaders(),
      params,
    });
  }
}