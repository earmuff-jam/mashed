
-- File: 0017_update_oauth_table_community.up.sql
-- Description: Update auth.oauth table to store userAgent from user

SET search_path TO auth, public;

ALTER TABLE auth.oauth
ADD COLUMN user_agent TEXT;
