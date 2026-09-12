-- Migration: 20260912000005_camping_operations.sql
-- Module: Camping, Glamping & Outdoor Retreat Operations

-- Enum for Pitch Type
CREATE TYPE campsite_pitch_type AS ENUM (
  'luxury_glamping_dome',
  'pre_pitched_tent',
  'byot_ground_pitch',
  'rv_campervan_bay'
);

-- Enum for Ground Surface
CREATE TYPE pitch_ground_type AS ENUM (
  'wooden_deck',
  'grass_lawn',
  'sand_bed',
  'forest_floor',
  'gravel_pad'
);

-- Enum for Power Supply
CREATE TYPE pitch_power_type AS ENUM (
  '16a_rv_hookup',
  '5a_standard_plug',
  'solar_usb_only',
  'off_grid_unpowered'
);

-- Enum for Fire Pit Allocation
CREATE TYPE fire_pit_type AS ENUM (
  'private_stone_pit',
  'central_amphitheater',
  'portable_fire_brazier',
  'not_permitted'
);

-- Enum for Gear Condition
CREATE TYPE gear_condition AS ENUM (
  'ready_sanitized',
  'needs_cleaning',
  'in_use',
  'under_repair',
  'damaged'
);

-- 1. Campsite Pitches Table
CREATE TABLE campsite_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  pitch_number VARCHAR(50) NOT NULL,
  pitch_type campsite_pitch_type NOT NULL DEFAULT 'pre_pitched_tent',
  ground_type pitch_ground_type NOT NULL DEFAULT 'grass_lawn',
  power_supply pitch_power_type NOT NULL DEFAULT 'solar_usb_only',
  fire_pit fire_pit_type NOT NULL DEFAULT 'private_stone_pit',
  max_occupancy INT NOT NULL DEFAULT 4,
  max_tents_allowed INT NOT NULL DEFAULT 1,
  has_attached_washroom BOOLEAN NOT NULL DEFAULT FALSE,
  distance_to_washroom_meters INT NOT NULL DEFAULT 25,
  is_shaded BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, pitch_number)
);

-- 2. Campfire & BBQ Orders
CREATE TABLE campfire_bbq_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  pitch_id UUID REFERENCES campsite_pitches(id) ON DELETE SET NULL,
  guest_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  scheduled_slot TIMESTAMPTZ NOT NULL,
  firewood_bundles INT NOT NULL DEFAULT 1,
  bbq_package VARCHAR(50) NOT NULL DEFAULT 'veg_nonveg_mixed', -- veg, nonveg, mixed, charcoal_only
  fire_safety_cleared BOOLEAN NOT NULL DEFAULT FALSE,
  wind_safe_approved BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, delivered, active, extinguished
  special_requests TEXT,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Camping Gear Inventory & Sanitization
CREATE TABLE camping_gear_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  item_type VARCHAR(100) NOT NULL, -- sleeping_bag, trekking_pole, high_power_headlamp, camp_chair, air_mattress
  serial_tag VARCHAR(100) NOT NULL,
  condition gear_condition NOT NULL DEFAULT 'ready_sanitized',
  last_sanitized_at TIMESTAMPTZ,
  current_pitch_id UUID REFERENCES campsite_pitches(id) ON DELETE SET NULL,
  rented_by_guest VARCHAR(150),
  rented_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  rental_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Weather & Safety Logs
CREATE TABLE campsite_weather_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  temperature_celsius NUMERIC(5, 2) NOT NULL,
  wind_speed_kmh NUMERIC(5, 2) NOT NULL,
  gust_speed_kmh NUMERIC(5, 2) NOT NULL,
  rain_probability INT NOT NULL DEFAULT 0,
  campfire_ban_active BOOLEAN NOT NULL DEFAULT FALSE,
  weather_notes TEXT
);

-- Enable RLS
ALTER TABLE campsite_pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE campfire_bbq_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE camping_gear_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campsite_weather_logs ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies
CREATE POLICY "Tenant isolation for campsite_pitches"
  ON campsite_pitches FOR ALL
  USING (organization_id = (SELECT organization_id FROM org_members WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Tenant isolation for campfire_bbq_orders"
  ON campfire_bbq_orders FOR ALL
  USING (organization_id = (SELECT organization_id FROM org_members WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Tenant isolation for camping_gear_rentals"
  ON camping_gear_rentals FOR ALL
  USING (organization_id = (SELECT organization_id FROM org_members WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Tenant isolation for campsite_weather_logs"
  ON campsite_weather_logs FOR ALL
  USING (organization_id = (SELECT organization_id FROM org_members WHERE user_id = auth.uid() LIMIT 1));

-- Indexes for performance
CREATE INDEX idx_pitches_property ON campsite_pitches(property_id);
CREATE INDEX idx_bbq_orders_slot ON campfire_bbq_orders(property_id, scheduled_slot);
CREATE INDEX idx_gear_rentals_status ON camping_gear_rentals(property_id, condition);
CREATE INDEX idx_weather_recorded ON campsite_weather_logs(property_id, recorded_at DESC);
