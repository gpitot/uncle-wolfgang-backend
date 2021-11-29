CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100),
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    photo VARCHAR(200),
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'customer'
    streak integer default 0
    vaccinated BOOLEAN not null DEFAULT FALSE
);



CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id integer references users(id) not null,
    token VARCHAR(100) UNIQUE NOT NULL,
    expiry bigint NOT NULL
)


CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(400) NOT NULL,
    spots integer NOT NULL,
    start bigint NOT NULL,
    open bigint NOT NULL,
    enabled BOOLEAN not null DEFAULT TRUE
);

CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    user_id integer references users(id) not null,
    registered bigint NOT NULL,
    event_id integer references events(id) not null,
    paid BOOLEAN not null default false,
    receipt varchar(100) default null,
    enabled BOOLEAN not null DEFAULT true,
    UNIQUE (user_id, event_id)
);






/* ladder stuff here */

CREATE TABLE LADDERS (
    id SERIAL PRIMARY KEY,
    name varchar(50) not null,
    description varchar(200)
);

CREATE TABLE LADDER_MATCHES (
    id SERIAL PRIMARY KEY,
    ladder_id integer references ladders(id) not null,
    player_1 integer references users(id) not null,
    player_2 integer references users(id) not null,
    challenge_date bigint not null,
    match_date bigint default null,
    player_2_games integer default null,
    player_1_games integer default null,
    player_1_paid BOOLEAN DEFAULT FALSE,
    player_2_paid BOOLEAN DEFAULT FALSE, 
    approved BOOLEAN DEFAULT FALSE,
    accepted BOOLEAN DEFAULT FALSE,
    declined BOOLEAN DEFAULT FALSE
);

CREATE TABLE LADDER_RANKS (
    id SERIAL PRIMARY KEY,
    ladder_id integer references ladders(id) not null,
    user_id integer references users(id) not null,
    rank decimal not null,
    recent_change integer default 0,
    UNIQUE (ladder_id, user_id)
);




-- shop
CREATE TABLE SHOP (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(100),
    image VARCHAR(250),
    category VARCHAR(40),
    price decimal not null,
    discount integer default 0,
    stock integer default 100,
    link VARCHAR(100)
);

CREATE TABLE TRANSACTIONS (
    id SERIAL PRIMARY KEY,
    item integer references SHOP(id) not null,
    user_id integer references users(id) not null,
    purchase_date bigint not null,
    payment_status VARCHAR(20) default 'pending'
);


CREATE TABLE NOTIFICATIONS_SENT (
    id SERIAL PRIMARY KEY,
    user_id integer references users(id) not null,
    message VARCHAR(150),
    notification_date bigint not null
)