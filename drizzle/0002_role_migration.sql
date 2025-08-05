-- Create new enum type
DO $$ BEGIN
  CREATE TYPE "role" AS ENUM('user', 'seller', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new column
ALTER TABLE "users" ADD COLUMN "role" "role" NOT NULL DEFAULT 'user';

-- Copy data from old column to new
UPDATE "users" SET "role" = "user_role"::text::"role";

-- Drop old column
ALTER TABLE "users" DROP COLUMN "user_role";
