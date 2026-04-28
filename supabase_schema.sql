-- Create a table to store PRD generations
create table generations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt text not null,
  result jsonb not null
);

-- Enable Row Level Security (RLS)
alter table generations enable row level security;

-- Create a policy to allow anyone to insert (for demo purposes, restrict in production)
create policy "Enable insert for all users" on generations for insert with check (true);

-- Create a policy to allow anyone to read (optional, or restrict to own data)
create policy "Enable read for all users" on generations for select using (true);
