/*
  Warnings:

  - You are about to drop the column `text` on the `Example` table. All the data in the column will be lost.
  - Added the required column `content` to the `Example` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpt` to the `Example` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Example` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Example" DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "gpt" TEXT NOT NULL,
ADD COLUMN     "type" "MessageType" NOT NULL;
