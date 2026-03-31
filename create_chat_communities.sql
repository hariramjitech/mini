-- ================================================================
-- Community Chat Tables for Supabase
-- ================================================================

-- 1. Create chat_communities table
CREATE TABLE IF NOT EXISTS public.chat_communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (TRIM(BOTH FROM name) <> ''),
  description text,
  join_code text UNIQUE NOT NULL DEFAULT substr(md5(gen_random_uuid()::text), 1, 8),
  created_by text REFERENCES public.users(uid) ON DELETE CASCADE,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create chat_community_members table
CREATE TABLE IF NOT EXISTS public.chat_community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES public.chat_communities(id) ON DELETE CASCADE,
  user_id text REFERENCES public.users(uid) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- 3. Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES public.chat_communities(id) ON DELETE CASCADE,
  user_id text REFERENCES public.users(uid) ON DELETE CASCADE,
  content text NOT NULL CHECK (TRIM(BOTH FROM content) <> ''),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ================================================================
-- Row-Level Security (RLS) Enable
-- ================================================================

ALTER TABLE public.chat_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- Indexes for Performance
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_chat_communities_join_code ON public.chat_communities(join_code);
CREATE INDEX IF NOT EXISTS idx_chat_community_members_curr_user ON public.chat_community_members(community_id, user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_community_id ON public.chat_messages(community_id);

-- ================================================================
-- Helper Functions for RLS (Bypasses RLS to avoid infinite recursion)
-- ================================================================

CREATE OR REPLACE FUNCTION public.is_community_member(c_id uuid, u_id text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_community_members WHERE community_id = c_id AND user_id = u_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_community_admin(c_id uuid, u_id text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_community_members WHERE community_id = c_id AND user_id = u_id AND role = 'admin'
  );
$$;

-- ================================================================
-- Policies
-- ================================================================

-- chat_communities Policies
DO $$
BEGIN
  -- Anyone authenticated can view public communities or communities they are part of
  DROP POLICY IF EXISTS chat_communities_select ON public.chat_communities;
  CREATE POLICY chat_communities_select ON public.chat_communities FOR SELECT TO authenticated USING (
      is_public = true OR 
      public.is_community_member(id, auth.uid()::text) OR
      created_by = auth.uid()::text
  );

  -- Authenticated users can create communities
  DROP POLICY IF EXISTS chat_communities_insert ON public.chat_communities;
  CREATE POLICY chat_communities_insert ON public.chat_communities FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid()::text);

  -- Admins of the community can update it
  DROP POLICY IF EXISTS chat_communities_update ON public.chat_communities;
  CREATE POLICY chat_communities_update ON public.chat_communities FOR UPDATE TO authenticated USING (
      public.is_community_admin(id, auth.uid()::text)
  ) WITH CHECK (
      public.is_community_admin(id, auth.uid()::text)
  );
  
  -- Admins of the community can delete it
  DROP POLICY IF EXISTS chat_communities_delete ON public.chat_communities;
  CREATE POLICY chat_communities_delete ON public.chat_communities FOR DELETE TO authenticated USING (
      public.is_community_admin(id, auth.uid()::text)
  );
END$$;


-- chat_community_members Policies
DO $$
BEGIN
  -- Members can see other members of communities they are in
  DROP POLICY IF EXISTS chat_community_members_select ON public.chat_community_members;
  CREATE POLICY chat_community_members_select ON public.chat_community_members FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.chat_communities c WHERE c.id = community_id AND c.is_public = true) OR
      public.is_community_member(community_id, auth.uid()::text)
  );

  -- Users can insert themselves into a community (e.g. joining via code or public join)
  DROP POLICY IF EXISTS chat_community_members_insert ON public.chat_community_members;
  CREATE POLICY chat_community_members_insert ON public.chat_community_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
  
  -- Users can leave (delete their own membership)
  DROP POLICY IF EXISTS chat_community_members_delete ON public.chat_community_members;
  CREATE POLICY chat_community_members_delete ON public.chat_community_members FOR DELETE TO authenticated USING (
      user_id = auth.uid()::text OR 
      public.is_community_admin(community_id, auth.uid()::text)
  );
END$$;

-- chat_messages Policies
DO $$
BEGIN
  -- Members can view messages in their communities
  DROP POLICY IF EXISTS chat_messages_select ON public.chat_messages;
  CREATE POLICY chat_messages_select ON public.chat_messages FOR SELECT TO authenticated USING (
      public.is_community_member(community_id, auth.uid()::text)
  );

  -- Members can send messages
  DROP POLICY IF EXISTS chat_messages_insert ON public.chat_messages;
  CREATE POLICY chat_messages_insert ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
      user_id = auth.uid()::text AND 
      public.is_community_member(community_id, auth.uid()::text)
  );
END$$;

-- Enable Realtime for Messages (Idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END$$;
