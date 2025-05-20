/*
  Warnings:

  - You are about to drop the `LocationImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LocationImage" DROP CONSTRAINT "LocationImage_locationId_fkey";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "price" SET DEFAULT '0',
ALTER COLUMN "price" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "LocationImage";
