-- DropForeignKey
ALTER TABLE "stock" DROP CONSTRAINT "stock_stockOwner_fkey";

-- CreateTable
CREATE TABLE "stockItem" (
    "id" TEXT NOT NULL,
    "itemName" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stockId" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300),
    "categoryId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_stockOwner_fkey" FOREIGN KEY ("stockOwner") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItem" ADD CONSTRAINT "stockItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItem" ADD CONSTRAINT "stockItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
