// Front-Desk POS Module
export interface POSItem {
  id: string;
  organization_id: string;
  property_id: string;
  name: string;
  category: "food_beverage" | "activity" | "amenity_rental" | "merchandise";
  price: number;
  tax_rate: number;
  is_available: boolean;
}
