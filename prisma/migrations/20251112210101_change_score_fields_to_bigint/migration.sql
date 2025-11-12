-- AlterTable
ALTER TABLE "companio_period_minimum_score" ALTER COLUMN "minimum_score" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "nightmare_gateway_score" ALTER COLUMN "first_half_score" SET DATA TYPE BIGINT,
ALTER COLUMN "second_half_score" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "nightmare_gateway_score_snapshot" ALTER COLUMN "first_half_score" SET DATA TYPE BIGINT,
ALTER COLUMN "second_half_score" SET DATA TYPE BIGINT,
ALTER COLUMN "total_score" SET DATA TYPE BIGINT;
