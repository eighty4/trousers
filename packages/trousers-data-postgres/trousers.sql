create table trousers.users
(
    user_id         uuid                    default uuid_generate_v4() primary key,
    email           varchar unique not null,
    created_when    timestamptz    not null default current_timestamp,
    last_login_when timestamptz
);

create table trousers.banks
(
    bank_id       varchar primary key,
    name          varchar not null,
    primary_color char(6),
    logo          varchar
);

create table trousers.linked_banks
(
    linked_bank_id varchar primary key,
    user_id        uuid        not null references trousers.users (user_id),
    bank_id        varchar     not null references trousers.banks (bank_id),
    access_token   varchar     not null,
    linked_when    timestamptz not null default current_timestamp,
    unique (user_id, bank_id)
);

create table trousers.linked_accounts
(
    linked_account_id     varchar primary key,
    linked_bank_id        varchar     not null references trousers.linked_banks (linked_bank_id),
    user_id               uuid        not null references trousers.users (user_id),
    bank_id               varchar     not null references trousers.banks (bank_id),
    display_name          varchar     not null,
    official_name         varchar,
    mask                  char(4),
    currency_code         char(3),
    balance_available     decimal,
    balance_current       decimal,
    balance_limit         decimal,
    balances_updated_when timestamptz,
    account_type          varchar     not null,
    account_subtype       varchar,
    linked_when           timestamptz not null default current_timestamp
);
