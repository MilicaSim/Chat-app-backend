-- create user table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SELECT uuid_generate_v1();

CREATE TABLE users(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
	first_name text NOT NULL,
	last_name text NOT NULL,
	email text UNIQUE NOT NULL,
	password text NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	deleted_on timestamp with time zone,
	updated_on timestamp with time zone,
	is_inactive boolean DEFAULT 'f'
)

-- create message table
CREATE TABLE messages(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
	from_user_id uuid,
		CONSTRAINT fk_messages_from_user_id
		FOREIGN KEY (from_user_id) 
		REFERENCES users(id),
	for_user_id uuid,
		CONSTRAINT fk_messages_for_user_id
		FOREIGN KEY (for_user_id) 
		REFERENCES users(id),
	message text NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	deleted_on timestamp with time zone,
	updated_on timestamp with time zone,
	seen_on timestamp with time zone
)

-- create return value for function 'get_user_chats'
CREATE TYPE user_chat AS (first_name text, 
						  last_name text,
						  is_inactive boolean,
						  id text,
						  last_message_on timestamp with time zone,
						  unread_message_count int
						  )
-- crete function 
CREATE FUNCTION get_user_chats (uuid)
 	RETURNS SETOF user_chat
	AS
	$$
	SELECT 
			for_users.first_name
			, for_users.last_name
			, for_users.is_inactive
			, for_users.id
			, last_message_on
			, unread_message_count
		FROM 
		(	SELECT user_2, max(last_message_on) as last_message_on, max (unread_message_count) as unread_message_count
		 	FROM (
				SELECT $1 AS user_1
					, CASE 
						WHEN for_user_id = $1 THEN from_user_id 
						WHEN from_user_id = $1 THEN for_user_id 
					END user_2
					, for_user_id
					, from_user_id
					, max(created_on) as last_message_on
					, count(case when seen_on is NULL and for_user_id = $1 then 1 else null end) as unread_message_count
				FROM messages 
				WHERE for_user_id = $1 OR from_user_id = $1
				group by for_user_id, from_user_id
			 ) a
		 group by user_2
		) pom_view
		 
		INNER JOIN users for_users ON for_users.id = pom_view.user_2
	$$
		
LANGUAGE SQL;
	
SELECT * FROM get_user_chats('39d5f258-de4d-11eb-a575-6c4008c02622')