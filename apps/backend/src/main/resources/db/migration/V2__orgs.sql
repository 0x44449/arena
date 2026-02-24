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

CREATE TABLE "org_members" (
    "orgMemberId" TEXT         NOT NULL,
    "orgId"       TEXT         NOT NULL,
    "userId"      TEXT         NOT NULL,
    "role"        VARCHAR(20)  NOT NULL,
    "createdAt"   TIMESTAMPTZ  NOT NULL,
    "updatedAt"   TIMESTAMPTZ  NOT NULL,
    "deletedAt"   TIMESTAMPTZ,
    CONSTRAINT "pk_org_members" PRIMARY KEY ("orgMemberId"),
    CONSTRAINT "fk_org_members_org" FOREIGN KEY ("orgId") REFERENCES "orgs" ("orgId"),
    CONSTRAINT "fk_org_members_user" FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);

-- Org당 활성 멤버는 유저 1명만
CREATE UNIQUE INDEX "uk_org_members_active" ON "org_members" ("orgId", "userId") WHERE "deletedAt" IS NULL;

CREATE TABLE "invite_codes" (
    "inviteCodeId" TEXT         NOT NULL,
    "orgId"        TEXT         NOT NULL,
    "code"         VARCHAR(8)   NOT NULL,
    "createdBy"    TEXT         NOT NULL,
    "createdAt"    TIMESTAMPTZ  NOT NULL,
    "deletedAt"    TIMESTAMPTZ,
    CONSTRAINT "pk_invite_codes" PRIMARY KEY ("inviteCodeId"),
    CONSTRAINT "fk_invite_codes_org" FOREIGN KEY ("orgId") REFERENCES "orgs" ("orgId"),
    CONSTRAINT "fk_invite_codes_user" FOREIGN KEY ("createdBy") REFERENCES "users" ("userId")
);

-- 활성 초대 코드는 유니크
CREATE UNIQUE INDEX "uk_invite_codes_code" ON "invite_codes" ("code") WHERE "deletedAt" IS NULL;
