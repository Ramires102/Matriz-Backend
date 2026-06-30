-- CreateEnum
CREATE TYPE "Type" AS ENUM ('GROUP', 'CHAT');

-- CreateEnum
CREATE TYPE "ContratsPayState" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'REJECTED');

-- CreateEnum
CREATE TYPE "GuestsPayState" AS ENUM ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'PROCESSING', 'REJECTED');

-- CreateEnum
CREATE TYPE "PayType" AS ENUM ('PER_HOUR', 'PER_SERVICE', 'PER_PERSON', 'PER_UNIT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ResType" AS ENUM ('HOME', 'NO_HOME', 'CLOUDE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CONSUMER', 'ORGANIZATOR', 'OFFERER');

-- CreateTable
CREATE TABLE "Avilability" (
    "id" SERIAL NOT NULL,
    "serviceFK" INTEGER NOT NULL,
    "initDate" TIMESTAMP(0) NOT NULL,
    "endDate" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Avilability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMembers" (
    "id" SERIAL NOT NULL,
    "chatFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "isAdmin" BOOLEAN,

    CONSTRAINT "ChatMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://undefined.com',
    "type" "Type" NOT NULL DEFAULT 'CHAT',
    "addMembers" BOOLEAN NOT NULL DEFAULT true,
    "sendMessages" BOOLEAN NOT NULL DEFAULT true,
    "approveNewMembers" BOOLEAN NOT NULL DEFAULT false,
    "eventId" INTEGER NOT NULL,
    "destroyAfterEvent" BOOLEAN NOT NULL DEFAULT true,
    "membersAmount" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "id" SERIAL NOT NULL,
    "commentFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "postFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrats" (
    "id" SERIAL NOT NULL,
    "eventFK" INTEGER NOT NULL,
    "serviceFK" INTEGER NOT NULL,
    "paymentState" "ContratsPayState" NOT NULL,

    CONSTRAINT "Contrats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRating" (
    "id" SERIAL NOT NULL,
    "rate" INTEGER NOT NULL,
    "eventFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,

    CONSTRAINT "EventRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "userFK" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL DEFAULT 'https://undefined.com',
    "initDate" TIMESTAMP NOT NULL,
    "endingDate" TIMESTAMP,
    "location" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false,
    "categoryFK" INTEGER NOT NULL,
    "ticketPrice" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT -1,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guests" (
    "id" SERIAL NOT NULL,
    "eventFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "paymentState" "GuestsPayState" NOT NULL DEFAULT 'NOT_REQUIRED',

    CONSTRAINT "Guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "chatFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "reactions" JSONB NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(0) NOT NULL,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsAnalytics" (
    "id" SERIAL NOT NULL,
    "postFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "dwellTime" INTEGER NOT NULL,
    "completionRate" INTEGER NOT NULL,
    "notInterested" BOOLEAN NOT NULL DEFAULT false,
    "finalRate" INTEGER NOT NULL,

    CONSTRAINT "PostsAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "userFK" INTEGER NOT NULL,
    "text" TEXT,
    "media" JSONB,
    "ubication" TEXT,
    "isAdd" BOOLEAN NOT NULL DEFAULT false,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "sharesCount" INTEGER NOT NULL DEFAULT 0,
    "favouritesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "restrictedComments" BOOLEAN NOT NULL DEFAULT false,
    "sourceIp" TEXT NOT NULL,
    "eventFK" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "interactions" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reactions" (
    "id" SERIAL NOT NULL,
    "messagesFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,
    "emoji" CHAR(1) NOT NULL,

    CONSTRAINT "Reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seens" (
    "id" SERIAL NOT NULL,
    "userFK" INTEGER NOT NULL,
    "messageFK" INTEGER NOT NULL,

    CONSTRAINT "Seens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRating" (
    "id" SERIAL NOT NULL,
    "rate" INTEGER NOT NULL,
    "serviceFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,

    CONSTRAINT "ServiceRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "userFK" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ubication" TEXT,
    "sourceUbication" TEXT,
    "categoryFK" INTEGER NOT NULL,
    "coberRadius" INTEGER NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "paymentType" "PayType" NOT NULL,
    "receptionType" "ResType" NOT NULL,
    "details" JSONB,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagged" (
    "id" SERIAL NOT NULL,
    "postFK" INTEGER NOT NULL,
    "userFK" INTEGER NOT NULL,

    CONSTRAINT "Tagged_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CONSUMER',
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT 'https://undefined.com',
    "dni" TEXT,
    "cuit" TEXT,
    "address" TEXT,
    "serviceFK" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avilability_serviceFK_initDate_key" ON "Avilability"("serviceFK", "initDate");

-- CreateIndex
CREATE UNIQUE INDEX "Avilability_serviceFK_endDate_key" ON "Avilability"("serviceFK", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMembers_chatFK_userFK_key" ON "ChatMembers"("chatFK", "userFK");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategories_name_key" ON "EventCategories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventRating_eventFK_userFK_key" ON "EventRating"("eventFK", "userFK");

-- CreateIndex
CREATE UNIQUE INDEX "Guests_eventFK_userFK_key" ON "Guests"("eventFK", "userFK");

-- CreateIndex
CREATE UNIQUE INDEX "Seens_userFK_messageFK_key" ON "Seens"("userFK", "messageFK");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRating_serviceFK_userFK_key" ON "ServiceRating"("serviceFK", "userFK");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategories_name_key" ON "ServiceCategories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_cuit_key" ON "User"("cuit");

-- AddForeignKey
ALTER TABLE "Avilability" ADD CONSTRAINT "Avilability_serviceFK_fkey" FOREIGN KEY ("serviceFK") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMembers" ADD CONSTRAINT "ChatMembers_chatFK_fkey" FOREIGN KEY ("chatFK") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMembers" ADD CONSTRAINT "ChatMembers_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_commentFK_fkey" FOREIGN KEY ("commentFK") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postFK_fkey" FOREIGN KEY ("postFK") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrats" ADD CONSTRAINT "Contrats_eventFK_fkey" FOREIGN KEY ("eventFK") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrats" ADD CONSTRAINT "Contrats_serviceFK_fkey" FOREIGN KEY ("serviceFK") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRating" ADD CONSTRAINT "EventRating_eventFK_fkey" FOREIGN KEY ("eventFK") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRating" ADD CONSTRAINT "EventRating_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_categoryFK_fkey" FOREIGN KEY ("categoryFK") REFERENCES "EventCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guests" ADD CONSTRAINT "Guests_eventFK_fkey" FOREIGN KEY ("eventFK") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guests" ADD CONSTRAINT "Guests_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatFK_fkey" FOREIGN KEY ("chatFK") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsAnalytics" ADD CONSTRAINT "PostsAnalytics_postFK_fkey" FOREIGN KEY ("postFK") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsAnalytics" ADD CONSTRAINT "PostsAnalytics_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_eventFK_fkey" FOREIGN KEY ("eventFK") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reactions" ADD CONSTRAINT "Reactions_messagesFK_fkey" FOREIGN KEY ("messagesFK") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reactions" ADD CONSTRAINT "Reactions_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seens" ADD CONSTRAINT "Seens_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seens" ADD CONSTRAINT "Seens_messageFK_fkey" FOREIGN KEY ("messageFK") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRating" ADD CONSTRAINT "ServiceRating_serviceFK_fkey" FOREIGN KEY ("serviceFK") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRating" ADD CONSTRAINT "ServiceRating_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_categoryFK_fkey" FOREIGN KEY ("categoryFK") REFERENCES "ServiceCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagged" ADD CONSTRAINT "Tagged_postFK_fkey" FOREIGN KEY ("postFK") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagged" ADD CONSTRAINT "Tagged_userFK_fkey" FOREIGN KEY ("userFK") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
