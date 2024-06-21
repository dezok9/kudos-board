-- DropForeignKey
ALTER TABLE "Boards" DROP CONSTRAINT "Boards_authorHandle_fkey";

-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_authorHandle_fkey";

-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_boardID_fkey";

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_authorHandle_fkey" FOREIGN KEY ("authorHandle") REFERENCES "Users"("handle") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_authorHandle_fkey" FOREIGN KEY ("authorHandle") REFERENCES "Users"("handle") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_boardID_fkey" FOREIGN KEY ("boardID") REFERENCES "Boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
