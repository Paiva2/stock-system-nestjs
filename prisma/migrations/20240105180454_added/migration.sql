/*
  Warnings:

  - Added the required column `userAttatchmentsId` to the `stockItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userAttatchmentsId" TEXT;

-- AlterTable
ALTER TABLE "stockItem" ADD COLUMN     "userAttatchmentsId" VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE "user_attatchments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_attatchments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_attatchments" ADD CONSTRAINT "user_attatchments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItem" ADD CONSTRAINT "stockItem_userAttatchmentsId_fkey" FOREIGN KEY ("userAttatchmentsId") REFERENCES "user_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userAttatchmentsId_fkey" FOREIGN KEY ("userAttatchmentsId") REFERENCES "user_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
