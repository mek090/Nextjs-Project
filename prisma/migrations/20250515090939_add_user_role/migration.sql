-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
