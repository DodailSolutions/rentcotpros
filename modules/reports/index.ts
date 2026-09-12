// Reports & Analytics Module
export interface PropertyOccupancyReport {
  property_id: string;
  date: string;
  total_units: number;
  occupied_units: number;
  occupancy_percentage: number;
  rev_par: number; // Revenue per available room
  adr: number; // Average daily rate
  total_revenue: number;
}
