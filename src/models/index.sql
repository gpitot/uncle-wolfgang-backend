CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(400) NOT NULL,
    spots integer NOT NULL,
    start timestamp NOT NULL,
    open timestamp NOT NULL,
    enabled BOOLEAN not null DEFAULT TRUE
)

CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    registered timestamp NOT NULL,
    event_id integer not null references events(id),
    paid BOOLEAN not null default false,
    receipt varchar(100) default null,
    enabled BOOLEAN not null DEFAULT true
)

CREATE TABLE ladder_matches (
    id SERIAL PRIMARY KEY,
    player_1 VARCHAR(30) NOT NULL,
    player_2 VARCHAR(30) NOT NULL,
    match_date timestamp NOT NULL,
    player_1_games integer ,
    player_2_games integer ,
    player_1_paid BOOLEAN not null DEFAULT FALSE,
    player_2_paid BOOLEAN not null DEFAULT FALSE, 
    valid BOOLEAN not null DEFAULT FALSE
) 

CREATE TABLE ladder_ranks ()