-- setup tables 
create table users(userId bigint auto_increment primary key, username varchar(30) not null, name varchar(30) not null);
create table auth(userId bigint primary key, salt binary(29) not null, hash varbinary(60) not null);
create table todos(postId bigint auto_increment primary key, userId bigint NOT NULL, content varchar(200) not null, dateUpdated BIGINT not NULL, done bit DEFAULT 0);
CREATE TABLE sessions(userId bigint PRIMARY KEY, sessionId char(36) NOT NULL);

-- procedures
CREATE PROCEDURE `todo_schema`.`createUser`(IN p_username varchar(30), IN p_name varchar(30), IN p_salt BINARY(29), IN p_hash BINARY(60))
BEGIN
	DECLARE usernameCount INT;

	-- Check if the username already exists
	SELECT COUNT(*) INTO usernameCount FROM users WHERE username = p_username;

	IF usernameCount > 0 THEN
		-- Username already exists, raise an error
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists';
	ELSE
		-- Username doesn't exist, proceed with insertion
		INSERT INTO users(username, name) VALUES(p_username, p_name);
		SET @lastId = LAST_INSERT_ID(); 
		INSERT INTO auth(userId, salt, hash) VALUES(@lastId, p_salt, p_hash);

		CALL getFullUser(@lastId);
	END IF;
END


--

CREATE PROCEDURE `todo_schema`.`getFullUser`(IN userId INT)
BEGIN
	
	SELECT JSON_ARRAYAGG(JSON_OBJECT(
		'userId', userId,
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

CREATE PROCEDURE `todo_schema`.`getTodo`(IN userId BIGINT, IN postId BIGINT)
BEGIN
	
	IF postId IS NULL THEN
		SELECT JSON_ARRAYAGG(JSON_OBJECT(
			'postId', t.postId,
			'userId', t.userId,
			'content', t.content,
			'dateUpdated', t.dateUpdated,
			'done', t.done
		)) FROM todos t WHERE t.userId = userId
		ORDER BY t.dateUpdated DESC;
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

CREATE PROCEDURE `todo_schema`.`createSession`(IN userId BIGINT, IN sessionId CHAR(36))
BEGIN
	
-- 	only 1 session at a time (no multiple devices logged in)
	DELETE FROM sessions s WHERE s.userId = userId;
	INSERT INTO sessions(userId, sessionId) values(userId, sessionId);
	SELECT JSON_OBJECT(
		'userId', u.userId,
		'username', u.username,
		'name', u.name
	) FROM users u WHERE u.userId = userId;
	
END

--

CREATE PROCEDURE todo_schema.getUserBySessionId(IN sessionId VARCHAR(36))
BEGIN
	
	SELECT JSON_OBJECT(
		'userId', u.userId,
		'name', u.name,
		'username', u.username
	) FROM sessions s INNER JOIN users u ON s.userId = u.userId 
	WHERE s.sessionId = sessionId;
	
END

--

CREATE PROCEDURE todo_schema.createTodo(IN userId BIGINT, IN content VARCHAR(200), IN dateUpdated BIGINT)
BEGIN
	
	INSERT INTO todos(userId, content, dateUpdated, done) VALUES(userid, content, dateUpdated, 0);
	SET @msg = 'success';
	SELECT @msg;
	
END

--

CREATE PROCEDURE `todo_schema`.`deleteTodo`(IN postId BIGINT, IN userId BIGINT)
BEGIN
	
	DELETE FROM todos t WHERE t.postId = postId AND t.userId = userId;
	SET @msg = 'Todo deleted successfully';
	SELECT @msg;
	
END

--

CREATE PROCEDURE todo_schema.updateTodo(IN postId BIGINT, IN userId BIGINT, IN content VARCHAR(200), IN dateUpdated BIGINT, IN done BIT)
BEGIN
	
	UPDATE todos t 
	SET t.content = content, t.dateUpdated = dateUpdated, t.done = done
	WHERE t.postId = postid AND t.userId = userId;

	SET @msg = 'Updated successfully';
	SELECT @msg;
	
END