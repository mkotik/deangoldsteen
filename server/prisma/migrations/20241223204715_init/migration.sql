-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('singular', 'recurring');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT,
    "venue" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "frequency" TEXT,
    "cost" TEXT,
    "info" TEXT,
    "email" TEXT,
    "link" TEXT,
    "phone" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "event_type" "EventType" NOT NULL,
    "recurrence_rule" TEXT,
    "recurrence_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "eventId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
