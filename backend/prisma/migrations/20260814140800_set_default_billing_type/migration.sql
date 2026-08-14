-- Set default billingType for existing services
UPDATE "Service" SET "billingType" = 'monthly' WHERE "billingType" IS NULL;
