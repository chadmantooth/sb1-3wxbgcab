/*
  # Initial Schema Setup

  1. New Tables
    - `threats`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `severity` (text)
      - `cvss` (numeric)
      - `category` (text)
      - `timestamp` (timestamptz)
      - `mitigation` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `threats` table
    - Add policies for authenticated users
*/

-- Create threats table
CREATE TABLE IF NOT EXISTS threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity text NOT NULL,
  cvss numeric NOT NULL,
  category text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  mitigation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
  ON threats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert to authenticated users"
  ON threats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER threats_updated_at
  BEFORE UPDATE ON threats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();