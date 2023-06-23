-- setup tables 
create table users(userId bigint auto_increment primary key, username varchar(30) not null, name varchar(30) not null);
create table auth(userId bigint primary key, salt binary(29) not null, hash varbinary(60) not null);
create table todos(postId bigint auto_increment primary key, userId bigint NOT NULL, content varchar(200) not null, dateUpdated int not NULL, done bit DEFAULT 0);
CREATE TABLE sessions(userId bigint PRIMARY KEY, sessionId char(36) NOT NULL);

-- procedures
CREATE PROCEDURE todo_schema.createUser(IN username varchar(30), IN name varchar(30), IN salt BINARY(29), IN hash BINARY(60))
BEGIN
	
	INSERT INTO users(username, name) values(username, name);
	SET @lastId = last_insert_id(); 
	INSERT INTO auth(userId, salt, hash) values(@lastId, salt, hash);

	CALL getFullUser(@lastId);
	
END

--

CREATE PROCEDURE `todo_schema`.`getFullUser`(IN userId INT)
BEGIN
	
	SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'name', name, 
		'username', username, 
		'salt', salt, 
		'hash', hash
		))
		FROM users u INNER JOIN auth a 
		ON u.userId = a.userId 
		WHERE u.userId = userId;
	
END

--

CREATE PROCEDURE `todo_schema`.`getSaltAndHash`(IN username VARCHAR(30))
BEGIN
	
	SELECT userId INTO @id FROM users u WHERE u.username = username;

	IF ROW_COUNT() > 0 THEN
		SELECT 
	-- 		JSON_OBJECT(
	-- 		'salt', salt,
	-- 		'hash', hash
	-- 		)
			a.userId, salt, hash
			FROM auth a WHERE a.userId = @id;
	
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username not found';
	
	END IF;
	
END

--

CREATE PROCEDURE todo_schema.getTodo(IN userId BIGINT, IN postId BIGINT)
BEGIN
	
	IF postId IS NULL THEN
		SELECT JSON_ARRAYAGG(JSON_OBJECT(
			'postId', t.postId,
			'userId', t.userId,
			'content', t.content,
			'dateUpdated', t.dateUpdated,
			'done', t.done
		)) FROM todos t WHERE t.userId = userId;
	ELSE
		SELECT JSON_OBJECT(
			'postId', t.postId,
			'userId', t.userId,
			'content', t.content,
			'dateUpdated', t.dateUpdated,
			'done', t.done
		) FROM todos t WHERE t.postId = postId;
	END IF;
	
END

--

CREATE PROCEDURE todo_schema.createSession(IN userId BIGINT, IN sessionId CHAR(36))
BEGIN
	
-- 	only 1 session at a time (no multiple devices logged in)
	DELETE FROM sessions s WHERE s.userId = userId;
	INSERT INTO sessions(userId, sessionId) values(userId, sessionId);
	SET @msg = 'session created';
	SELECT @msg;
	
END