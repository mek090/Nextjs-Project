/*
  Warnings:

  - You are about to drop the column `aiDescription` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `aiLastUpdated` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `aiNearbyLocations` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `aiWeatherData` on the `Location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_profileId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "aiDescription",
DROP COLUMN "aiLastUpdated",
DROP COLUMN "aiNearbyLocations",
DROP COLUMN "aiWeatherData",
ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "image" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
