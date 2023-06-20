-- setup tables 
create table users(userId bigint auto_increment primary key, username varchar(30) not null, name varchar(30) not null);
create table auth(userId bigint primary key, salt binary(29) not null, hash varbinary(60) not null);
create table todos(postId bigint auto_increment primary key, userId bigint NOT NULL, content varchar(200) not null, dateCreated int not NULL, done bit DEFAULT 0);

-- procedures
CREATE PROCEDURE todo_schema.createUser(IN username varchar(30), IN name varchar(30), IN salt BINARY(29), IN hash BINARY(60))
BEGIN
	
	INSERT INTO users(username, name) values(username, name);
	SET @lastId = last_insert_id(); 
	INSERT INTO auth(userId, salt, hash) values(@lastId, salt, hash);

	CALL getFullUser(@lastId);
	
END

--

CREATE PROCEDURE todo_schema.getFullUser(IN userId INT)
BEGIN
	
	SELECT * FROM users u INNER JOIN auth a ON u.userId = a.userId WHERE u.userId = userId;
	
END