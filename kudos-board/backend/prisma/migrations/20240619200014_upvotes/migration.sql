/*
  Warnings:

  - Added the required column `upvotes` to the `Boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boards" ADD COLUMN     "upvotes" INTEGER NOT NULL;
