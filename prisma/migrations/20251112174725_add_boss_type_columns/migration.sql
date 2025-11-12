-- AlterTable
ALTER TABLE "nightmare_gateway_period" ADD COLUMN     "first_half_boss_type" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "second_half_boss_type" TEXT NOT NULL DEFAULT '';
