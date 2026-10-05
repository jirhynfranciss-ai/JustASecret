# Can I Get to Know You? 💗

A beautiful, romantic, and interactive questionnaire web application built with Vite, React, TypeScript, and Supabase.

## 🌟 Features

### Public Questionnaire
- **No Login Required**: Users can immediately start answering questions
- **Romantic Design**: Soft gradients, elegant typography, and beautiful animations
- **One Question at a Time**: Conversational experience, not a boring form
- **Progress Tracking**: Beautiful progress indicators
- **Review & Submit**: Users can review their answers before submission
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Admin Dashboard
- **Secure Login**: Supabase Authentication
- **Hidden Access**: Press `Alt + A` or visit `/admin`
- **Dashboard**: View response statistics and analytics
- **Response Management**: View, search, filter, and delete responses
- **Question Management**: Create, edit, activate/deactivate questions
- **Analytics**: Track submissions and response trends
- **Settings**: Customize website title, messages, and questionnaire settings
- **CSV Export**: Export responses for analysis

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Deployment**: Vercel

## 📋 Setup Instructions

### 1. Prerequisites
- Node.js 18+
- Supabase account (free tier available at supabase.com)

### 2. Local Development

#### Clone and Install
```bash
npm install
```

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

#### Setup Database
1. Go to SQL Editor in your Supabase project
2. Create a new query
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Run the query

#### Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon` public key → `VITE_SUPABASE_ANON_KEY`
3. Update `.env` with your credentials

#### Create Admin User
1. In Supabase, go to Authentication → Users
2. Click "Create new user"
3. Enter an email and password
4. The account will be ready for admin login

#### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Access Admin Panel
- Press `Alt + A` while on the public site
- Or go to `http://localhost:5173/admin`
- Log in with the credentials you created in Supabase

### 3. Deployment to Vercel

#### Prepare for Deployment
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase public anon key
5. Deploy

#### Post-Deployment
- Your app will be live at `https://your-project.vercel.app`
- Admin login works with the Supabase users you created
- All data is stored in your Supabase database

## 🎨 Customization

### Change Website Title
1. Go to Admin Dashboard
2. Click Settings
3. Update "Website Title" and other messages
4. Save Changes

### Add More Questions
1. Go to Admin Dashboard
2. Click Questions
3. Toggle Active/Inactive or delete questions
4. Changes appear immediately for users

### Customize Colors
Edit the color values in components (currently using rose/pink theme). Look for `rose-*` and `lavender-*` classes in components.

## 📊 Database Schema

### Tables
- **questions**: Questionnaire questions
- **responses**: Submitted questionnaires (session-based)
- **answers**: Individual answers to questions
- **admin_settings**: Application configuration

### Row Level Security
- Public users: Can only read active questions and submit answers
- Authenticated admins: Full access to all data and settings
- Service role: Never exposed in frontend code

## 🔐 Security

- **No Passwords in Code**: All credentials in environment variables
- **RLS Enabled**: PostgreSQL Row Level Security protects data
- **No Service Key Exposure**: Only public anon key used in frontend
- **Admin-Only Areas**: Protected by Supabase Auth

## 📱 Responsive Design

The entire application is optimized for:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## ♿ Accessibility

- Keyboard navigation support
- Proper form labels and ARIA attributes
- Readable color contrasts
- Focus states for all interactive elements
- Respects `prefers-reduced-motion`

## 🎵 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📝 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── questionnaire/   # Public questionnaire components
│   └── ui/              # Reusable UI components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Supabase client setup
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── App.tsx              # Main app component
└── index.css            # Global styles
```

## 🚀 Tips

- Use the admin panel to customize questions before sharing the link
- Monitor responses and analytics in real-time
- Export data regularly for backup and analysis
- Customize colors and messages to match your style

## 💡 Keyboard Shortcuts

- **Alt + A**: Toggle between public and admin areas
- **Tab**: Navigate through form inputs
- **Enter**: Submit forms (when focused on button)

## 🤝 Support

For issues with Supabase, visit [supabase.com/docs](https://supabase.com/docs)

For Vite documentation, visit [vitejs.dev](https://vitejs.dev)

For Tailwind CSS docs, visit [tailwindcss.com](https://tailwindcss.com)

## 📄 License

This project is open source and available under the MIT License.

---

**Made with 💗 for beautiful conversations**
