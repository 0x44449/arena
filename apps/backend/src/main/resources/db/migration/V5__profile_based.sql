-- Profile 기반 시스템으로 전환
-- User는 인증용, 조직 내 모든 활동은 Profile(profileId) 기준

-- 1. org_members 제거 — Profile이 조직 멤버십을 대체 (orgId + role)
DROP TABLE IF EXISTS "org_members";

-- 2. team_members: userId → profileId
DROP INDEX IF EXISTS "uk_team_members_active";
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "fk_team_members_user";
ALTER TABLE "team_members" RENAME COLUMN "userId" TO "profileId";
ALTER TABLE "team_members" ADD CONSTRAINT "fk_team_members_profile"
    FOREIGN KEY ("profileId") REFERENCES "profiles" ("profileId");
CREATE UNIQUE INDEX "uk_team_members_active"
    ON "team_members" ("teamId", "profileId") WHERE "deletedAt" IS NULL;

-- 3. channel_members: userId → profileId
DROP INDEX IF EXISTS "uk_channel_members_active";
ALTER TABLE "channel_members" DROP CONSTRAINT IF EXISTS "fk_channel_members_user";
ALTER TABLE "channel_members" RENAME COLUMN "userId" TO "profileId";
ALTER TABLE "channel_members" ADD CONSTRAINT "fk_channel_members_profile"
    FOREIGN KEY ("profileId") REFERENCES "profiles" ("profileId");
CREATE UNIQUE INDEX "uk_channel_members_active"
    ON "channel_members" ("channelId", "profileId") WHERE "deletedAt" IS NULL;

-- 4. channels: createdBy → createdByProfileId
ALTER TABLE "channels" RENAME COLUMN "createdBy" TO "createdByProfileId";

-- 5. invite_codes: createdBy → createdByProfileId
ALTER TABLE "invite_codes" DROP CONSTRAINT IF EXISTS "fk_invite_codes_user";
ALTER TABLE "invite_codes" RENAME COLUMN "createdBy" TO "createdByProfileId";
ALTER TABLE "invite_codes" ADD CONSTRAINT "fk_invite_codes_profile"
    FOREIGN KEY ("createdByProfileId") REFERENCES "profiles" ("profileId");
