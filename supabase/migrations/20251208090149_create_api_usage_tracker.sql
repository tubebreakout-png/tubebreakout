/*
  # Create API Usage Tracker Table

  1. New Tables
    - `api_usage_tracker`
      - `id` (uuid, primary key) - Unique identifier
      - `date` (date, unique) - Date of usage (YYYY-MM-DD)
      - `youtube_api_calls` (integer) - Number of YouTube API calls made
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Indexes
    - Index on `date` column for fast lookups

  3. Security
    - Enable RLS on `api_usage_tracker` table
    - Add policy for public read access to check remaining quota
    - No public insert/update/delete access (only backend can modify)

  4. Notes
    - This table tracks daily YouTube API usage to enforce 10,000 calls/day limit
    - Only one record per date
    - Backend functions will check and update this counter
*/

CREATE TABLE IF NOT EXISTS api_usage_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  youtube_api_calls integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_api_usage_tracker_date ON api_usage_tracker(date);

-- Enable RLS
ALTER TABLE api_usage_tracker ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read usage data (to display remaining quota)
CREATE POLICY "Anyone can view API usage"
  ON api_usage_tracker
  FOR SELECT
  TO public
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_api_usage_tracker_updated_at
  BEFORE UPDATE ON api_usage_tracker
  FOR EACH ROW
  EXECUTE FUNCTION update_api_usage_updated_at();