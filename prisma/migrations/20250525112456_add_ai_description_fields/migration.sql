-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "aiDescription" TEXT,
ADD COLUMN     "aiLastUpdated" TIMESTAMP(3),
ADD COLUMN     "aiNearbyLocations" JSONB,
ADD COLUMN     "aiWeatherData" JSONB;
