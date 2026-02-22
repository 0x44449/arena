# REST API Contracts

Base path: `/api/v1`. All endpoints require Bearer JWT authentication unless noted.

## User (`/api/v1/users`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| POST | `/users` | createUser | Register new user |
| GET | `/users/me` | getMe | Get current user |
| PATCH | `/users/me` | updateMe | Update current user |
| GET | `/users/:userId` | getUser | Get user by ID |

### CreateUserDto (Request)
```
nick: string       # required, 1-32 chars
email?: string     # optional, valid email
statusMessage?: string  # optional, max 140 chars
```

### UpdateUserDto (Request)
```
nick?: string           # 1-32 chars
statusMessage?: string  # max 140 chars
avatarFileId?: string | null  # null to remove avatar
```

### UserDto (Response)
```
userId: string
utag: string
nick: string
avatar: FileDto | null
email: string | null
statusMessage: string | null
createdAt: Date
updatedAt: Date
```

---

## Channel (`/api/v1/channels`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| GET | `/channels` | getMyChannels | List user's channels |
| GET | `/channels/:channelId` | getChannel | Get channel details |
| POST | `/channels/direct` | createDirectChannel | Create or get DM |
| POST | `/channels/group` | createGroupChannel | Create group channel |

### CreateDirectChannelDto
```
userId: string    # recipient user ID
```

### CreateGroupChannelDto
```
name: string          # required, max 100 chars
userIds?: string[]    # user IDs to invite
iconFileId?: string   # group icon file ID
```

### ChannelDto (Response)
```
channelId: string
type: 'direct' | 'group' | 'team'
name: string | null
icon: FileDto | null
participants: ParticipantDto[]
lastMessageAt: Date | null
createdAt: Date
updatedAt: Date
```

---

## Message (`/api/v1/messages`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| POST | `/messages/channel/:channelId` | createMessage | Send message |
| GET | `/messages/channel/:channelId` | getMessages | List messages (cursor) |
| GET | `/messages/channel/:channelId/sync` | syncMessages | Sync since timestamp |

### CreateMessageDto
```
content: string    # required, non-empty
```

### GetMessagesQueryDto (Query params)
```
before?: string    # message ID — get older messages
after?: string     # message ID — get newer messages
around?: string    # message ID — get surrounding messages
limit?: number     # 1-100, default 50
```

### SyncMessagesQueryDto
```
since: string      # ISO 8601 datetime
```

### MessageDto (Response)
```
messageId: string
channelId: string
sender: UserDto
seq: number
content: string
createdAt: Date
updatedAt: Date
```

### MessageSyncDataDto (Response for sync)
```
created: MessageDto[]
updated: MessageDto[]
deleted: string[]          # deleted message IDs
requireFullSync: boolean   # true if >100 changes
```

---

## Contact (`/api/v1/contacts`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| GET | `/contacts` | getContacts | List contacts |
| POST | `/contacts` | createContact | Add contact |
| DELETE | `/contacts/:userId` | deleteContact | Remove contact |

### CreateContactDto
```
userId: string    # user ID to add
```

### ContactDto (Response)
```
user: UserDto
createdAt: Date
updatedAt: Date
```

---

## File (`/api/v1/files`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| POST | `/files/presigned-url` | getPresignedUrl | Get S3 upload URL (public) |
| POST | `/files/register` | registerFile | Register uploaded file (public) |
| POST | `/files/private/presigned-url` | getPrivatePresignedUrl | Get S3 upload URL (private) |
| POST | `/files/private/register` | registerPrivateFile | Register uploaded file (private) |
| GET | `/files/:fileId` | getFile | Get file metadata |
| DELETE | `/files/:fileId` | deleteFile | Delete file |

### Upload Flow
1. `POST /files/presigned-url` → get `uploadUrl` and `key`
2. `PUT uploadUrl` (direct S3 upload)
3. `POST /files/register` with `key` and `name` → get `FileDto`

### GetPresignedUrlDto
```
directory?: string    # e.g. 'avatars', 'attachments', 'group-icons'
mimeType: string      # e.g. 'image/jpeg'
```

### RegisterFileDto
```
key: string    # S3 key from presigned-url response
name: string   # original filename
```

### FileDto (Response)
```
fileId: string
url: string         # downloadable URL
name: string
mimeType: string
size: number        # bytes
createdAt: Date
updatedAt: Date
```

---

## Device (`/api/v1/devices`)

| Method | Path | operationId | Description |
|--------|------|-------------|-------------|
| POST | `/devices/register` | registerDevice | Register FCM device |
| POST | `/devices/unregister` | unregisterDevice | Unregister device |

### RegisterDeviceDto
```
deviceId: string        # unique device identifier
fcmToken: string        # FCM token
platform: string        # 'ios' | 'android' | 'web'
deviceModel?: string
osVersion?: string
```

### UnregisterDeviceDto
```
deviceId: string
```

---

## Error Handling

Business errors return HTTP 200 with error code:
```json
{ "success": false, "errorCode": "USER_NOT_FOUND" }
```

Standard error codes:
- `USER_NOT_FOUND`, `INVALID_REQUEST`, `CONFLICT`, `BAD_REQUEST`
- `INVALID_DM_TARGET`, `INTERNAL_ERROR`

HTTP status errors (401, 403, 404) use actual HTTP status codes.
