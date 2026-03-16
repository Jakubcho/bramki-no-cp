-- CreateTable
CREATE TABLE "ActivationEntry" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "fullName" TEXT,
    "streetAddress" TEXT,
    "houseNumber" TEXT,
    "apartmentNumber" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "domain" TEXT,
    "badge" TEXT,
    "fairYear" TEXT,
    "fairDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivationEntry_entryId_domain_key" ON "ActivationEntry"("entryId", "domain");
