-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_review" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "contact_number" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "product_name" TEXT,
    "user_name" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_contact_number_idx" ON "Review"("contact_number");

-- CreateIndex
CREATE INDEX "Review_created_at_idx" ON "Review"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_contact_number_key" ON "Conversation"("contact_number");
