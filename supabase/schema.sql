-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('TEXT', 'LONG_TEXT', 'YES_NO', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
  options JSONB,
  is_required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  conditional_question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  conditional_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_questions_display_order ON questions(display_order);
CREATE INDEX idx_questions_is_active ON questions(is_active);
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_responses_created_at ON responses(created_at);
CREATE INDEX idx_answers_response_id ON answers(response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

-- Insert default questions
INSERT INTO questions (question_text, question_type, is_required, display_order) VALUES
('What''s your name?', 'TEXT', true, 1),
('Can I have your Facebook? 👀', 'YES_NO', false, 2),
('What do your friends usually call you?', 'TEXT', true, 3),
('What''s your favorite thing to do when you''re bored?', 'SINGLE_CHOICE', true, 4),
('What kind of music do you usually listen to?', 'MULTIPLE_CHOICE', true, 5),
('What''s your favorite food?', 'TEXT', true, 6),
('Coffee or milktea? 🧋☕', 'SINGLE_CHOICE', true, 7),
('Are you more of a stay-at-home person or an outside/adventure person?', 'SINGLE_CHOICE', true, 8),
('What''s one thing that can instantly make you happy?', 'LONG_TEXT', true, 9),
('What kind of person do you enjoy talking to?', 'LONG_TEXT', true, 10),
('What''s something you really appreciate when someone does it for you?', 'LONG_TEXT', true, 11),
('Be honest... are you currently interested in someone? 👀', 'SINGLE_CHOICE', true, 12),
('If someone wanted to get to know you better, what should they know about you?', 'LONG_TEXT', true, 13),
('And finally... would you be okay with getting to know each other more? 👀❤️', 'SINGLE_CHOICE', true, 14);

-- Update options for choice questions
UPDATE questions SET options = '["Your name..."]' WHERE question_text = 'What''s your name?';

UPDATE questions SET options = '["Yes, sure 💗", "Maybe later 🤍", "I don''t use Facebook"]' 
WHERE question_text = 'Can I have your Facebook? 👀';

UPDATE questions SET options = '["Your nickname..."]' WHERE question_text = 'What do your friends usually call you?';

UPDATE questions SET options = '["Watching movies 🎬", "Listening to music 🎧", "Playing games 🎮", "Sleeping 😴", "Going out 🌎", "Scrolling social media 📱", "Other"]'
WHERE question_text = 'What''s your favorite thing to do when you''re bored?';

UPDATE questions SET options = '["Pop", "R&B", "OPM", "K-Pop", "Hip-Hop/Rap", "Rock", "Acoustic", "Classical", "Other"]'
WHERE question_text = 'What kind of music do you usually listen to?';

UPDATE questions SET options = '["Your favorite food..."]' WHERE question_text = 'What''s your favorite food?';

UPDATE questions SET options = '["Coffee ☕", "Milktea 🧋", "Both", "Neither"]'
WHERE question_text = 'Coffee or milktea? 🧋☕';

UPDATE questions SET options = '["Stay at home 🏠", "Going outside 🌎", "Depends on my mood 😌"]'
WHERE question_text = 'Are you more of a stay-at-home person or an outside/adventure person?';

UPDATE questions SET options = '["Yes 😳", "Maybe...", "Not right now", "It''s complicated 😅", "I''d rather not say"]'
WHERE question_text = 'Be honest... are you currently interested in someone? 👀';

UPDATE questions SET options = '["Yes 💗", "Definitely!", "Maybe 😳", "Let''s see where it goes", "I''d rather stay friends"]'
WHERE question_text = 'And finally... would you be okay with getting to know each other more? 👀❤️';

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('website_title', 'Can I Get to Know You?'),
('website_subtitle', 'A little question for you... 💌'),
('welcome_message', 'I''ve been curious about you, so I thought I''d ask a few things.'),
('final_message', 'Thank you for letting me get to know you a little better.'),
('primary_color', 'rose'),
('allow_multiple_submissions', 'false'),
('questionnaire_enabled', 'true')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public users
-- Public can read active questions only
CREATE POLICY "Public can read active questions" ON questions
  FOR SELECT TO anon
  USING (is_active = true);

-- Public can insert responses (anonymous)
CREATE POLICY "Public can create responses" ON responses
  FOR INSERT TO anon
  WITH CHECK (true);

-- Public can insert answers (anonymous)
CREATE POLICY "Public can create answers" ON answers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Public can read their own responses and answers
CREATE POLICY "Users can read own responses" ON responses
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Users can read own answers" ON answers
  FOR SELECT TO anon
  USING (true);

-- Public cannot read settings
CREATE POLICY "Settings not accessible to public" ON admin_settings
  FOR SELECT TO anon
  USING (false);

-- Authenticated admin users can do everything
CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage responses" ON responses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage answers" ON answers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
