-- ==============================================================================
-- Rentcot Property OS — Phase 3: Staff Invitations Schema & RLS
-- ==============================================================================

create table if not exists public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text,
  phone text,
  role user_role not null default 'frontdesk',
  assigned_property_ids uuid[] default array[]::uuid[],
  invitation_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references public.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_invite_destination check (email is not null or phone is not null)
);

-- Indexing
create index if not exists idx_staff_invites_org on public.staff_invites(organization_id);
create index if not exists idx_staff_invites_token on public.staff_invites(invitation_token);
create index if not exists idx_staff_invites_email on public.staff_invites(email);

-- Trigger for updated_at
create trigger trg_staff_invites_updated_at before update on public.staff_invites for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.staff_invites enable row level security;

-- Owners and managers can view invites in their organization
create policy "Owners and managers can view staff invites"
  on public.staff_invites for select
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager')
  );

-- Owners and managers can create staff invites
create policy "Owners and managers can create staff invites"
  on public.staff_invites for insert
  with check (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager')
  );

-- Owners and managers can revoke or update staff invites
create policy "Owners and managers can update staff invites"
  on public.staff_invites for update
  using (
    organization_id in (select public.get_auth_user_org_ids()) and
    public.get_auth_user_role(organization_id) in ('owner', 'manager')
  );
