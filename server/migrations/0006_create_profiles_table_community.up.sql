-- File: 0006_create_profiles_table_community.up.sql
-- Description: Create the users profile table and grant permissions on the table.

SET search_path TO community, public;
DROP TABLE IF EXISTS profiles cascade;
CREATE TABLE profiles
(
    id            uuid REFERENCES auth.users ON UPDATE CASCADE ON DELETE CASCADE NOT NULL PRIMARY KEY,
    updated_at    TIMESTAMP WITH TIME ZONE                                       NOT NULL DEFAULT NOW(),
    username      VARCHAR(50)                                                    NULL,
    full_name     VARCHAR(200)                                                   NULL,
    avatar_url    BYTEA                                                          NULL,
    email_address VARCHAR(250)                                                   NOT NULL UNIQUE,
    phone_number  VARCHAR(250)                                                   NULL,
    about_me      VARCHAR(250)                                                   NULL,
    appearance    BOOLEAN                                                                 DEFAULT FALSE,
    grid_view     BOOLEAN                                                                 DEFAULT FALSE,
    onlineStatus  BOOLEAN                                                                 DEFAULT FALSE,
    role          VARCHAR(10)                                                             DEFAULT 'USER'
        CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

ALTER TABLE community.profiles
    OWNER TO community_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON community.profiles TO community_public;
GRANT SELECT, INSERT, UPDATE, DELETE ON community.profiles TO community_test;
GRANT ALL PRIVILEGES ON TABLE community.profiles TO community_admin;

drop function if exists community.handle_new_user() cascade;
create function community.handle_new_user()
    returns trigger as
$$
begin
    insert into community.profiles (id, email_address, phone_number)
    values (new.id, new.email, new.phone);
    return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
execute procedure community.handle_new_user();