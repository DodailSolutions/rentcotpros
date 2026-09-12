-- ==============================================================================
-- Rentcot Property OS — Phase 5: OTA Channel Manager Schema
-- Multi-tenant OTA connections, unit mappings, sync logs, and rate parity
-- ==============================================================================

-- 1. Custom Types for OTA Channel Management
do $$ begin
  create type ota_channel as enum (
    'airbnb',
    'booking_com',
    'agoda',
    'makemytrip',
    'goibibo',
    'vrbo',
    'mock_sandbox'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type sync_direction as enum (
    'push_rates',
    'push_availability',
    'pull_bookings',
    'pull_cancellations',
    'rate_parity_check'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type sync_status as enum (
    'success',
    'failed',
    'warning',
    'in_progress'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type parity_status as enum (
    'parity_match',
    'ota_undercut',
    'rentcot_cheaper'
  );
exception
  when duplicate_object then null;
end $$;

-- 2. OTA Connections (Per Property / Channel Credentials)
create table if not exists public.ota_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  channel ota_channel not null,
  hotel_id text, -- OTA's internal property/hotel ID
  api_key text,
  secret_key text,
  ical_url text, -- For Airbnb / VRBO calendar feeds
  sync_rates_enabled boolean not null default true,
  sync_availability_enabled boolean not null default true,
  sync_interval_minutes integer not null default 15 check (sync_interval_minutes >= 5),
  status text not null default 'active' check (status in ('active', 'paused', 'error', 'disconnected')),
  last_sync_at timestamptz,
  last_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_property_channel unique (property_id, channel)
);

-- 3. OTA Unit Type Mappings (Rentcot Unit Types <-> OTA Room Types)
create table if not exists public.ota_unit_mappings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  connection_id uuid not null references public.ota_connections(id) on delete cascade,
  unit_type_id uuid not null references public.unit_types(id) on delete cascade,
  ota_room_type_id text not null, -- e.g. "BCOM_DELUXE_401"
  ota_rate_plan_id text, -- e.g. "BCOM_EP_NONREFUNDABLE"
  rate_markup_percent numeric(5, 2) not null default 0.00, -- e.g. +15% markup to cover OTA commission
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_connection_unit_type unique (connection_id, unit_type_id)
);

-- 4. OTA Sync Logs (Owner-facing sync event history)
create table if not exists public.ota_sync_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  channel ota_channel not null,
  direction sync_direction not null,
  status sync_status not null default 'success',
  records_synced integer not null default 0,
  latency_ms integer default 0,
  payload_summary text,
  error_details text,
  created_at timestamptz not null default now()
);

-- 5. Rate Parity Logs (Audit trail of live price comparisons)
create table if not exists public.rate_parity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  channel ota_channel not null,
  unit_type_id uuid not null references public.unit_types(id) on delete cascade,
  date date not null,
  rentcot_rate numeric(12, 2) not null,
  ota_live_rate numeric(12, 2) not null,
  discrepancy_amount numeric(12, 2) not null,
  discrepancy_percent numeric(5, 2) not null,
  status parity_status not null,
  alert_dismissed boolean not null default false,
  checked_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_ota_conn_property on public.ota_connections(property_id);
create index if not exists idx_ota_conn_org on public.ota_connections(organization_id);
create index if not exists idx_ota_map_conn on public.ota_unit_mappings(connection_id);
create index if not exists idx_ota_sync_logs_org on public.ota_sync_logs(organization_id, created_at desc);
create index if not exists idx_ota_sync_logs_prop on public.ota_sync_logs(property_id, created_at desc);
create index if not exists idx_rate_parity_org on public.rate_parity_logs(organization_id, date);

-- Triggers
create trigger trg_ota_connections_updated_at before update on public.ota_connections for each row execute procedure public.handle_updated_at();
create trigger trg_ota_unit_mappings_updated_at before update on public.ota_unit_mappings for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.ota_connections enable row level security;
alter table public.ota_unit_mappings enable row level security;
alter table public.ota_sync_logs enable row level security;
alter table public.rate_parity_logs enable row level security;

create policy "Members can view OTA connections in their org"
  on public.ota_connections for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage OTA connections"
  on public.ota_connections for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

create policy "Members can view unit mappings in their org"
  on public.ota_unit_mappings for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "Owners and managers can manage unit mappings"
  on public.ota_unit_mappings for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );

create policy "Members can view sync logs in their org"
  on public.ota_sync_logs for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "System and staff can insert sync logs"
  on public.ota_sync_logs for insert
  with check (organization_id in (select public.get_auth_user_org_ids()));

create policy "Members can view rate parity logs in their org"
  on public.rate_parity_logs for select
  using (organization_id in (select public.get_auth_user_org_ids()) and public.has_property_access(property_id));

create policy "System and staff can insert/update rate parity logs"
  on public.rate_parity_logs for all
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager') and
    public.has_property_access(property_id)
  );
