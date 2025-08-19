-- Pod member cap enforcement trigger
-- Step 11: Enforce pod size <= 5 at database level

-- Function to check pod member count before insertion
create or replace function pod_member_count_ok()
returns trigger as $$
begin
  -- Count current members in the pod (excluding the new member being added)
  if (select count(*) from pod_members where pod_id = new.pod_id) >= 5 then
    raise exception 'Pod is full (maximum 5 members)' using errcode = 'P0001';
  end if;
  return new;
end; 
$$ language plpgsql;

-- Drop existing trigger if it exists
drop trigger if exists trg_pod_member_cap on pod_members;

-- Create trigger to enforce pod cap before inserting new members
create trigger trg_pod_member_cap
  before insert on pod_members
  for each row 
  execute function pod_member_count_ok();

-- Add helpful comment
comment on function pod_member_count_ok() is 'Ensures pods cannot exceed 5 members by checking count before insert';
comment on trigger trg_pod_member_cap on pod_members is 'Enforces maximum pod size of 5 members';
