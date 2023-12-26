/*
  Warnings:

  - Added the required column `secretAnswer` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretQuestion` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "secretAnswer" VARCHAR(100) NOT NULL,
ADD COLUMN     "secretQuestion" VARCHAR(200) NOT NULL;
