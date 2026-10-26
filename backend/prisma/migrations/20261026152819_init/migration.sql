-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('Estudos', 'Trabalho', 'Pessoal', 'Outros');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" "task_status" NOT NULL DEFAULT 'pending',
    "priority" "task_priority" NOT NULL DEFAULT 'medium',
    "due_date" DATE NOT NULL,
    "category" "task_category" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
