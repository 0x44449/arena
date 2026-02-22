# WebSocket Architecture

## Connection

- **Protocol**: Socket.IO
- **Path**: `/ws`
- **Namespace**: `/arena`
- **Port**: Same as HTTP server
- **Auth**: JWT in `auth.token` during handshake

### Client Connection Example
```javascript
const socket = io("http://localhost:8003/arena", {
  path: "/ws",
  auth: { token: "Bearer <JWT>" }
});
```

## Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `channel:join` | `{ channelId: string }` | Join channel room for real-time messages |
| `channel:leave` | `{ channelId: string }` | Leave channel room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | `{ channelId: string, message: MessageDto }` | New message in joined channel |

## Room Structure

- Each channel maps to a Socket.IO room: `channel:{channelId}`
- When a client sends `channel:join`, they join the corresponding room
- Broadcast targets only clients in the channel room

## Signal System (Pub/Sub)

Backend uses Redis Pub/Sub for cross-process event broadcasting:

### Signal Channels

| Channel | Payload | Description |
|---------|---------|-------------|
| `message:new` | `{ channelId, message }` | Published when a message is created |
| `user:updated` | `{ userId, user }` | Published when a user profile changes |

### Flow

1. `MessageService.createMessage()` publishes to `message:new` signal
2. Gateway subscribes to `message:new` via Redis subscriber
3. Gateway broadcasts to Socket.IO room `channel:{channelId}`
4. All connected clients in the room receive the event

## Authentication

- WebSocket connections are authenticated using the same JWT as HTTP requests
- JWT is validated during the handshake phase
- Invalid tokens result in immediate disconnection
- Each WebSocket event handler has a JWT auth guard
