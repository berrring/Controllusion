create table if not exists users (
    id uuid primary key,
    full_name varchar(120) not null,
    email varchar(190) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null,
    active boolean not null default true,
    title varchar(120),
    phone varchar(40),
    theme_preference varchar(20) not null default 'light',
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table if not exists customers (
    id uuid primary key,
    owner_id uuid references users(id) on delete set null,
    full_name varchar(120) not null,
    email varchar(190) not null unique,
    phone varchar(40) not null,
    company varchar(160) not null,
    job_title varchar(120),
    status varchar(32) not null,
    stage varchar(32) not null,
    deal_value numeric(12, 2) not null default 0,
    notes text,
    location varchar(160),
    industry varchar(120),
    last_contacted_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create index if not exists idx_customers_owner_id on customers(owner_id);
create index if not exists idx_customers_status on customers(status);
create index if not exists idx_customers_stage on customers(stage);
create index if not exists idx_customers_created_at on customers(created_at desc);
