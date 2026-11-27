CREATE TABLE "SiteDailyStat" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SiteDailyStat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteDailyStat_day_path_key" ON "SiteDailyStat"("day", "path");
CREATE INDEX "SiteDailyStat_day_idx" ON "SiteDailyStat"("day");

CREATE TABLE "SiteVisitorDay" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "ipHash" TEXT,
    CONSTRAINT "SiteVisitorDay_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteVisitorDay_day_visitorHash_key" ON "SiteVisitorDay"("day", "visitorHash");
CREATE INDEX "SiteVisitorDay_day_idx" ON "SiteVisitorDay"("day");

CREATE TABLE "SiteTrafficDay" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "source" TEXT NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SiteTrafficDay_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteTrafficDay_day_source_key" ON "SiteTrafficDay"("day", "source");
CREATE INDEX "SiteTrafficDay_day_idx" ON "SiteTrafficDay"("day");

CREATE TABLE "SiteClickStat" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SiteClickStat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteClickStat_day_path_target_key" ON "SiteClickStat"("day", "path", "target");
CREATE INDEX "SiteClickStat_day_idx" ON "SiteClickStat"("day");
