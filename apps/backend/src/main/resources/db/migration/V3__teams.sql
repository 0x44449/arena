CREATE TABLE "teams" (
    "teamId"    TEXT         NOT NULL,
    "orgId"     TEXT         NOT NULL,
    "name"      VARCHAR(50)  NOT NULL,
    "createdAt" TIMESTAMPTZ  NOT NULL,
    "updatedAt" TIMESTAMPTZ  NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    CONSTRAINT "pk_teams" PRIMARY KEY ("teamId"),
    CONSTRAINT "fk_teams_org" FOREIGN KEY ("orgId") REFERENCES "orgs" ("orgId")
);

CREATE TABLE "team_members" (
    "teamMemberId" TEXT         NOT NULL,
    "teamId"       TEXT         NOT NULL,
    "userId"       TEXT         NOT NULL,
    "createdAt"    TIMESTAMPTZ  NOT NULL,
    "deletedAt"    TIMESTAMPTZ,
    CONSTRAINT "pk_team_members" PRIMARY KEY ("teamMemberId"),
    CONSTRAINT "fk_team_members_team" FOREIGN KEY ("teamId") REFERENCES "teams" ("teamId"),
    CONSTRAINT "fk_team_members_user" FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);

-- Team당 활성 멤버는 유저 1명만
CREATE UNIQUE INDEX "uk_team_members_active" ON "team_members" ("teamId", "userId") WHERE "deletedAt" IS NULL;
