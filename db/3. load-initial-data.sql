-- initial data for users
INSERT INTO users (
    first_name,
    last_name,
    email,
    password
	
)
VALUES
    (
        'John',
        'Smith',
        'john.smith@gmail.com',
        '123456789'
    ),
    (
        'Jane',
        'Smith',
        'jane.smith@gmail.com',
        '123456789'
    ),
    (
        'Alex',
        'Smith',
        'alex.smith@gmail.com',
        '123456789'
    );

-- initial data for messages
INSERT INTO messages(
    from_user_id,
    for_user_id,
    message
    )
VALUES
    ('4afe8960-caba-11eb-9e27-6c4008c02622',
    '053f68c0-c9f4-11eb-ab28-6c4008c02622',
    'message1'),

    ('4afe8960-caba-11eb-9e27-6c4008c02622',
    '053f68c0-c9f4-11eb-ab28-6c4008c02622',
    'message2');
	  