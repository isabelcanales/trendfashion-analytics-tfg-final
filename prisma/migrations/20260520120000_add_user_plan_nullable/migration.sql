-- Add nullable plan column: null means Basic
ALTER TABLE "users"
ADD COLUMN "plan" TEXT;

-- Migrate legacy subscription values to new plan model
UPDATE "users"
SET "plan" = CASE
  WHEN "subscription" = 'pro' THEN 'pro'
  WHEN "subscription" IN ('premium', 'enterprise') THEN 'premium'
  ELSE NULL
END;

-- Remove deprecated subscription column
ALTER TABLE "users"
DROP COLUMN "subscription";
