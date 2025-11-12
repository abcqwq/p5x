/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `nightmare_gateway_period` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "nightmare_gateway_period" ADD COLUMN     "is_frozen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "number" SERIAL NOT NULL,
ALTER COLUMN "first_half_boss_type" DROP DEFAULT,
ALTER COLUMN "second_half_boss_type" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "nightmare_gateway_period_number_key" ON "nightmare_gateway_period"("number");
