-- users: 인증/가입용 계정
CREATE TABLE "users" (
    "userId"    TEXT         NOT NULL,
    "uid"       TEXT         NOT NULL,
    "email"     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ  NOT NULL,
    "updatedAt" TIMESTAMPTZ  NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    CONSTRAINT "pk_users" PRIMARY KEY ("userId")
);
CREATE UNIQUE INDEX "uk_users_uid" ON "users" ("uid");

-- profiles: 실제 활동 주체. 기본 프로필(orgId=null) + Org별 프로필
CREATE TABLE "profiles" (
    "profileId"    TEXT         NOT NULL,
    "userId"       TEXT         NOT NULL,
    "orgId"        TEXT,
    "name"         VARCHAR(32)  NOT NULL,
    "avatarFileId" TEXT,
    "role"         VARCHAR(20),
    "createdAt"    TIMESTAMPTZ  NOT NULL,
    "updatedAt"    TIMESTAMPTZ  NOT NULL,
    "deletedAt"    TIMESTAMPTZ,
    CONSTRAINT "pk_profiles" PRIMARY KEY ("profileId")
);
CREATE UNIQUE INDEX "uk_profiles_default" ON "profiles" ("userId") WHERE "orgId" IS NULL AND "deletedAt" IS NULL;
CREATE UNIQUE INDEX "uk_profiles_org" ON "profiles" ("userId", "orgId") WHERE "orgId" IS NOT NULL AND "deletedAt" IS NULL;

-- orgs: 조직
CREATE TABLE "orgs" (
    "orgId"        TEXT         NOT NULL,
    "name"         VARCHAR(50)  NOT NULL,
    "description"  VARCHAR(200),
    "avatarFileId" TEXT,
    "createdAt"    TIMESTAMPTZ  NOT NULL,
    "updatedAt"    TIMESTAMPTZ  NOT NULL,
    "deletedAt"    TIMESTAMPTZ,
    CONSTRAINT "pk_orgs" PRIMARY KEY ("orgId")
);

-- invite_codes: Org 초대 코드
CREATE TABLE "invite_codes" (
    "inviteCodeId"      TEXT         NOT NULL,
    "orgId"             TEXT         NOT NULL,
    "code"              VARCHAR(8)   NOT NULL,
    "createdByProfileId" TEXT        NOT NULL,
    "createdAt"         TIMESTAMPTZ  NOT NULL,
    "deletedAt"         TIMESTAMPTZ,
    CONSTRAINT "pk_invite_codes" PRIMARY KEY ("inviteCodeId")
);
CREATE UNIQUE INDEX "uk_invite_codes_code" ON "invite_codes" ("code") WHERE "deletedAt" IS NULL;

-- teams: Org 하위 그룹
CREATE TABLE "teams" (
    "teamId"    TEXT         NOT NULL,
    "orgId"     TEXT         NOT NULL,
    "name"      VARCHAR(50)  NOT NULL,
    "createdAt" TIMESTAMPTZ  NOT NULL,
    "updatedAt" TIMESTAMPTZ  NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    CONSTRAINT "pk_teams" PRIMARY KEY ("teamId")
);

-- team_members: profileId 기반
CREATE TABLE "team_members" (
    "teamMemberId" TEXT         NOT NULL,
    "teamId"       TEXT         NOT NULL,
    "profileId"    TEXT         NOT NULL,
    "createdAt"    TIMESTAMPTZ  NOT NULL,
    "deletedAt"    TIMESTAMPTZ,
    CONSTRAINT "pk_team_members" PRIMARY KEY ("teamMemberId")
);
CREATE UNIQUE INDEX "uk_team_members_active" ON "team_members" ("teamId", "profileId") WHERE "deletedAt" IS NULL;

-- channels: DM / GROUP 대화방
CREATE TABLE "channels" (
    "channelId"          TEXT         NOT NULL,
    "orgId"              TEXT         NOT NULL,
    "type"               VARCHAR(10)  NOT NULL,
    "name"               VARCHAR(50),
    "createdByProfileId" TEXT,
    "createdAt"          TIMESTAMPTZ  NOT NULL,
    "updatedAt"          TIMESTAMPTZ  NOT NULL,
    "deletedAt"          TIMESTAMPTZ,
    CONSTRAINT "pk_channels" PRIMARY KEY ("channelId")
);

-- channel_members: profileId 기반
CREATE TABLE "channel_members" (
    "channelMemberId"   TEXT         NOT NULL,
    "channelId"         TEXT         NOT NULL,
    "profileId"         TEXT         NOT NULL,
    "lastReadMessageId" TEXT,
    "createdAt"         TIMESTAMPTZ  NOT NULL,
    "deletedAt"         TIMESTAMPTZ,
    CONSTRAINT "pk_channel_members" PRIMARY KEY ("channelMemberId")
);
CREATE UNIQUE INDEX "uk_channel_members_active" ON "channel_members" ("channelId", "profileId") WHERE "deletedAt" IS NULL;
