/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'OWNER');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "creatorId";

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
