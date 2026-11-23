export enum PropertyCategory {
  Hotel = 'Hotel',
  Pension = 'Pension',
  Apartment = 'Apartment',
  Guesthouse = 'Guesthouse',
}

export const propertyCategoryLabels: Record<PropertyCategory, string> = {
  [PropertyCategory.Hotel]: 'Hotel',
  [PropertyCategory.Pension]: 'Panzió',
  [PropertyCategory.Apartment]: 'Apartman',
  [PropertyCategory.Guesthouse]: 'Vendégház',
};