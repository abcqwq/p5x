-- CreateTable
CREATE TABLE "companio" (
    "id" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "companio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "discord_username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "companio_id" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nightmare_gateway_period" (
    "id" UUID NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "first_half_boss_name" TEXT NOT NULL,
    "first_half_boss_avatar_url" TEXT NOT NULL,
    "second_half_boss_name" TEXT NOT NULL,
    "second_half_boss_avatar_url" TEXT NOT NULL,

    CONSTRAINT "nightmare_gateway_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nightmare_gateway_score" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "nightmare_id" UUID NOT NULL,
    "first_half_score" INTEGER NOT NULL,
    "second_half_score" INTEGER NOT NULL,

    CONSTRAINT "nightmare_gateway_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_discord_username_key" ON "user"("discord_username");

-- CreateIndex
CREATE INDEX "nightmare_gateway_period_end_idx" ON "nightmare_gateway_period"("end" DESC);

-- CreateIndex
CREATE INDEX "nightmare_gateway_score_user_id_nightmare_id_idx" ON "nightmare_gateway_score"("user_id", "nightmare_id");

-- CreateIndex
CREATE INDEX "nightmare_gateway_score_nightmare_id_idx" ON "nightmare_gateway_score"("nightmare_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companio_id_fkey" FOREIGN KEY ("companio_id") REFERENCES "companio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nightmare_gateway_score" ADD CONSTRAINT "nightmare_gateway_score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nightmare_gateway_score" ADD CONSTRAINT "nightmare_gateway_score_nightmare_id_fkey" FOREIGN KEY ("nightmare_id") REFERENCES "nightmare_gateway_period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
