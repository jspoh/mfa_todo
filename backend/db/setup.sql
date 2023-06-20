-- setup tables 
create table users(userId bigint auto_increment primary key, username varchar(30) not null, name varchar(30) not null);
create table auth(userId bigint primary key, salt binary(29) not null, hash varbinary(60) not null);
create table todos(postId bigint auto_increment primary key, userId bigint NOT NULL, content varchar(200) not null, dateCreated int not NULL, done bit DEFAULT 0);

SELECT * FROM auth;
SELECT * FROM todos t;
SELECT * FROM users;

-- mistakes were made lol
DROP TABLE todos;

-- for testing
INSERT INTO todos(userId, content, dateCreated) values(1, 'this is a test todo', '1624190400');