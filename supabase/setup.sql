-- Use TEXT instead of UUID to allow string IDs

-- Sessions table
DROP TABLE IF EXISTS sessions CASCADE;
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
DROP TABLE IF EXISTS rooms CASCADE;
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  user_a TEXT,
  user_b TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  sender_session_id TEXT,
  sender_nickname TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
DROP TABLE IF EXISTS reports CASCADE;
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  reporter_session TEXT,
  reported_session TEXT,
  room_id TEXT,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;