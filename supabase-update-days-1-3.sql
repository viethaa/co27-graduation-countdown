-- Run once in Supabase SQL Editor if you already ran supabase.sql.
-- This makes Days 1-3 unbookable at the database level.

alter policy "Anonymous users can book one valid date"
on public.bookings
with check (
  auth.uid() = user_id
  and date between date '2026-08-15' and date '2027-06-04'
  and photo_url is null
  and photo_path is null
);
