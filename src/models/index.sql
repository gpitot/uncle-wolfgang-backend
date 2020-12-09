CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(30) NOT NULL,
    event_description VARCHAR(400) NOT NULL,
    event_people_limit integer NOT NULL,
    event_day VARCHAR(10) NOT NULL
)

CREATE TABLE user_event (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    event_date DATE NOT NULL,
    event_id integer not null references events(id),
    paid BOOLEAN not null default false,
    receipt varchar(100) default null
)

CREATE TABLE ladder_matches (
    id SERIAL PRIMARY KEY,
    player_1 VARCHAR(30) NOT NULL,
    player_2 VARCHAR(30) NOT NULL,
    match_date timestamp NOT NULL,
    player_1_games integer ,
    player_2_games integer ,
    player_1_paid BOOLEAN not null DEFAULT FALSE,
    player_2_paid BOOLEAN not null DEFAULT FALSE
) 

CREATE TABLE ladder_ranks ()