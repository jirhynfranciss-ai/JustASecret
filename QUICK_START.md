# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase

**Create Supabase Project**:
1. Visit [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Create a new project
4. Note: Project takes 2-3 minutes to initialize

**Setup Database**:
1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy paste entire contents of `supabase/schema.sql`
4. Click **Run**
5. Done! Database is ready

### 3. Configure Environment

**Copy and Edit `.env`**:
```bash
cp .env.example .env
```

**Get Supabase Keys**:
1. In Supabase, go to **Settings → API**
2. Copy **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy **Public/Anon Key** (NOT service_role)
4. Paste into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key-here
   ```

### 4. Create Admin Account

**In Supabase**:
1. Go to **Authentication → Users**
2. Click **Create new user**
3. Enter email: `admin@example.com`
4. Enter password: (something you'll remember)
5. Click **Create user**

### 5. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🎯 Try It Out

### Public Questionnaire
1. Click **Start Answering 💗**
2. Answer a few questions
3. Click **Continue →** for each
4. Review your answers
5. Click **Send My Answers 💗**
6. See success message

### Admin Dashboard
1. Press **Alt + A** (keyboard shortcut)
2. Log in with your admin email and password
3. See dashboard with statistics
4. Click tabs: Responses, Questions, Analytics, Settings
5. Try submitting a public questionnaire again, then view it in Responses

## 📝 Default Questions

The database comes with 14 beautiful questions:
1. What's your name?
2. Can I have your Facebook?
3. What do your friends call you?
4. Favorite thing to do when bored?
5. Favorite music?
6. Favorite food?
7. Coffee or milktea?
8. Stay-at-home or adventurous?
9. What makes you happy?
10. What kind of person do you like?
11. What do you appreciate?
12. Are you interested in someone?
13. What should they know about you?
14. Want to get to know each other more?

All questions are in the database. You can activate/deactivate them from the admin panel.

## 🛠️ Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLogin.tsx          # Login form
│   │   ├── AdminDashboard.tsx      # Main dashboard
│   │   ├── AdminNav.tsx            # Sidebar navigation
│   │   └── pages/
│   │       ├── DashboardHome.tsx   # Dashboard stats
│   │       ├── ResponsesList.tsx   # View responses
│   │       ├── QuestionsList.tsx   # Manage questions
│   │       ├── Analytics.tsx       # Analytics charts
│   │       └── Settings.tsx        # Customize settings
│   ├── questionnaire/
│   │   ├── Landing.tsx             # Landing page
│   │   ├── Question.tsx            # Question display
│   │   ├── Review.tsx              # Review answers
│   │   └── Success.tsx             # Success screen
│   └── ui/
│       ├── Button.tsx              # Reusable button
│       ├── Input.tsx               # Text input
│       └── Textarea.tsx            # Text area
├── pages/
│   └── Questionnaire.tsx           # Main questionnaire logic
├── hooks/
│   └── useQuestionnaireStore.ts    # State management
├── lib/
│   └── supabase.ts                 # Supabase client
├── types/
│   └── index.ts                    # TypeScript types
├── utils/
│   ├── cn.ts                       # Class name helper
│   └── helpers.ts                  # Utility functions
└── App.tsx                         # Main app routing
```

## 🎨 Customization Ideas

**Change Colors**:
- Search for `rose-` in components
- Replace with `pink-`, `purple-`, or `blue-`

**Change Text**:
- Go to admin Settings
- Update Website Title, Subtitle, Messages

**Add More Questions**:
- In Supabase SQL Editor
- Insert into `questions` table
- Will appear immediately in questionnaire

**Change Fonts**:
- Edit Tailwind config in `vite.config.ts`
- Add custom font-family

## ❓ Common Questions

**Q: Can users see other people's responses?**
A: No! RLS policies prevent this. Each session is isolated.

**Q: What happens if I delete a question?**
A: It's removed immediately. Existing responses keep their answers.

**Q: Can I disable the questionnaire temporarily?**
A: Yes! Go to Admin → Settings → Questionnaire Status

**Q: How do I backup my data?**
A: Supabase auto-backs up daily. Go to Settings → Backups

**Q: Can multiple people fill it out?**
A: Yes! Each person gets a unique anonymous session ID.

## 🔗 Important Links

- Supabase Dashboard: https://app.supabase.com
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- TypeScript Docs: https://www.typescriptlang.org

## 📱 Testing on Mobile

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I            # Linux
ipconfig              # Windows (look for IPv4)

# Start dev server on all interfaces
npm run dev -- --host

# Visit on mobile: http://YOUR-IP:5173
```

## 🚀 Deploy When Ready

See `DEPLOYMENT.md` for step-by-step Vercel deployment.

---

**You're all set! Start exploring! 💗**
