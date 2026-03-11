-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('Easy', 'Medium', 'Hard', 'Expert');

-- CreateTable
CREATE TABLE "roleplays" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "session_id" TEXT,
    "user_id" TEXT NOT NULL,
    "scenario_id" TEXT,
    "score" INTEGER,
    "coach_notes" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roleplays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roleplay_scenarios" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "scenario" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "duration_min" INTEGER NOT NULL DEFAULT 15,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roleplays_tenant_id_user_id_idx" ON "roleplays"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "roleplay_scenarios_tenant_id_idx" ON "roleplay_scenarios"("tenant_id");

-- AddForeignKey
ALTER TABLE "roleplays" ADD CONSTRAINT "roleplays_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplays" ADD CONSTRAINT "roleplays_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roleplays" ADD CONSTRAINT "roleplays_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "roleplay_scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
