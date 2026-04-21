-- FIXED Schema - Run this in Supabase SQL Editor

-- Drop existing tables
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;

-- Create tables with TEXT IDs
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  user_a TEXT,
  user_b TEXT,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  sender_session_id TEXT,
  sender_nickname TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  reporter_session TEXT,
  reported_session TEXT,
  room_id TEXT,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE RLS COMPLETELY (for anonymous chat)
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;