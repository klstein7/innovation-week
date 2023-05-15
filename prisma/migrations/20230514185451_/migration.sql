-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'TABLE', 'CHART');

-- AlterEnum
ALTER TYPE "MessageRole" ADD VALUE 'CHART';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

-- DropEnum
DROP TYPE "Role";
