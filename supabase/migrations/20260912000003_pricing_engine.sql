-- ==============================================================================
-- Rentcot Property OS — Phase 4: Pricing Engine Schema
-- Multi-tenant rate plans, overrides, corporate cards, and dynamic pricing
-- ==============================================================================

-- 1. Custom Types for Pricing
do $$ begin
  create type pricing_type as enum (
    'nightly',
    'hourly',
    'day_use',
    'tent_flat',
    'tent_per_person'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type override_type as enum (
    'fixed_rate',
    'percent_increase',
    'percent_decrease'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type pet_fee_type as enum (
    'none',
    'flat_per_stay',
    'per_pet_per_night'
  );
exception
  when duplicate_object then null;
end $$;

-- 2. Rate Plans (Core pricing models per unit type)
create table if not exists public.rate_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_type_id uuid not null references public.unit_types(id) on delete cascade,
  name text not null, -- e.g. "Standard Best Available Rate", "Day Picnic Package (10AM-6PM)", "Hourly Resting Rate"
  pricing_type pricing_type not null default 'nightly',
  
  -- Base Pricing
  base_rate numeric(12, 2) not null default 0.00 check (base_rate >= 0),
  extra_adult_rate numeric(12, 2) not null default 0.00 check (extra_adult_rate >= 0),
  extra_child_rate numeric(12, 2) not null default 0.00 check (extra_child_rate >= 0),
  
  -- Hourly Specific
  price_per_hour numeric(12, 2) default 0.00 check (price_per_hour >= 0),
  min_hours integer default 2 check (min_hours > 0),
  
  -- Day-Use Specific (10:00 AM - 06:00 PM)
  day_use_start_time time default '10:00',
  day_use_end_time time default '18:00',
  
  -- Long-stay discounts
  weekly_discount_percent numeric(5, 2) not null default 0.00 check (weekly_discount_percent between 0 and 100),
  monthly_discount_percent numeric(5, 2) not null default 0.00 check (monthly_discount_percent between 0 and 100),
  
  -- Pet Policy & Fee
  pets_allowed boolean not null default false,
  pet_fee_type pet_fee_type not null default 'none',
  pet_fee_amount numeric(12, 2) not null default 0.00 check (pet_fee_amount >= 0),
  
  -- Tax
  tax_percent numeric(5, 2) not null default 12.00 check (tax_percent between 0 and 100),
  
  min_nights integer not null default 1 check (min_nights > 0),
  max_nights integer default 365,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Rate Overrides (Weekend rates, festival surges, seasonal holidays)
create table if not exists public.rate_overrides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_type_id uuid references public.unit_types(id) on delete cascade, -- null applies to all units in property
  name text not null, -- e.g. "Diwali Festival Surge", "Weekend Friday/Saturday", "New Year Eve Premium"
  start_date date not null,
  end_date date not null,
  -- Days of week: 0=Sunday, 1=Monday... 5=Friday, 6=Saturday. Null or empty applies to all days in date range
  days_of_week integer[] default array[]::integer[],
  override_type override_type not null default 'percent_increase',
  override_value numeric(12, 2) not null check (override_value >= 0), -- e.g. 25.0 for 25% increase, or 8500 for fixed rate
  reason text not null default 'seasonal',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_override_dates check (end_date >= start_date)
);

-- 4. Corporate & Agent Rate Cards (B2B Negotiated Rates)
create table if not exists public.corporate_rate_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  client_name text not null, -- e.g. "Microsoft Hyderabad", "WedMeGood Partner", "MakeMyTrip B2B"
  corporate_code text not null, -- e.g. "MSFT2026", "WMG_EXCLUSIVE"
  discount_type override_type not null default 'percent_decrease',
  discount_value numeric(12, 2) not null check (discount_value >= 0), -- e.g. 20.0 for 20% discount
  contact_person text,
  contact_email text,
  contact_phone text,
  valid_from date not null default current_date,
  valid_until date not null default (current_date + interval '1 year'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_org_corporate_code unique (organization_id, corporate_code)
);

-- 5. Demand-Based Dynamic Pricing Rules (Rule-based triggers)
create table if not exists public.dynamic_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null, -- e.g. "High Demand Surge (>80% Occupancy)", "Last-Minute Distress Sale (<30% within 3 days)"
  
  -- Trigger conditions
  occupancy_operator text not null check (occupancy_operator in ('>=', '<=')),
  occupancy_percent numeric(5, 2) not null check (occupancy_percent between 0 and 100),
  days_before_arrival_max integer, -- null for anytime, e.g. 3 means applies only within 3 days of arrival
  
  -- Pricing Action
  adjustment_percent numeric(5, 2) not null, -- positive for surge (e.g. +20%), negative for discount (e.g. -15%)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_rate_plans_unit_type on public.rate_plans(unit_type_id);
create index if not exists idx_rate_plans_org on public.rate_plans(organization_id);
create index if not exists idx_rate_overrides_dates on public.rate_overrides(property_id, start_date, end_date);
create index if not exists idx_rate_overrides_org on public.rate_overrides(organization_id);
create index if not exists idx_corp_cards_code on public.corporate_rate_cards(organization_id, corporate_code);
create index if not exists idx_dynamic_rules_property on public.dynamic_pricing_rules(property_id);

-- Triggers for updated_at
create trigger trg_rate_plans_updated_at before update on public.rate_plans for each row execute procedure public.handle_updated_at();
create trigger trg_rate_overrides_updated_at before update on public.rate_overrides for each row execute procedure public.handle_updated_at();
create trigger trg_corporate_cards_updated_at before update on public.corporate_rate_cards for each row execute procedure public.handle_updated_at();
create trigger trg_dynamic_rules_updated_at before update on public.dynamic_pricing_rules for each row execute procedure public.handle_updated_at();

-- Row Level Security
alter table public.rate_plans enable row level security;
alter table public.rate_overrides enable row level security;
alter table public.corporate_rate_cards enable row level security;
alter table public.dynamic_pricing_rules enable row level security;

-- Policies: Organization Isolation
create policy "Members can view rate plans in their org"
  on public.rate_plans for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage rate plans"
  on public.rate_plans for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

create policy "Members can view rate overrides in their org"
  on public.rate_overrides for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage rate overrides"
  on public.rate_overrides for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

create policy "Members can view corporate rate cards in their org"
  on public.corporate_rate_cards for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage corporate rate cards"
  on public.corporate_rate_cards for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

create policy "Members can view dynamic pricing rules in their org"
  on public.dynamic_pricing_rules for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage dynamic pricing rules"
  on public.dynamic_pricing_rules for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );
