import { PropertyCategory } from './property-category';

export interface PropertyInput {
  name: string;
  location: string;
  address: string;
  category: PropertyCategory;
  description: string;
  imageUrl: string;
  roomPrices: {
    Standard: number;
    Superior: number;
    Family: number;
  };
}

export interface Property extends PropertyInput {
  id: string;
}