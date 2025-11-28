# StatJunkie

A modern, real-time NBA statistics tracking application built with Next.js. Track live scores, player statistics, team standings, and manage your favorite teams and players.

![StatJunkie](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.84.0-green?style=flat-square&logo=supabase)

## ✨ Features

- 🏀 **Live NBA Scores** - Real-time game scores with Pusher WebSocket integration
- 📊 **Player Statistics** - Search and view detailed player stats from the current season
- 🏆 **Team Standings** - Eastern and Western Conference standings with rankings
- ⭐ **Favorites System** - Save and manage your favorite teams and players
- 🔐 **Secure Authentication** - Email/password and Google OAuth via Supabase
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ⚡ **Real-time Updates** - Live score updates every minute during game time
- 📱 **Fully Responsive** - Seamless experience across all devices

## 🎥 Demo & Screenshots

### 📊 Dashboard Overview

https://github.com/user-attachments/assets/your-dashboard-video-id

*Real-time scores, favorite teams, and team stats at a glance*

### 🔍 Player Search

https://github.com/user-attachments/assets/your-player-search-video-id

*Fast autocomplete search with detailed player statistics for the current NBA season*

### 🏀 Teams & Standings

https://github.com/user-attachments/assets/your-teams-video-id

*Browse all NBA teams and view conference standings*

### 🎮 Live Scores

![Live Scores](./public/Screenshot%202025-11-25%20015035.png)

*Real-time game scores with status indicators*

### ⭐ Favorites Management

![Favorites Page](./public/Screenshot%202025-11-25%20015108.png)

*Personalized favorites dashboard for quick access to your teams and players*

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.1 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **Database:** Supabase (PostgreSQL)
- **Caching:** Upstash Redis
- **Real-time:** Pusher WebSockets
- **UI Components:** shadcn/ui
- **Icons:** Lucide React, react-nba-logos

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **Package Manager:** npm, yarn, pnpm, or bun
- **Supabase Account:** [Sign up here](https://supabase.com)
- **Upstash Redis Account:** [Sign up here](https://upstash.com)
- **Pusher Account:** [Sign up here](https://pusher.com)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Darell-T/StatJunkieV2.git
cd StatJunkieV2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Upstash Redis Configuration
UPSTASH_REDIS_URL=your_redis_rest_url
UPSTASH_REDIS_TOKEN=your_redis_rest_token

# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# Cron Secret (generate a random secure string)
CRON_SECRET=your_random_secure_string
```

### 4. Set Up Supabase Database

1. Create a new project in your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to the SQL Editor
3. Run the following SQL to create the required tables and policies:

```sql
-- Create favorites_teams table
CREATE TABLE IF NOT EXISTS favorites_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  team_abbreviation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, team_id)
);

-- Create favorites_players table
CREATE TABLE IF NOT EXISTS favorites_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  player_team TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE favorites_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites_players ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites_teams
CREATE POLICY "Users can view their own favorite teams"
  ON favorites_teams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite teams"
  ON favorites_teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite teams"
  ON favorites_teams FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for favorites_players
CREATE POLICY "Users can view their own favorite players"
  ON favorites_players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite players"
  ON favorites_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite players"
  ON favorites_players FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
StatJunkieV2/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/         # Sign in page
│   │   └── sign-up/         # Sign up page
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   │   ├── cron/            # Cron jobs for score updates
│   │   ├── favorites/       # Favorites CRUD operations
│   │   ├── games/           # Live games data
│   │   ├── players/         # Player statistics
│   │   └── standings/       # Team standings
│   ├── dashboard/           # Main dashboard
│   ├── favorites/           # Favorites management
│   ├── player-stats/        # Player search & stats
│   ├── scores/              # Live scores page
│   └── teams/               # Teams & standings
├── components/
│   ├── auth/                # Auth UI components
│   ├── favorites/           # Favorites components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase utilities
│   ├── redis.ts             # Redis client
│   ├── pusher.ts            # Pusher server instance
│   ├── pusher-client.ts     # Pusher client singleton
│   └── utils.ts             # Helper functions
├── middleware.ts            # Auth middleware
└── public/                  # Static assets
```

## 🎯 Feature Details

### 🏀 Live Scores

- Real-time game scores updated every minute during game hours (6 PM - 11 PM EST)
- Visual indicators for live games, final scores, and scheduled games
- Team logos and arena information
- Quarter-by-quarter progress tracking

### 📊 Player Statistics

- Search functionality with autocomplete
- Comprehensive stats: points, rebounds, assists, field goal percentage
- Player headshots and team affiliations
- Current season statistics from ESPN API

### 🏆 Team Standings

- Separate views for Eastern and Western conferences
- Win/loss records and winning percentages
- Team rankings and playoff positioning
- Interactive team cards with logos

### ⭐ Favorites System

- Personalized dashboard with saved teams and players
- One-click add/remove functionality
- Persistent storage with Supabase
- User-specific data with Row Level Security

### 🔐 Authentication

- Email/password registration and login
- Google OAuth integration
- Protected routes with Next.js middleware
- Secure session management via Supabase Auth

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel project settings
4. Deploy!

**Note:** The application will automatically redeploy on every push to your main branch.

### Configure Cron Jobs

The app uses Vercel Cron Jobs to update scores. Ensure `vercel.json` is configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-scores",
      "schedule": "*/1 18-23 * * *"
    }
  ]
}
```

This runs every minute once an NBA game has started.

## ⚡ Performance & Optimization

- **Redis Caching (Scores):** Live game scores cached for 60 seconds to minimize external API calls
- **Redis Caching (Players):** Player statistics cached for 3 days to reduce API load
- **Image Optimization:** Next.js automatic image optimization for team logos and player headshots
- **Code Splitting:** Route-based automatic code splitting for faster page loads
- **WebSocket Singleton:** Efficient Pusher connection management prevents duplicate connections
- **Lazy Loading:** Components and data loaded on demand

## ⚠️ Important Notes

- **ESPN API:** Free public API with no authentication required. Be mindful of rate limits
- **Redis Cache (Scores):** 60-second TTL reduces load on ESPN servers during live games
- **Redis Cache (Players):** 3-day TTL for player stats as they don't change frequently
- **Pusher Free Tier:** Supports up to 100 concurrent connections and 200k messages/day
- **React Strict Mode:** May show duplicate WebSocket connections in development (normal behavior)

## 🐛 Troubleshooting

### WebSocket Connection Issues

If live scores aren't updating:

- Verify Pusher credentials in `.env.local` match your Pusher dashboard
- Check browser console for connection errors
- Ensure WebSockets are enabled in your Pusher app settings
- Try clearing browser cache and reloading

### Database Connection Errors

- Double-check Supabase URL and anon key
- Verify RLS policies are properly configured
- Ensure user is authenticated when accessing protected routes
- Check Supabase project status in dashboard

### Cron Job Not Triggering

- Confirm `CRON_SECRET` matches in both local and Vercel environments
- Check Vercel Cron Logs in your project dashboard
- Verify cron schedule in `vercel.json` is correctly formatted
- Ensure the API route `/api/cron/update-scores` is deployed

### Authentication Issues

- Clear browser cookies and local storage
- Check Supabase Auth settings (email confirmations, OAuth providers)
- Verify redirect URLs in Supabase dashboard
- Ensure middleware is properly configured

## 📝 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit your changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test changes locally before submitting
- Update documentation for new features
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NBA Data:** Powered by [ESPN API](https://www.espn.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Team Logos:** [react-nba-logos](https://github.com/ChrisKatsaras/React-NBA-Logos)
- **Icons:** [Lucide React](https://lucide.dev)

## 📧 Support & Contact

- **Report Issues:** [GitHub Issues](https://github.com/Darell-T/StatJunkieV2/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Darell-T/StatJunkieV2/discussions)
- **Questions?** Feel free to open an issue or discussion!

---

<p align="center">Made with ❤️ for NBA fans</p>
<p align="center">⭐ Star this repo if Stephen Curry is the GOAT!</p>
