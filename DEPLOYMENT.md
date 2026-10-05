# Deployment Guide

## Quick Start Deployment

### Step 1: Prepare Your Code

```bash
# Build the project
npm run build

# Test the build locally
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for initialization (2-3 minutes)

### Step 3: Setup Database

1. In Supabase, go to **SQL Editor**
2. Create new query
3. Copy entire `supabase/schema.sql` file content
4. Paste and execute

Once complete, you'll have:
- 4 tables with proper structure
- Default questions
- RLS policies configured
- Indexes for performance

### Step 4: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy and save:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Public/Anon Key** (anon, not service_role)

⚠️ **IMPORTANT**: Never share the `service_role` key. Only use `anon` key in frontend.

### Step 5: Deploy to Vercel

#### Option A: GitHub + Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. In Environment Variables, add:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
6. Click "Deploy"

Vercel will:
- Run `npm install`
- Run `npm run build`
- Deploy the `dist` folder

Your app is live!

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables when prompted
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### Step 6: Create Admin User

1. Go to your Vercel deployment URL
2. In your Supabase project, go to **Authentication** → **Users**
3. Click "Create new user"
4. Enter email and password
5. User is ready to use

On your live app:
- Press **Alt + A** to access admin login
- Log in with the credentials you created

## ✅ Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Public questionnaire works
- [ ] Can submit responses
- [ ] Admin login works (Alt + A)
- [ ] Dashboard shows statistics
- [ ] Can view responses
- [ ] Can manage questions
- [ ] Settings can be saved
- [ ] CSV export works
- [ ] Responsive on mobile

## 🔍 Testing After Deployment

### Test Public Questionnaire
1. Visit your live URL
2. Click "Start Answering 💗"
3. Answer all questions
4. Review and submit
5. See success page

### Test Admin Dashboard
1. Press **Alt + A**
2. Log in with admin credentials
3. Check dashboard statistics
4. Verify new response appears in Responses list

### Test Mobile
1. Open on mobile phone
2. Verify all buttons are clickable
3. Verify text is readable
4. Verify no horizontal scrolling

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Verify `VITE_SUPABASE_URL` is set in Vercel
- Verify `VITE_SUPABASE_ANON_KEY` is set in Vercel
- Redeploy after adding variables

### "Connection refused"
- Verify Supabase project is active
- Verify database is running
- Check internet connection

### "RLS policy violation"
- Verify `schema.sql` was fully executed
- Check Supabase SQL Editor for errors
- Rerun schema.sql from scratch if needed

### Admin login not working
- Verify user was created in Supabase Auth
- Verify password is correct
- Check browser console for errors

### Responses not saving
- Check browser DevTools Network tab
- Verify Supabase connection
- Check RLS policies in Supabase

## 📊 Monitoring

### View Live Logs
In Vercel Dashboard:
1. Select your project
2. Click "Deployments"
3. Click latest deployment
4. Click "Function Logs"

### Monitor Supabase
1. Go to your Supabase project
2. View **Statistics** for usage
3. Check **Database** health
4. Monitor **API Usage**

## 🚀 Updates and Changes

### Update Questions
1. Go to admin dashboard
2. Modify in Questions section
3. Changes live immediately

### Update Styling
1. Edit Tailwind classes in components
2. Run `npm run build`
3. Deploy new build
4. Changes appear instantly

### Database Backups
1. Supabase auto-backs up daily
2. Go to **Settings** → **Backups**
3. Can restore from snapshots

## 🔐 Security Checklist

- [ ] Only `anon` key in environment variables
- [ ] Service role key hidden
- [ ] RLS policies enabled
- [ ] Admin users strong passwords
- [ ] Vercel environment variables not logged
- [ ] No sensitive data in console
- [ ] HTTPS enforced (automatic on Vercel)

## 💾 Scaling Considerations

### For 1,000+ Monthly Users
- Monitor Supabase usage
- Consider upgrading Supabase plan
- Enable query optimization
- Add database indexes

### For 10,000+ Monthly Users
- Enable Supabase pro plan
- Consider CDN for images
- Implement response pagination
- Monitor performance metrics

## 🎉 Success!

Your app is now live! Share the link and watch responses come in.

### Share Your App
- Post link on social media
- Share in messaging apps
- Include in emails
- Add to website

### Monitor Activity
- Check dashboard for new responses
- Analyze patterns in responses
- Customize questions based on feedback

## Support

- Supabase Issues: https://supabase.com/docs
- Vercel Issues: https://vercel.com/support
- React Issues: https://react.dev/
- Tailwind Issues: https://tailwindcss.com/docs

---

Your beautiful questionnaire app is ready to help you get to know someone special! 💗
