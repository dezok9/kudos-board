-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "comments" TEXT[],
ALTER COLUMN "authorHandle" SET DEFAULT '@anonymous';
