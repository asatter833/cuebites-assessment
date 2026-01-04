/*
  Warnings:

  - Made the column `nationality` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "dob" DATETIME,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "job_title" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "is_favourite" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT DEFAULT 'active'
);
INSERT INTO "new_staff" ("address", "dob", "email", "full_name", "gender", "id", "is_active", "is_favourite", "job_title", "nationality", "phone", "status") SELECT "address", "dob", "email", "full_name", "gender", "id", "is_active", "is_favourite", "job_title", "nationality", "phone", "status" FROM "staff";
DROP TABLE "staff";
ALTER TABLE "new_staff" RENAME TO "staff";
CREATE UNIQUE INDEX "staff_phone_key" ON "staff"("phone");
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
