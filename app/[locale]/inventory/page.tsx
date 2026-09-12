"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  AlertCircle,
  Plus,
  Minus,
  Search,
  ArrowUpDown,
  RefreshCw,
  Package,
  Layers,
  Sparkles,
  Flame,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: "linen" | "amenities" | "supplies" | "fnb_rations";
  currentStock: number;
  minThreshold: number;
  unit: string;
  property: string;
  costPerUnit: number;
}

const initialItems: InventoryItem[] = [
  { id: "inv-1", name: "King Size Bedsheets (Cotton)", category: "linen", currentStock: 48, minThreshold: 20, unit: "pairs", property: "Green Valley Farmhouse", costPerUnit: 750 },
  { id: "inv-2", name: "Plush Bath Towels (600 GSM)", category: "linen", currentStock: 14, minThreshold: 30, unit: "pcs", property: "Palm Oasis Resort", costPerUnit: 350 },
  { id: "inv-3", name: "Hand Towels", category: "linen", currentStock: 38, minThreshold: 25, unit: "pcs", property: "Palm Oasis Resort", costPerUnit: 180 },
  { id: "inv-4", name: "Herbal Shower Gel & Shampoo Kits", category: "amenities", currentStock: 120, minThreshold: 50, unit: "kits", property: "All Properties", costPerUnit: 45 },
  { id: "inv-5", name: "Dental & Shaving Kits", category: "amenities", currentStock: 18, minThreshold: 40, unit: "kits", property: "All Properties", costPerUnit: 30 },
  { id: "inv-6", name: "Firewood Bundles (15kg)", category: "supplies", currentStock: 8, minThreshold: 15, unit: "bundles", property: "Wildwoods Campsite", costPerUnit: 300 },
  { id: "inv-7", name: "BBQ Charcoal (10kg bag)", category: "supplies", currentStock: 5, minThreshold: 10, unit: "bags", property: "Wildwoods Campsite", costPerUnit: 450 },
  { id: "inv-8", name: "Surface Sanitizer (5L Can)", category: "supplies", currentStock: 12, minThreshold: 4, unit: "cans", property: "All Properties", costPerUnit: 600 },
  { id: "inv-9", name: "Basmati Rice (25kg Sack)", category: "fnb_rations", currentStock: 6, minThreshold: 3, unit: "sacks", property: "Green Valley Farmhouse", costPerUnit: 2200 },
  { id: "inv-10", name: "Tea Leaves & Coffee Beans", category: "fnb_rations", currentStock: 15, minThreshold: 10, unit: "kg", property: "All Properties", costPerUnit: 500 },
];

export default function InventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const adjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentStock: Math.max(0, item.currentStock + delta) } : item
      )
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.property.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockItems = items.filter((i) => i.currentStock <= i.minThreshold);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.inventory", "Inventory, Linen & Supplies")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track bed linen turnover, campfire wood, toiletry kits, and kitchen provisions across properties.
          </p>
        </div>
        <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px]">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add New Stock Item</span>
        </Button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">{lowStockItems.length} items</span> are below minimum reorder threshold:{" "}
            <span className="font-semibold">{lowStockItems.map((i) => i.name).join(", ")}</span>.
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stock item name or property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "all", label: "All Categories" },
                { id: "linen", label: "Bed Linen & Towels" },
                { id: "amenities", label: "Toiletries" },
                { id: "supplies", label: "BBQ & Chemicals" },
                { id: "fnb_rations", label: "F&B Dry Rations" },
              ].map((c) => (
                <Button
                  key={c.id}
                  variant={categoryFilter === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(c.id)}
                  className="whitespace-nowrap text-xs h-9 min-h-[36px]"
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          return (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.property}</div>
                  </div>
                  {isLow ? (
                    <Badge variant="destructive" className="gap-1 text-[11px]">
                      <AlertCircle className="h-3 w-3" /> Reorder
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200">
                      In Stock
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{item.currentStock}</span>
                    <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Min Alert: <span className="font-medium text-foreground">{item.minThreshold} {item.unit}</span>
                  </div>
                </div>

                {/* Progress bar towards min threshold */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isLow ? "bg-destructive" : "bg-emerald-500"}`}
                    style={{
                      width: `${Math.min(100, (item.currentStock / (item.minThreshold * 2)) * 100)}%`,
                    }}
                  />
                </div>

                {/* Quick Increment / Decrement Counter */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">₹{item.costPerUnit} / {item.unit.replace(/s$/, "")}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
