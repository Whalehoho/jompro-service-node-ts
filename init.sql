create table "user"
(
    uuid          varchar(255) not null
        constraint user_pk
            primary key,
    email         varchar(255),
    role          varchar(255) default 'user'::character varying,
    telegram_id   integer,
    subscriptions varchar      default '.*'::character varying
);

create table alert
(
    type         varchar(255)                not null,
    tags         jsonb   default '{}'::jsonb not null,
    timestamp    timestamp with time zone    not null,
    resolve      timestamp with time zone,
    last_alert   timestamp with time zone,
    last_trigger timestamp with time zone    not null,
    count        integer default 1           not null,
    mute         boolean default false       not null,
    params       jsonb                       not null,
    constraint alert_pk
        primary key (type, tags, timestamp)
);

create unique index alert_upsert_partial_index
    on alert (type, tags)
    where (resolve IS NULL);

create function notify_alert() returns trigger
    language plpgsql
as
$$
begin
    if new.last_alert != new.last_trigger then
        perform pg_notify('alert', row_to_json(new)::text);
    end if;
    return null;
end;
$$;

create trigger insert_alert_trigger
    after insert
    on alert
    for each row
execute procedure notify_alert();

create trigger update_alert_trigger
    after update
    on alert
    for each row
execute procedure notify_alert();
