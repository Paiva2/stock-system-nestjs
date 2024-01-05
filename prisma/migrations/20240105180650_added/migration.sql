/*
  Warnings:

  - You are about to alter the column `userAttatchmentsId` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Made the column `userAttatchmentsId` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userAttatchmentsId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "userAttatchmentsId" SET NOT NULL,
ALTER COLUMN "userAttatchmentsId" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userAttatchmentsId_fkey" FOREIGN KEY ("userAttatchmentsId") REFERENCES "user_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
