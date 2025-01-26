-- 1. Insert a record for Tony Stark
INSERT INTO account 
(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES 
(
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 2. Modify the Tony Stark record to change the account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3. Delete the Tony Stark record from the database
DELETE FROM account
WHERE account_id = 1;

-- 4. Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer' AND inv_description LIKE '%small interiors%';

-- 5. Use an inner join
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- 6. Update file path records
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');