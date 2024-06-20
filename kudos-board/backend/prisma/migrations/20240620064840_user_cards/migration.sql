/*
  Warnings:

  - You are about to drop the column `author` on the `Boards` table. All the data in the column will be lost.
  - Added the required column `authorHandle` to the `Boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boards" DROP COLUMN "author",
ADD COLUMN     "authorHandle" TEXT NOT NULL,
ADD COLUMN     "cardIDs" INTEGER[];

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "gifURL" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "authorHandle" TEXT NOT NULL DEFAULT 'Anonymous',
    "boardID" INTEGER NOT NULL,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_handle_key" ON "Users"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Cards_id_key" ON "Cards"("id");

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_authorHandle_fkey" FOREIGN KEY ("authorHandle") REFERENCES "Users"("handle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_authorHandle_fkey" FOREIGN KEY ("authorHandle") REFERENCES "Users"("handle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_boardID_fkey" FOREIGN KEY ("boardID") REFERENCES "Boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
