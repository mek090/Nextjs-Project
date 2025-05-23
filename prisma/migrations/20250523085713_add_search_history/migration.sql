-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
