export default {
  version: 1,
  up: `
    -- Users
    CREATE TABLE users (
      user_id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    -- Channels
    CREATE TABLE channels (
      channel_id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'team')),
      last_message_at TEXT,
      data TEXT NOT NULL
    );
    CREATE INDEX idx_channels_last_message ON channels(last_message_at DESC);

    -- Messages
    CREATE TABLE messages (
      message_id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL,
      seq INTEGER NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('pending', 'synced', 'failed')),
      temp_id TEXT,
      data TEXT NOT NULL,
      FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE
    );
    CREATE INDEX idx_messages_channel_seq ON messages(channel_id, seq);
    CREATE INDEX idx_messages_sync_status ON messages(sync_status) WHERE sync_status != 'synced';
    CREATE INDEX idx_messages_temp_id ON messages(temp_id) WHERE temp_id IS NOT NULL;

    -- Contacts
    CREATE TABLE contacts (
      user_id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    -- Sync Queue (오프라인 작업 큐)
    CREATE TABLE sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      retry_count INTEGER NOT NULL DEFAULT 0
    );

    -- Sync State (동기화 상태 추적)
    CREATE TABLE sync_state (
      key TEXT PRIMARY KEY,
      last_synced_at TEXT NOT NULL
    );
  `,
};
