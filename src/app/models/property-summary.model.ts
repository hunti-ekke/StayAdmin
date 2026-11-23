import { PropertyCategory } from './property-category';

export interface PropertySummary {
  id: string;
  imageUrl: string;
  name: string;
  location: string;
  category: PropertyCategory;
}