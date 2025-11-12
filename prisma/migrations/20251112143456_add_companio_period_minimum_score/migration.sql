-- CreateTable
CREATE TABLE "companio_period_minimum_score" (
    "id" UUID NOT NULL,
    "companio_id" TEXT NOT NULL,
    "nightmare_period_id" UUID NOT NULL,
    "minimum_score" INTEGER NOT NULL,

    CONSTRAINT "companio_period_minimum_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companio_period_minimum_score_nightmare_period_id_idx" ON "companio_period_minimum_score"("nightmare_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "companio_period_minimum_score_companio_id_nightmare_period__key" ON "companio_period_minimum_score"("companio_id", "nightmare_period_id");

-- AddForeignKey
ALTER TABLE "companio_period_minimum_score" ADD CONSTRAINT "companio_period_minimum_score_companio_id_fkey" FOREIGN KEY ("companio_id") REFERENCES "companio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companio_period_minimum_score" ADD CONSTRAINT "companio_period_minimum_score_nightmare_period_id_fkey" FOREIGN KEY ("nightmare_period_id") REFERENCES "nightmare_gateway_period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
