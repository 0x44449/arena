# Database Schema

PostgreSQL 18. All tables use **camelCase** column names with double-quoting (TypeORM convention preserved for compatibility).

## Entity Relationship

```
users ──< contacts (ownerId, userId)
  │
  ├──< devices (userId)
  ├──< files (ownerId)
  └──< participants ──< direct_participants
          │             └──< group_participants
          └── channels ──< direct_channels
                │         └──< group_channels
                └──< messages
```

## Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| userId | text | PK |
| uid | text | UNIQUE (Supabase user ID) |
| utag | varchar(8) | UNIQUE (user tag) |
| nick | varchar(32) | NOT NULL, indexed |
| email | varchar(255) | nullable |
| statusMessage | varchar(140) | nullable |
| avatarFileId | text | nullable, FK → files.fileId |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

### channels
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK |
| type | varchar(20) | NOT NULL (`direct`, `group`, `team`) |
| name | varchar(100) | nullable (null for DM) |
| teamId | text | nullable |
| lastMessageAt | timestamptz | nullable |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

### direct_channels
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK, OneToOne FK → channels.channelId |

### group_channels
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK, OneToOne FK → channels.channelId |
| iconFileId | text | nullable, FK → files.fileId |

### participants
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK, FK → channels.channelId |
| userId | text | PK, FK → users.userId (indexed) |
| lastReadAt | timestamptz | nullable |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

### direct_participants
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK |
| userId | text | PK |
| | | OneToOne FK → participants(channelId, userId) |

### group_participants
| Column | Type | Constraints |
|--------|------|-------------|
| channelId | text | PK |
| userId | text | PK |
| role | varchar(20) | NOT NULL (`owner`, `member`) |
| nickname | varchar(32) | nullable |
| | | OneToOne FK → participants(channelId, userId) |

### messages
| Column | Type | Constraints |
|--------|------|-------------|
| messageId | text | PK |
| channelId | text | FK → channels.channelId |
| senderId | text | FK → users.userId |
| seq | bigint | NOT NULL |
| content | text | NOT NULL |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |
| | | Index: (channelId, seq) |

**Seq generation**: DB subquery `COALESCE(MAX(seq), 0) + 1` within INSERT (atomic, no Redis dependency).

### files
| Column | Type | Constraints |
|--------|------|-------------|
| fileId | text | PK |
| ownerId | text | FK → users.userId (indexed) |
| storageKey | varchar(512) | NOT NULL (S3 key: `userId/directory/fileId`) |
| bucket | varchar(20) | NOT NULL |
| mimeType | varchar(127) | NOT NULL |
| size | bigint | NOT NULL (bytes) |
| originalName | varchar(255) | NOT NULL |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

### devices
| Column | Type | Constraints |
|--------|------|-------------|
| deviceId | text | PK |
| userId | text | FK → users.userId (indexed, CASCADE delete) |
| fcmToken | text | NOT NULL |
| platform | varchar(20) | NOT NULL (`ios`, `android`, `web`) |
| deviceModel | varchar(100) | nullable |
| osVersion | varchar(50) | nullable |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

### contacts
| Column | Type | Constraints |
|--------|------|-------------|
| ownerId | text | PK, FK → users.userId |
| userId | text | PK, FK → users.userId |
| createdAt | timestamptz | NOT NULL |
| updatedAt | timestamptz | NOT NULL |
| deletedAt | timestamptz | nullable (soft delete) |

## Design Notes

- **Channel inheritance**: Base `channels` table + extension tables (`direct_channels`, `group_channels`) instead of Single Table Inheritance. Avoids nullable columns, clearer type separation.
- **Participant inheritance**: Same pattern — base `participants` + role-specific extensions.
- **Soft deletes**: All entities use `deletedAt`. Sync API includes soft-deleted items via `withDeleted()`.
- **Column naming**: camelCase with `globally_quoted_identifiers=true` in Hibernate to match existing TypeORM schema.
