-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_performerId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
