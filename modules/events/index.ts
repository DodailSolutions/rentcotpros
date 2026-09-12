// Venues & Events Module
export interface EventVenue {
  id: string;
  organization_id: string;
  property_id: string;
  name: string; // e.g. "Sunset Lawn", "Lakeside Amphitheater", "Banquet Pavilion"
  capacity: number;
  rental_rate_per_day: number;
  features: string[];
}
