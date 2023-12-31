
SET SEARCH_PATH TO community, auth;

-- AUTHENTICATION --
INSERT INTO auth.users(email, role, encrypted_password) values ('test@gmail.com', 'TESTER', '$2a$08$z3ncDl2TrGl8iaC3pUuYPO8Td3gR5cJTgV5x8Q6Fu73uwMNiKZsIW');

-- ADD EVENTS SQL TEST DATA --

INSERT INTO community.projects(title, description, cause, project_type, max_attendees, attendees, required_total_man_hours, deactivated, start_date, created_by, updated_by, sharable_groups)
values (
'SCFT Inventory List',
'South Carolina Football Team Inventory List',
'Community Cause ',
'Test Project Type',
100,
array [(select id from profiles p2 limit 1)::UUID],
250,
false,
now(),
(select id from community.community.profiles p limit 1),
(select id from community.community.profiles p limit 1),
array [(select id from profiles p2 limit 1)::UUID]
);


INSERT INTO community.projects(title, description, cause, project_type, max_attendees, attendees, required_total_man_hours, deactivated, start_date, created_by, updated_by, sharable_groups)
values (
'North Carolina Football Team',
'North Carolina football team',
'Environment Development',
'Test Project Type',
100,
array [(select id from profiles p2 limit 1)::UUID],
250,
false,
now(),
(select id from community.community.profiles p limit 1),
(select id from community.community.profiles p limit 1),
array [(select id from profiles p2 limit 1)::UUID]
);

-- since this is deactivated by default, you will not be able to see this event --
INSERT INTO community.projects(title, description, cause, project_type, max_attendees, attendees, required_total_man_hours, deactivated, start_date, created_by, updated_by, sharable_groups)
values (
'Worthington Football Team',
'Worthington Football Team',
'Community Cause',
'Community Development',
100,
array [(select id from profiles p2 limit 1)::UUID],
250,
true,
now(),
(select id from community.community.profiles p limit 1),
(select id from community.community.profiles p limit 1),
array [(select id from profiles p2 limit 1)::UUID]
);


-- ADD PROJECT SKILLS TO PROJECT TEST DATA --

INSERT INTO community.project_skills(project_id, skill, created_by, updated_by)
VALUES ((SELECT id FROM community.projects LIMIT 1),
        'Project Management',
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1));

INSERT INTO community.project_skills(project_id, skill, created_by, updated_by)
VALUES ((SELECT id FROM community.projects LIMIT 1),
        'Receptionist',
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1));

INSERT INTO community.project_skills(project_id, skill, created_by, updated_by)
VALUES ((SELECT id FROM community.projects LIMIT 1),
        'Electrician',
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1));


-- ADD VOLUNTEERING HOURS TO PROJECT TEST DATA --

INSERT INTO community.projects_volunteer(user_id, project_id, project_skills_id, volunteer_hours, created_at,
                                         updated_at, created_by, updated_by, sharable_groups)
VALUES ((SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.projects LIMIT 1),
        (SELECT id FROM community.project_skills LIMIT 1),
        1,
        now(),
        now(),
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1),
        ARRAY [(select id from community.profiles p2 limit 1)::UUID]
        );

INSERT INTO community.projects_volunteer(user_id, project_id, project_skills_id, volunteer_hours, created_at,
                                         updated_at, created_by, updated_by, sharable_groups)
VALUES ((SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.projects LIMIT 1),
        (SELECT id FROM community.project_skills LIMIT 1),
        3,
        now(),
        now(),
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1),
        ARRAY [(select id from community.profiles p2 limit 1)::UUID]
        );

INSERT INTO community.projects_volunteer(user_id, project_id, project_skills_id, volunteer_hours, created_at,
                                         updated_at, created_by, updated_by, sharable_groups)
VALUES ((SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.projects LIMIT 1),
        (SELECT id FROM community.project_skills LIMIT 1),
        4,
        now(),
        now(),
        (SELECT id FROM community.profiles LIMIT 1),
        (SELECT id FROM community.profiles LIMIT 1),
        ARRAY [(select id from community.profiles p2 limit 1)::UUID]
        );


-- ADD ITEM SQL TEST DATA ---

INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by) 
VALUES (
    (SELECT id FROM community.projects LIMIT 1),
    (SELECT id FROM community.storage_locations LIMIT 1),
    'Kitchen Knife',
    1,
    'Walmart',
    'Large kitchen knife to slice meat for dog food',
    (SELECT id FROM community.profiles p LIMIT 1),
    (SELECT id FROM community.profiles p LIMIT 1)
);

INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by) 
VALUES (
    (SELECT id FROM community.projects LIMIT 1),
    (SELECT id FROM community.storage_locations LIMIT 1),
    'Kitchen Cutting Board',
    01,
    'Walmart',
    'Large kitchen board to support knife action',
    (SELECT id FROM community.profiles p LIMIT 1),
    (SELECT id FROM community.profiles p LIMIT 1)
);

INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by) 
VALUES (
    (SELECT id FROM community.projects LIMIT 1),
    (SELECT id FROM community.storage_locations LIMIT 1),
    'Momo Cooking Utensils',
    04,
    'Indian Store',
    'Large Cooking Set from indian store',
    (SELECT id FROM community.profiles p LIMIT 1),
    (SELECT id FROM community.profiles p LIMIT 1)
);

INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by) 
VALUES (
    (SELECT id FROM community.projects LIMIT 1),
    (SELECT id FROM community.storage_locations LIMIT 1),
    'Costco Air Fryer',
    01,
    'Walmart',
    'Ninja Air Fryer from Costco',
    (SELECT id FROM community.profiles p LIMIT 1),
    (SELECT id FROM community.profiles p LIMIT 1)
);

INSERT INTO community.items (project_id, storage_location_id, item_detail, quantity, bought_at, item_description, created_by, updated_by) 
VALUES (
    (SELECT id FROM community.projects LIMIT 1),
    (SELECT id FROM community.storage_locations LIMIT 1),
    'Costco Milk and Shake',
    01,
    'Costco',
    'Shaking jar from costco',
    (SELECT id FROM community.profiles p LIMIT 1),
    (SELECT id FROM community.profiles p LIMIT 1)
);

