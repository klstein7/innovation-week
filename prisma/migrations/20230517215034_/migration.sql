/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `borrowerId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_businessPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_businessPartnerId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "borrowerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Party";

-- DropEnum
DROP TYPE "PartyType";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "BusinessPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
