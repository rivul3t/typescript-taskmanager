-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
