-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "stockName" VARCHAR(100) NOT NULL,
    "stockOwner" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_stockOwner_fkey" FOREIGN KEY ("stockOwner") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
