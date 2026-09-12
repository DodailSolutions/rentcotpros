-- ==============================================================================
-- Rentcot Property OS — Phase 2: Multi-Tenant Core Database Schema
-- Multi-tenancy isolation via Supabase Row Level Security (RLS) on organization_id
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Custom Enumerations
do $$ begin
  create type user_role as enum (
    'owner',
    'manager',
    'frontdesk',
    'hr',
    'housekeeping',
    'event_coordinator',
    'guest'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type property_type as enum (
    'resort',
    'farmhouse',
    'camping_zone',
    'villa',
    'cottages'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type unit_category as enum (
    'room',
    'tent',
    'cottage',
    'dorm_bed',
    'villa',
    'individual_stay'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  -- State machine: housekeeping, front desk, and PMS dashboard read/write from here
  create type unit_operational_status as enum (
    'clean',
    'dirty',
    'inspected',
    'occupied',
    'vacant',
    'out_of_service'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type inventory_category as enum (
    'overnight_unit',
    'event_venue',
    'day_outing_slot',
    'activity_slot'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type pricing_model as enum (
    'per_night',
    'per_slot',
    'per_person',
    'flat_rate'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type booking_source as enum (
    'direct',
    'ota',
    'walk_in',
    'agent',
    'corporate'
  );
exception
  when duplicate_object then null;
end $$;

-- ==============================================================================
-- 3. Core Tables
-- ==============================================================================

-- 3.1 Organizations (The Tenant Account)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  billing_email text not null,
  phone text,
  subscription_tier text not null default 'starter' check (subscription_tier in ('starter', 'growth', 'enterprise')),
  subscription_status text not null default 'active' check (subscription_status in ('active', 'trialing', 'past_due', 'canceled')),
  logo_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.2 User Profiles (Extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  preferred_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.3 Organization Members (RBAC: User role & property scope per organization)
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role user_role not null default 'frontdesk',
  -- Scoped property IDs: null or empty array means all properties in the org (e.g. Owner)
  assigned_property_ids uuid[] default array[]::uuid[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_org_user unique (organization_id, user_id)
);

-- 3.4 Properties (One Org -> Many Physical Properties: Resort, Farmhouse, Camping Zone)
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  type property_type not null default 'resort',
  description text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  timezone text not null default 'Asia/Kolkata',
  currency text not null default 'INR',
  contact_phone text,
  contact_email text,
  check_in_time time not null default '14:00',
  check_out_time time not null default '11:00',
  hero_image_url text,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_org_property_slug unique (organization_id, slug)
);

-- 3.5 Unit Types (Room, Tent, Cottage, Dorm Bed, Individual Stay — belongs to a Property)
create table if not exists public.unit_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null, -- e.g. "Luxury Glamping Dome", "3-BHK Farmhouse Villa", "Deluxe Lake View Cottage"
  slug text not null,
  category unit_category not null default 'room',
  description text,
  base_capacity integer not null default 2 check (base_capacity > 0),
  max_capacity integer not null default 4 check (max_capacity >= base_capacity),
  adults_capacity integer not null default 2 check (adults_capacity > 0),
  children_capacity integer not null default 2 check (children_capacity >= 0),
  base_price numeric(12, 2) not null default 0.00 check (base_price >= 0),
  extra_adult_price numeric(12, 2) not null default 0.00 check (extra_adult_price >= 0),
  extra_child_price numeric(12, 2) not null default 0.00 check (extra_child_price >= 0),
  -- Amenities per unit_type: list of strings (e.g. ['wifi', 'ac', 'pool', 'bbq'])
  amenities jsonb not null default '[]'::jsonb,
  -- Pet Policy: pets allowed, max pets, extra pet fee, restrictions
  pet_policy jsonb not null default '{"allowed": false, "max_pets": 0, "fee_per_pet": 0, "restrictions": ""}'::jsonb,
  images text[] default array[]::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_property_unit_type_slug unique (property_id, slug)
);

-- 3.6 Units (Individual physical instances: Room 101, Tent A3, Cottage 2)
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_type_id uuid not null references public.unit_types(id) on delete cascade,
  unit_number text not null, -- e.g. "Room 101", "Tent A3", "Cottage 2"
  floor text,
  building text,
  -- Real-time Operational State Machine
  operational_status unit_operational_status not null default 'clean',
  housekeeping_notes text,
  maintenance_notes text,
  last_cleaned_at timestamptz,
  last_inspected_at timestamptz,
  last_cleaned_by uuid references public.users(id),
  last_inspected_by uuid references public.users(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_property_unit_number unique (property_id, unit_number)
);

-- 3.7 Bookable Inventory (Generic: event venues, day-outings, activity slots, and overnight stays)
create table if not exists public.bookable_inventory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  category inventory_category not null,
  name text not null, -- e.g. "Sunset Banquet Lawn", "Full Day Pool Pass", "ATV Trail Slot"
  capacity integer not null check (capacity > 0),
  pricing_model pricing_model not null default 'per_slot',
  base_price numeric(12, 2) not null default 0.00 check (base_price >= 0),
  slot_duration_minutes integer, -- for activities / day-outing slots
  start_time time,
  end_time time,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.8 Guests (Primary guest, contact details, party composition, CRM & stay history)
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text not null,
  country_code text not null default '+91',
  id_type text check (id_type in ('passport', 'national_id', 'driving_license', 'aadhaar')),
  id_number text,
  id_document_url text,
  id_verified boolean not null default false,
  
  -- Party composition profile (last known / typical defaults)
  default_adults_count integer not null default 2 check (default_adults_count > 0),
  default_children_count integer not null default 0 check (default_children_count >= 0),
  has_pets boolean not null default false,
  pet_details text,
  
  -- CRM, Notes & Stay preferences
  stay_preferences jsonb not null default '{}'::jsonb,
  notes text,
  vip_status boolean not null default false,
  total_stays_count integer not null default 0 check (total_stays_count >= 0),
  total_revenue_spent numeric(12, 2) not null default 0.00 check (total_revenue_spent >= 0),
  last_booking_source booking_source not null default 'direct',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.9 Audit Log (From day one: actor, action, entity type/id, before/after values, timestamp)
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  actor_user_id uuid references public.users(id) on delete set null,
  actor_role user_role,
  action text not null, -- e.g. 'unit.status_changed', 'reservation.updated', 'payroll.processed'
  entity_type text not null, -- e.g. 'unit', 'reservation', 'guest', 'inventory', 'org_member'
  entity_id text not null,
  before_values jsonb,
  after_values jsonb,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 4. Indexes for Performance & Multitenant Queries
-- ==============================================================================
create index if not exists idx_org_members_user on public.org_members(user_id);
create index if not exists idx_org_members_org on public.org_members(organization_id);
create index if not exists idx_properties_org on public.properties(organization_id);
create index if not exists idx_unit_types_property on public.unit_types(property_id);
create index if not exists idx_unit_types_org on public.unit_types(organization_id);
create index if not exists idx_units_property on public.units(property_id);
create index if not exists idx_units_org on public.units(organization_id);
create index if not exists idx_units_status on public.units(operational_status);
create index if not exists idx_inventory_property on public.bookable_inventory(property_id);
create index if not exists idx_inventory_org on public.bookable_inventory(organization_id);
create index if not exists idx_guests_org on public.guests(organization_id);
create index if not exists idx_guests_phone on public.guests(organization_id, phone);
create index if not exists idx_guests_email on public.guests(organization_id, email);
create index if not exists idx_audit_log_org on public.audit_log(organization_id);
create index if not exists idx_audit_log_entity on public.audit_log(entity_type, entity_id);
create index if not exists idx_audit_log_created_at on public.audit_log(created_at desc);

-- ==============================================================================
-- 5. Helper Functions for RLS and Tenancy Resolution
-- ==============================================================================

-- Returns all organization IDs that the current authenticated user belongs to
create or replace function public.get_auth_user_org_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select organization_id 
  from public.org_members 
  where user_id = auth.uid() 
    and is_active = true;
$$;

-- Returns current user's role in a specific organization
create or replace function public.get_auth_user_role(org_id uuid)
returns user_role
language sql
security definer
stable
as $$
  select role 
  from public.org_members 
  where user_id = auth.uid() 
    and organization_id = org_id 
    and is_active = true 
  limit 1;
$$;

-- Checks if current user has access to a specific property in an organization
create or replace function public.has_property_access(prop_id uuid)
returns boolean
language plpgsql
security definer
stable
as $$
declare
  member_record public.org_members%rowtype;
  prop_org_id uuid;
begin
  select organization_id into prop_org_id from public.properties where id = prop_id;
  if prop_org_id is null then
    return false;
  end if;

  select * into member_record 
  from public.org_members 
  where user_id = auth.uid() 
    and organization_id = prop_org_id 
    and is_active = true;

  if not found then
    return false;
  end if;

  -- Owners have access to all properties
  if member_record.role = 'owner' then
    return true;
  end if;

  -- If assigned_property_ids is empty or null, member has access to all properties in the org
  if member_record.assigned_property_ids is null or cardinality(member_record.assigned_property_ids) = 0 then
    return true;
  end if;

  -- Otherwise, verify the specific property ID is in the assigned array
  return prop_id = any(member_record.assigned_property_ids);
end;
$$;

-- Generic updated_at timestamp trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
create trigger trg_organizations_updated_at before update on public.organizations for each row execute procedure public.handle_updated_at();
create trigger trg_users_updated_at before update on public.users for each row execute procedure public.handle_updated_at();
create trigger trg_org_members_updated_at before update on public.org_members for each row execute procedure public.handle_updated_at();
create trigger trg_properties_updated_at before update on public.properties for each row execute procedure public.handle_updated_at();
create trigger trg_unit_types_updated_at before update on public.unit_types for each row execute procedure public.handle_updated_at();
create trigger trg_units_updated_at before update on public.units for each row execute procedure public.handle_updated_at();
create trigger trg_bookable_inventory_updated_at before update on public.bookable_inventory for each row execute procedure public.handle_updated_at();
create trigger trg_guests_updated_at before update on public.guests for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- 6. Row Level Security (RLS) Policies
-- Strict isolation: No tenant can query or modify another tenant's data
-- ==============================================================================

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.org_members enable row level security;
alter table public.properties enable row level security;
alter table public.unit_types enable row level security;
alter table public.units enable row level security;
alter table public.bookable_inventory enable row level security;
alter table public.guests enable row level security;
alter table public.audit_log enable row level security;

-- 6.1 Organizations Policies
create policy "Users can view their own organizations"
  on public.organizations for select
  using (id in (select public.get_auth_user_org_ids()));

create policy "Owners can update their organization"
  on public.organizations for update
  using (public.get_auth_user_role(id) = 'owner');

-- 6.2 Users Profiles Policies
create policy "Users can view profiles in their organizations"
  on public.users for select
  using (
    id = auth.uid() or
    exists (
      select 1 from public.org_members om1
      join public.org_members om2 on om1.organization_id = om2.organization_id
      where om1.user_id = auth.uid() and om2.user_id = public.users.id
    )
  );

create policy "Users can update their own profile"
  on public.users for update
  using (id = auth.uid());

-- 6.3 Org Members Policies
create policy "Members can view members in their organizations"
  on public.org_members for select
  using (organization_id in (select public.get_auth_user_org_ids()));

create policy "Owners can manage members"
  on public.org_members for all
  using (public.get_auth_user_role(organization_id) = 'owner');

-- 6.4 Properties Policies
create policy "Members can view properties in their org"
  on public.properties for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.has_property_access(id)
  );

create policy "Owners and Managers can manage properties"
  on public.properties for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(id)
  );

-- 6.5 Unit Types Policies
create policy "Members can view unit types in their org"
  on public.unit_types for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.has_property_access(property_id)
  );

create policy "Owners and Managers can manage unit types"
  on public.unit_types for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

-- 6.6 Units Policies
create policy "Members can view units in their org"
  on public.units for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.has_property_access(property_id)
  );

create policy "Staff can update unit operational status"
  on public.units for update
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.has_property_access(property_id)
  );

create policy "Owners and Managers can insert or delete units"
  on public.units for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

-- 6.7 Bookable Inventory Policies
create policy "Members can view bookable inventory in their org"
  on public.bookable_inventory for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.has_property_access(property_id)
  );

create policy "Owners, Managers and Event Coordinators can manage bookable inventory"
  on public.bookable_inventory for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager', 'event_coordinator') and
    public.has_property_access(property_id)
  );

-- 6.8 Guests Policies
create policy "Org staff can view guests in their org"
  on public.guests for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager', 'frontdesk', 'event_coordinator')
  );

create policy "Front desk, Managers and Owners can manage guests"
  on public.guests for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager', 'frontdesk')
  );

-- 6.9 Audit Log Policies
create policy "Owners and Managers can view audit logs"
  on public.audit_log for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager')
  );

create policy "All authenticated staff can insert audit logs"
  on public.audit_log for insert
  with check (
    organization_id in (select public.get_auth_user_org_ids())
  );
