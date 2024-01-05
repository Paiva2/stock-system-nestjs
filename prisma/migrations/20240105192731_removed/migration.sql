/*
  Warnings:

  - You are about to drop the column `userAttatchmentsId` on the `stockItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stockItem" DROP CONSTRAINT "stockItem_userAttatchmentsId_fkey";

-- AlterTable
ALTER TABLE "stockItem" DROP COLUMN "userAttatchmentsId";

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "itemName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300),
    "categoryId" VARCHAR(100) NOT NULL,
    "userAttatchmentsId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userAttatchmentsId_fkey" FOREIGN KEY ("userAttatchmentsId") REFERENCES "user_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
