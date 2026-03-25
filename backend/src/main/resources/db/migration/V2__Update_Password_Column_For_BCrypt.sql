-- Migration to update password column for BCrypt hashing
-- BCrypt hashes are 60 characters long, so we need to ensure the column can accommodate them

-- Update password column to handle BCrypt hashes (60 characters)
ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(60);

-- Add comment to document the change
COMMENT ON COLUMN users.password IS 'BCrypt hashed password (60 characters)';