CREATE TABLE "messages" (
    "messageId"       TEXT         NOT NULL,
    "channelId"       TEXT         NOT NULL,
    "senderId"        TEXT         NOT NULL,
    "content"         TEXT         NOT NULL,
    "createdAt"       TIMESTAMPTZ  NOT NULL,
    "updatedAt"       TIMESTAMPTZ  NOT NULL,
    "deletedAt"       TIMESTAMPTZ,
    CONSTRAINT "pk_messages" PRIMARY KEY ("messageId")
);

CREATE INDEX "idx_messages_channel_created" ON "messages" ("channelId", "createdAt" DESC) WHERE "deletedAt" IS NULL;
