const usersTableQuery = `create table if not exists users (
  id serial primary key,
  first_name varchar(200) not null ,
  last_name varchar(200) not null ,
  other_name varchar(200) not null ,
  password varchar(200) not null ,
  phone_number numeric not null ,
  user_name varchar(200) not null unique ,
  email varchar(200) unique not null ,
  registered timestamp without time zone default now(),
  isAdmin boolean default false
);`;
const meetupsTableQuery = `create table if not exists meetups (
  id serial primary key ,
  created_on timestamp without time zone default now(),
  location varchar(200) not null ,
  topic varchar(200) not null ,
  happening_on timestamp without time zone not null
);`;

const tagsTableQuery = `create table if not exists tags(
  id serial primary key ,
  tag_name varchar(200) unique not null 
);`;

const meetupsTagsTableQuery = `create table if not exists meetups_tags(
  id serial  ,
  meetup_id integer not null ,
  tag_id integer not null ,
  primary key (meetup_id, tag_id),
  foreign key (meetup_id) references meetups(id),
  foreign key (tag_id) references tags(id)
);`;

const questionsTableQuery = `create table if not exists questions(
  id serial primary key ,
  created_by integer not null ,
  meetup integer not null ,
  title varchar(200) not null ,
  body varchar(1000) not null ,
  votes integer not null default 0,
  created_on timestamp without time zone default now(),
  foreign key (created_by) references users(id),
  foreign key (meetup) references meetups(id)
);`;

const commentsTableQuery = `create table if not exists comments (
  id serial primary key ,
  user_id integer not null ,
  question_id integer not null ,
  body varchar(1000) not null ,
  created_on timestamp without time zone default now(),
  foreign key (user_id) references users(id),
  foreign key (question_id) references questions(id)
);`;

const rsvpsTableQuery = `create table if not exists rsvps(
  id serial primary key ,
  user_id integer not null ,
  meetup integer not null ,
  response varchar(200),
  created_on timestamp without time zone default now(),
  foreign key (user_id) references users(id),
  foreign key (meetup) references  meetups(id)
);`;
const adminQuery = `insert into users(
  first_name, 
  last_name, 
  other_name, 
  phone_number, 
  user_name, 
  email, 
  isAdmin,
  password) select $1, $2, $3, $4, $5, $6, true, $7
  where not exists (select * from users) returning *;
`;
const tablesQuery = `create table if not exists users (
  id serial primary key,
  first_name varchar(200) not null ,
  last_name varchar(200) not null ,
  other_name varchar(200) not null ,
  password varchar(200) not null ,
  phone_number numeric not null ,
  user_name varchar(200) not null unique ,
  email varchar(200) unique not null ,
  registered timestamp without time zone default now(),
  isAdmin boolean default false
);

create table if not exists meetups (
  id serial primary key ,
  created_on timestamp without time zone default now(),
  location varchar(200) not null ,
  topic varchar(200) not null ,
  happening_on timestamp without time zone not null
);

create table if not exists tags(
  id serial primary key ,
  tag_name varchar(200) unique not null
);

create table if not exists meetups_tags(
  id serial  ,
  meetup_id integer not null ,
  tag_id integer not null ,
  primary key (meetup_id, tag_id),
  foreign key (meetup_id) references meetups(id) ON DELETE CASCADE,
  foreign key (tag_id) references tags(id)
);

create table if not exists questions(
  id serial primary key ,
  created_by integer not null ,
  meetup integer not null ,
  title varchar(200) not null ,
  body varchar(1000) not null ,
  votes integer not null default 0,
  created_on timestamp without time zone default now(),
  foreign key (created_by) references users(id),
  foreign key (meetup) references meetups(id)
);

create table if not exists comments (
  id serial primary key ,
  user_id integer not null ,
  question_id integer not null ,
  body varchar(1000) not null ,
  created_on timestamp without time zone default now(),
  foreign key (user_id) references users(id),
  foreign key (question_id) references questions(id)
);

create table if not exists rsvps(
  id serial ,
  user_id integer not null ,
  meetup integer not null ,
  response varchar(30),
  created_on timestamp without time zone default now(),
  primary key (user_id, meetup),
  foreign key (user_id) references users(id),
  foreign key (meetup) references  meetups(id)
);`;

export default {
  usersTableQuery,
  meetupsTableQuery,
  tagsTableQuery,
  meetupsTagsTableQuery,
  questionsTableQuery,
  commentsTableQuery,
  rsvpsTableQuery,
  adminQuery,
  tablesQuery,
};
