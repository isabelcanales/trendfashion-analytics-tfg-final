-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relevanceScore" REAL NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'Custom',
    "isMocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "events_month_idx" ON "events"("month");

-- CreateIndex
CREATE INDEX "events_year_idx" ON "events"("year");
