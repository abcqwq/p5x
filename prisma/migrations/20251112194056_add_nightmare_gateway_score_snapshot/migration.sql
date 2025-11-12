-- CreateTable
CREATE TABLE "nightmare_gateway_score_snapshot" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "nightmare_period_id" UUID NOT NULL,
    "discord_username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "companio_id" TEXT NOT NULL,
    "companio_name" TEXT NOT NULL,
    "companio_logo_url" TEXT NOT NULL,
    "first_half_score" INTEGER NOT NULL,
    "second_half_score" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "frozen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nightmare_gateway_score_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nightmare_gateway_score_snapshot_nightmare_period_id_idx" ON "nightmare_gateway_score_snapshot"("nightmare_period_id");

-- CreateIndex
CREATE INDEX "nightmare_gateway_score_snapshot_total_score_idx" ON "nightmare_gateway_score_snapshot"("total_score" DESC);

-- CreateIndex
CREATE INDEX "nightmare_gateway_score_snapshot_first_half_score_idx" ON "nightmare_gateway_score_snapshot"("first_half_score" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "nightmare_gateway_score_snapshot_user_id_nightmare_period_i_key" ON "nightmare_gateway_score_snapshot"("user_id", "nightmare_period_id");

-- AddForeignKey
ALTER TABLE "nightmare_gateway_score_snapshot" ADD CONSTRAINT "nightmare_gateway_score_snapshot_nightmare_period_id_fkey" FOREIGN KEY ("nightmare_period_id") REFERENCES "nightmare_gateway_period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
