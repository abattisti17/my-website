-- Profile improvements: Add email column and improve display_name logic
-- Step 13: Better user profile management

-- Add email column to profiles table
alter table profiles add column if not exists email text;

-- Update existing profiles to extract email from display_name where it looks like an email
update profiles 
set email = display_name,
    display_name = split_part(display_name, '@', 1)
where display_name like '%@%' and email is null;

-- Create index on email for performance
create index if not exists idx_profiles_email on profiles(email);

-- Add helpful comments
comment on column profiles.email is 'User email address for contact and identification';
comment on column profiles.display_name is 'Public display name chosen by user (defaults to email prefix)';
