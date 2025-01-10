/*
  # Update threats table schema and policies

  1. Changes
    - Add missing constraints and indexes to threats table
    - Update RLS policies for better security
    - Add conditional trigger creation

  2. Security
    - Maintain RLS policies
    - Add proper constraints on severity and CVSS
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.threats;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create threats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  cvss numeric NOT NULL CHECK (cvss >= 0 AND cvss <= 10),
  category text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  mitigation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.threats;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.threats;

-- Create policies
CREATE POLICY "Allow public read access"
  ON public.threats
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON public.threats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS threats_severity_idx ON public.threats(severity);
CREATE INDEX IF NOT EXISTS threats_category_idx ON public.threats(category);
CREATE INDEX IF NOT EXISTS threats_timestamp_idx ON public.threats(timestamp);

-- Create trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.threats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();