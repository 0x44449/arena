CREATE TABLE "users" (
    "userId"    TEXT         NOT NULL,
    "uid"       TEXT         NOT NULL,
    "email"     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ  NOT NULL,
    "updatedAt" TIMESTAMPTZ  NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    CONSTRAINT "pk_users" PRIMARY KEY ("userId"),
    CONSTRAINT "uk_users_uid" UNIQUE ("uid")
);

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

-- 기본 프로필은 User당 1개
CREATE UNIQUE INDEX "uk_profiles_default" ON "profiles" ("userId") WHERE "orgId" IS NULL AND "deletedAt" IS NULL;

-- Org당 프로필 1개
CREATE UNIQUE INDEX "uk_profiles_org" ON "profiles" ("userId", "orgId") WHERE "orgId" IS NOT NULL AND "deletedAt" IS NULL;
