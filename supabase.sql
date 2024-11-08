-- Create teams table
CREATE TABLE teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    manager TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create weekly_results table
CREATE TABLE weekly_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id),
    opponent_id UUID REFERENCES teams(id),
    week INTEGER NOT NULL,
    points DECIMAL(10,2) NOT NULL,
    opponent_points DECIMAL(10,2) NOT NULL,
    top_player BOOLEAN DEFAULT false,
    top_points BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create weekly_writeups table
CREATE TABLE weekly_writeups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the standings view
CREATE OR REPLACE VIEW team_standings AS
WITH wins_losses AS (
  SELECT 
    team_id,
    COUNT(CASE WHEN points > opponent_points THEN 1 END) as wins,
    COUNT(CASE WHEN points < opponent_points THEN 1 END) as losses
  FROM weekly_results
  GROUP BY team_id
)
SELECT 
  t.id,
  t.name,
  t.manager,
  COALESCE(w.wins, 0) as wins,
  COALESCE(w.losses, 0) as losses,
  COALESCE(w.wins, 0) + COALESCE(w.losses, 0) as games_played
FROM teams t
LEFT JOIN wins_losses w ON t.id = w.team_id
ORDER BY 
  COALESCE(w.wins, 0) DESC,
  COALESCE(w.wins, 0)::FLOAT / NULLIF(COALESCE(w.wins, 0) + COALESCE(w.losses, 0), 0) DESC;

-- Enable RLS for the tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_writeups ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON teams
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON weekly_results
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON weekly_writeups
    FOR SELECT TO public USING (true);

-- Create policies for authenticated insert/update access
CREATE POLICY "Enable insert for authenticated users only" ON teams
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON weekly_results
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON weekly_writeups
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON teams
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable update for authenticated users only" ON weekly_results
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable update for authenticated users only" ON weekly_writeups
    FOR UPDATE TO authenticated USING (true);