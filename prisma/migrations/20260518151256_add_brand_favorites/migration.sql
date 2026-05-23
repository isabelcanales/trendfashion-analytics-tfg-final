-- CreateTable
CREATE TABLE "brand_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "brand_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "brand_favorites_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "brand_favorites_userId_idx" ON "brand_favorites"("userId");

-- CreateIndex
CREATE INDEX "brand_favorites_brandId_idx" ON "brand_favorites"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "brand_favorites_userId_brandId_key" ON "brand_favorites"("userId", "brandId");
