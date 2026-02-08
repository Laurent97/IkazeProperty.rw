-- Disable the problematic trigger completely
-- This will allow registration to work without the trigger interfering

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();

-- Add a simple policy to allow service role to manage users
DROP POLICY IF EXISTS "Service role full access to users" ON users;
CREATE POLICY "Service role full access to users" ON users
    FOR ALL USING (auth.role() = 'service_role');

SELECT 'Trigger disabled - registration should work now' as status;