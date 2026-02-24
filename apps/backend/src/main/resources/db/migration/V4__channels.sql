CREATE TABLE "channels" (
    "channelId"  TEXT         NOT NULL,
    "orgId"      TEXT         NOT NULL,
    "type"       VARCHAR(10)  NOT NULL,
    "name"       VARCHAR(50),
    "createdBy"  TEXT,
    "createdAt"  TIMESTAMPTZ  NOT NULL,
    "updatedAt"  TIMESTAMPTZ  NOT NULL,
    "deletedAt"  TIMESTAMPTZ,
    CONSTRAINT "pk_channels" PRIMARY KEY ("channelId"),
    CONSTRAINT "fk_channels_org" FOREIGN KEY ("orgId") REFERENCES "orgs" ("orgId")
);

CREATE TABLE "channel_members" (
    "channelMemberId"   TEXT         NOT NULL,
    "channelId"         TEXT         NOT NULL,
    "userId"            TEXT         NOT NULL,
    "lastReadMessageId" TEXT,
    "createdAt"         TIMESTAMPTZ  NOT NULL,
    "deletedAt"         TIMESTAMPTZ,
    CONSTRAINT "pk_channel_members" PRIMARY KEY ("channelMemberId"),
    CONSTRAINT "fk_channel_members_channel" FOREIGN KEY ("channelId") REFERENCES "channels" ("channelId"),
    CONSTRAINT "fk_channel_members_user" FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);

-- 대화방당 활성 멤버는 유저 1명만
CREATE UNIQUE INDEX "uk_channel_members_active" ON "channel_members" ("channelId", "userId") WHERE "deletedAt" IS NULL;
