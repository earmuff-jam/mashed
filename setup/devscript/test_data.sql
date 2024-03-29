
SET SEARCH_PATH TO community, auth;

-- AUTHENTICATION --
INSERT INTO auth.users(email, role, encrypted_password, birthdate) values ('test@gmail.com', 'TESTER', '$2a$08$DtBpJRoDduzqR/ERz/JvFe2toYO9UhifP/.kmxdeamz0VmWr7kQuW', '2010-01-01');

-- UPDATE PROFILE TABLE WITH USER DETAILS --

UPDATE community.profiles SET 
username = 'native',
full_name = 'Native Plants',
phone_number = '1234567890',
about_me = 'I like to climb trees and hike with my friends'
WHERE email_address = 'test@gmail.com';

-- ADD EVENTS SQL TEST DATA --
INSERT INTO community.projects
    (title, description, street, city, state, zip, lat, lon, cause, project_type, max_attendees, attendees, required_total_man_hours, deactivated, start_date, created_by, updated_by, sharable_groups)
VALUES
    ('SC Go raiders', 'South Carolina Football Team Inventory List', '5 S Mill St', 'Manning', 'SC', '29102', '33.75', '-80.22', 'Community Cause', 'Test Project Type', 100, array[(SELECT id FROM profiles LIMIT 1)::UUID], 250, false, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM profiles LIMIT 1)::UUID]),
    ('North Carolina Football Team', 'North Carolina football team', NULL, NULL, NULL, NULL, '35.12', '-78.22','Environment Development', 'Test Project Type', 100, array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID], 250, false, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID]),
    ('Worthington Football Team', 'Worthington Football Team', NULL, NULL, NULL, NULL, '39.96', '-82.99', 'Community Cause', 'Community Development', 100, array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID], 250, true, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID]),
    ('Austin Zoo Fair Show', 'Austin zoo fair show for children and adults', 'S Congress Ave', 'Austin', 'TX', '78702', '30.26', '-97.74', 'Community Cause', 'Community Development', 100, array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID], 250, false, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID]),
    ('Free knap-in & natural living market!', 'Free knap-in & natural living market!', 'S Liberty St', 'Bastrop', 'TX', '78602', '32.77', '-91.91', 'Community Cause', 'Community Development', 100, array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID], 250, false, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID]),
    ('Sherwood Forest Renfest - Camping and Festival - Spring Break', 'Sherwood Forest Renfest - Camping and Festival - Spring Break', '2100 Barton Springs Road', 'Austin', 'TX', '78704', '30.26', '-97.74', 'Community Cause', 'Community Development', 100, array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID], 250, false, NOW(), (SELECT id FROM community.community.profiles LIMIT 1), (SELECT id FROM community.community.profiles LIMIT 1), array[(SELECT id FROM community.community.profiles LIMIT 1)::UUID]);

-- ADD PROJECT SKILLS TO PROJECT TEST DATA --
INSERT INTO community.project_skills(project_id, skill, created_by, updated_by)
VALUES
    ((SELECT id FROM community.projects LIMIT 1), 'Project Management', (SELECT id FROM community.profiles LIMIT 1), (SELECT id FROM community.profiles LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), 'Receptionist', (SELECT id FROM community.profiles LIMIT 1), (SELECT id FROM community.profiles LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), 'Electrician', (SELECT id FROM community.profiles LIMIT 1), (SELECT id FROM community.profiles LIMIT 1));

-- ADD VOLUNTEERING HOURS TO PROJECT TEST DATA --
INSERT INTO community.projects_volunteer(user_id, project_id, project_skills_id, volunteer_hours, created_at, updated_at, created_by, updated_by, sharable_groups)
VALUES
    ((SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.projects LIMIT 1),
     (SELECT id FROM community.project_skills LIMIT 1),
     1,
     NOW(),
     NOW(),
     (SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.profiles LIMIT 1),
     ARRAY [(SELECT id FROM community.profiles p2 LIMIT 1)::UUID]),
    ((SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.projects LIMIT 1),
     (SELECT id FROM community.project_skills LIMIT 1),
     3,
     NOW(),
     NOW(),
     (SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.profiles LIMIT 1),
     ARRAY [(SELECT id FROM community.profiles p2 LIMIT 1)::UUID]),
    ((SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.projects LIMIT 1),
     (SELECT id FROM community.project_skills LIMIT 1),
     4,
     NOW(),
     NOW(),
     (SELECT id FROM community.profiles LIMIT 1),
     (SELECT id FROM community.profiles LIMIT 1),
     ARRAY [(SELECT id FROM community.profiles p2 LIMIT 1)::UUID]);

-- ADD REPORT SQL TEST DATA --
INSERT INTO community.reports (
	project_id , subject , description , event_location , organizer_name , created_at , created_by , updated_at , updated_by , sharable_groups
) VALUES (
	(SELECT id FROM community.projects LIMIT 1),
	'Test report', 'Testing report by cypress user', 'North Pacific Road',
	'Cypress test user', now(), (SELECT id FROM community.profiles LIMIT 1),
	now(), (SELECT id FROM community.profiles LIMIT 1), 
	ARRAY [(SELECT id FROM community.profiles LIMIT 1)::UUID]);

INSERT INTO community.reports (
	project_id , subject , description , event_location , organizer_name , created_at , created_by , updated_at , updated_by , sharable_groups
) VALUES (
	(SELECT id FROM community.projects LIMIT 1),
	'Test report', 'Testing report by cypress user', 'North Pacific Road',
	'Cypress test user', now(), (SELECT id FROM community.profiles LIMIT 1),
	now(), (SELECT id FROM community.profiles LIMIT 1), 
	ARRAY [(SELECT id FROM community.profiles LIMIT 1)::UUID]);


-- ADD ITEM SQL TEST DATA ---
INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by)
VALUES
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Kitchen Knife', 1, 'Walmart', 'Large kitchen knife to slice meat for dog food', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Kitchen Cutting Board', 1, 'Walmart', 'Large kitchen board to support knife action', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Momo Cooking Utensils', 4, 'Indian Store', 'Large Cooking Set from Indian store', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Costco Air Fryer', 1, 'Walmart', 'Ninja Air Fryer from Costco', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Costco Milk and Shake', 1, 'Costco', 'Shaking jar from Costco', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Vitamin D Jar', 1, 'Costco', 'Adult vitamin jars', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Sour Dough', 1, 'Costco', 'Natural sour dough', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1)),
    ((SELECT id FROM community.projects LIMIT 1), (SELECT id FROM community.storage_locations LIMIT 1), 'Electronics Weight Scale', 1, 'Costco', 'Electronic scale to measure kitchen stuff', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1));


-- EXPENSES SQL TEST DATA ---
INSERT INTO community.expenses (project_id, item_name, item_cost, category_id, purchase_location, notes, created_by, updated_by, sharable_groups)
VALUES
    ((SELECT id FROM community.projects LIMIT 1), 'Catering Services', 500.00, (SELECT id FROM community.category LIMIT 1), 'Local Caterers', 'Food for the event', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Venue Rental', 1000.00, (SELECT id FROM community.category ORDER BY category.item_name DESC LIMIT 1), 'City Hall', 'Renting space for the event', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Decorations', 200.00, (SELECT id FROM community.category ORDER BY category.item_name DESC LIMIT 1), 'Party Supplies Co.', 'Decorations for the event', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Sound System Rental', 300.00, (SELECT id FROM community.category WHERE category.item_name='Electronics' LIMIT 1), 'Audio Solutions', 'Renting sound equipment for the event', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Photography Services', 400.00, (SELECT id FROM community.category WHERE category.item_name='Electronics' LIMIT 1), 'Capture Moments Studio', 'Hiring a photographer for the event', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Transportation', 150.00, (SELECT id FROM community.category WHERE category.item_name='Travel' LIMIT 1), 'City Limos', 'Transportation for guests', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Gifts for Attendees', 250.00, (SELECT id FROM community.category WHERE category.item_name='Clothing' LIMIT 1), 'Gifts R Us', 'Small tokens of appreciation for attendees', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Event Staff Payment', 600.00, (SELECT id FROM community.category LIMIT 1), 'Event Services Agency', 'Payment for event staff', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Promotional Materials', 75.00, (SELECT id FROM community.category WHERE category.item_name='Clothing' LIMIT 1), 'Print Shop', 'Printing flyers and banners', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]),

    ((SELECT id FROM community.projects LIMIT 1), 'Security Services', 350.00, (SELECT id FROM community.category WHERE category.item_name='Gifts/Donations' LIMIT 1), 'Secure Events Co.', 'Hiring security personnel', (SELECT id FROM community.profiles p LIMIT 1), (SELECT id FROM community.profiles p LIMIT 1), ARRAY[(SELECT id FROM community.profiles LIMIT 1)::UUID]);
