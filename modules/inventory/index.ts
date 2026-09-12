// Inventory & Linen Module
export interface InventoryItem {
  id: string;
  organization_id: string;
  property_id: string;
  name: string; // e.g. "Bed Sheet King", "Camp Stove Gas", "Towel Bath", "Mineral Water Bottle"
  category: "linen" | "toiletries" | "f&b_supplies" | "maintenance_parts" | "cleaning_supplies";
  current_stock: number;
  min_reorder_level: number;
  unit_of_measure: "piece" | "kg" | "liter" | "pack";
}
