/*
  # Set up threat intelligence schema

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
    - Enable RLS on threats table
    - Add policies for read/write access
*/

-- Create threats table
CREATE TABLE IF NOT EXISTS threats (
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
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON threats FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON threats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX threats_severity_idx ON threats(severity);
CREATE INDEX threats_category_idx ON threats(category);
CREATE INDEX threats_timestamp_idx ON threats(timestamp);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON threats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();