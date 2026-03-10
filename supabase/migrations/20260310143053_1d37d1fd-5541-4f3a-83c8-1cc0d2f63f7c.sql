-- Remove old UPDATE policy that allows any column update
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new UPDATE policy that blocks subscription_status changes from client
CREATE POLICY "Users can update their own profile except subscription"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND subscription_status = (
    SELECT subscription_status FROM public.profiles WHERE user_id = auth.uid()
  )
);