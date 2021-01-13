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
    user_id VARCHAR(100) references users(id),
    registered timestamp NOT NULL,
    event_id integer references events(id),
    paid BOOLEAN not null default false,
    receipt varchar(100) default null,
    enabled BOOLEAN not null DEFAULT true
)


CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    email VARCHAR(100),
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    photo VARCHAR(200),
    role VARCHAR(20) DEFAULT 'customer'
)






/* ladder stuff here */

CREATE TABLE LADDERS (
    id SERIAL PRIMARY KEY,
    name varchar(50) not null,
    description varchar(200)
)

CREATE TABLE LADDER_MATCHES (
    id SERIAL PRIMARY KEY,
    ladder_id integer references ladders(id),
    player_1 VARCHAR(100) references users(id),
    player_2 VARCHAR(100) references users(id),
    challenge_date timestamp not null,
    match_date timestamp default null,
    player_2_games integer default null,
    player_1_games integer default null,
    player_1_paid BOOLEAN DEFAULT FALSE,
    player_2_paid BOOLEAN DEFAULT FALSE, 
    approved BOOLEAN DEFAULT FALSE,
    accepted BOOLEAN DEFAULT FALSE
)

CREATE TABLE LADDER_RANKS (
    id SERIAL PRIMARY KEY,
    ladder_id integer references ladders(id),
    player_id VARCHAR(100) references users(id),
    rank decimal not null,
    recent_change integer default 0
)
