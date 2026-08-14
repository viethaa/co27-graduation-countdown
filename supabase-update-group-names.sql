-- Run once in Supabase SQL Editor if you already ran supabase.sql.
-- Allows one booking owner to list a group of photographers in one field.

alter table public.bookings
drop constraint if exists bookings_student_name_check;

alter table public.bookings
add constraint bookings_student_name_check
check (char_length(trim(student_name)) between 1 and 200);
