
-- Drop payment_transactions table
DROP TABLE IF EXISTS public.payment_transactions;

-- Drop the old restrictive update policy on profiles
DROP POLICY IF EXISTS "Users can update their own profile except subscription" ON public.profiles;

-- Create a simpler update policy
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Drop subscription_status column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_status;
