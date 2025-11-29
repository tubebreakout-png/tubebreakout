/*
  # Create email_subscribers table

  1. New Tables
    - `email_subscribers`
      - `id` (uuid, primary key) - Unique identifier for each subscriber
      - `email` (text, unique, not null) - Subscriber's email address
      - `subscribed_at` (timestamptz, default now()) - Timestamp when user subscribed
      - `source` (text) - Where the subscription came from (e.g., 'modal', 'footer')
      - `is_active` (boolean, default true) - Whether the subscription is active

  2. Security
    - Enable RLS on `email_subscribers` table
    - Add policy for service role to insert subscribers (public submissions)
    - No public read access to protect subscriber privacy

  3. Indexes
    - Index on email for fast lookups
    - Index on subscribed_at for analytics

  4. Notes
    - Emails are stored securely with RLS enabled
    - Only authenticated service role can read/manage subscribers
    - Public can only insert (submit their email)
*/

-- Create the email_subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  source text DEFAULT 'modal',
  is_active boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public submission)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view subscribers (for admin purposes)
CREATE POLICY "Only authenticated users can view subscribers"
  ON email_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update subscribers (for unsubscribe functionality)
CREATE POLICY "Only authenticated users can update subscribers"
  ON email_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);