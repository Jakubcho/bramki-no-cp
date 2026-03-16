/*
  Warnings:

  - You are about to drop the `ActivationEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ActivationEntry";

-- CreateTable
CREATE TABLE "StatsEntry" (
    "id" BIGSERIAL NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "formId" INTEGER,
    "email" TEXT,
    "phone" TEXT,
    "fullName" TEXT,
    "company" TEXT,
    "qrCode" TEXT,
    "qrCodeUrl" TEXT,
    "sourceUrl" TEXT,
    "status" TEXT,
    "userAgent" TEXT,
    "os" TEXT,
    "firstNameActivation" TEXT,
    "lastNameActivation" TEXT,
    "emailActivation" TEXT,
    "phoneActivation" TEXT,
    "streetActivation" TEXT,
    "buildingActivation" TEXT,
    "postalCodeActivation" TEXT,
    "cityActivation" TEXT,
    "countryActivation" TEXT,
    "formData" JSONB,
    "activationForm" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatsEntry_eventSlug_idx" ON "StatsEntry"("eventSlug");

-- CreateIndex
CREATE INDEX "StatsEntry_createdAt_idx" ON "StatsEntry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StatsEntry_eventSlug_entryId_key" ON "StatsEntry"("eventSlug", "entryId");
