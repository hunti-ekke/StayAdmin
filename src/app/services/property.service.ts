import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PropertyCategory } from '../models/property-category';
import { Property, PropertyInput } from '../models/property.model';
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

  public getProperty(id: string) {
    return this.httpClient.get<Property>(`${API_URL}/properties/${id}`, {
      headers: getAuthHttpHeaders(),
    });
  }

  public createProperty(property: PropertyInput) {
    return this.httpClient.post<Property>(`${API_URL}/properties`, property, {
      headers: getAuthHttpHeaders(),
    });
  }

  public updateProperty(id: string, property: PropertyInput) {
    return this.httpClient.put<Property>(`${API_URL}/properties/${id}`, property, {
      headers: getAuthHttpHeaders(),
    });
  }

  public deleteProperty(id: string) {
    return this.httpClient.delete<void>(`${API_URL}/properties/${id}`, {
      headers: getAuthHttpHeaders(),
    });
  }
}