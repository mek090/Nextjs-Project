-- AlterTable
ALTER TABLE "Location" ADD COLUMN "googlePlaceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Location_googlePlaceId_key" ON "Location"("googlePlaceId"); 