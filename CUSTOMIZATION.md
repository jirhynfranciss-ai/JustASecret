# 🎨 Customization Guide

This guide shows you how to customize the questionnaire for your specific needs.

## 🎯 Easiest: Customize in Admin Panel

### Change Website Title
1. Run app and press **Alt + A** to access admin
2. Click **Settings**
3. Update "Website Title" field
4. Click **Save Changes**
5. Refresh public page to see changes ✓

### Change Welcome Message
1. Admin → Settings
2. Update "Welcome Message" field
3. This shows under the title on landing page
4. Save Changes ✓

### Change Final Message
1. Admin → Settings
2. Update "Final Message" field
3. This shows on the success screen
4. Save Changes ✓

### Activate/Deactivate Questions
1. Admin → Questions
2. Click **Active** button to toggle each question
3. Changes appear immediately ✓

### Delete a Question
1. Admin → Questions
2. Click **Delete** button
3. Confirm deletion
4. Question removed permanently ✓

---

## 🎨 Intermediate: Change Colors

### Change Primary Color (Rose to Another)

**Find the color names in these files:**

1. `src/components/questionnaire/Landing.tsx`
2. `src/components/questionnaire/Question.tsx`
3. `src/components/questionnaire/Review.tsx`
4. `src/components/ui/Button.tsx`
5. `src/components/ui/Input.tsx`

**Search for:**
- `rose-` (primary color)
- `lavender-` or `pink-` (secondary colors)

**Replace with your color:**

Available Tailwind colors:
- `red-`, `pink-`, `rose-`, `purple-`, `blue-`, `green-`, `yellow-`, etc.

**Example:**
```tsx
// Before
className="bg-gradient-to-r from-rose-400 to-rose-500"

// After (to use blue)
className="bg-gradient-to-r from-blue-400 to-blue-500"
```

### Apply Colors Systematically

For a complete color change:

1. In `src/components/questionnaire/Landing.tsx`:
   - Change `from-rose-50` to `from-blue-50`
   - Change `to-lavender-50` to `to-blue-50`
   - Change `text-rose-500` to `text-blue-500`
   - Update all rose/pink mentions

2. In `src/components/ui/Button.tsx`:
   - Change primary variant colors
   - Update ring colors

3. In `src/components/ui/Input.tsx`:
   - Change border colors
   - Update focus colors

4. Rebuild: `npm run build`

---

## 📝 Adding More Questions

### Add Question in Database

1. Go to Supabase
2. Click **SQL Editor**
3. Run this SQL (customize the values):

```sql
INSERT INTO questions (question_text, question_type, options, is_required, is_active, display_order)
VALUES (
  'Your question here?',
  'SINGLE_CHOICE',
  '["Option 1", "Option 2", "Option 3"]',
  true,
  true,
  15
);
```

**Question Types:**
- `TEXT`: Single line input
- `LONG_TEXT`: Multi-line textarea
- `YES_NO`: Yes/No buttons
- `SINGLE_CHOICE`: Radio buttons (needs options)
- `MULTIPLE_CHOICE`: Checkboxes (needs options)

**For TEXT/LONG_TEXT questions:**
```sql
INSERT INTO questions (question_text, question_type, is_required, is_active, display_order)
VALUES (
  'Your question?',
  'TEXT',
  true,
  true,
  15
);
```

**For choice questions with options:**
```sql
INSERT INTO questions (question_text, question_type, options, is_required, is_active, display_order)
VALUES (
  'Which do you prefer?',
  'SINGLE_CHOICE',
  '["Option A 🎵", "Option B 🎮", "Option C 📚"]',
  true,
  true,
  15
);
```

### Or Add Through Admin (When Feature is Added)
Currently you must use SQL, but a form-based admin will be added in the future.

---

## 🎯 Changing Question Introductions

The conversational phrases like "Let's start simple..." are in:

**File:** `src/utils/helpers.ts`

**Function:** `getConversationalIntro(index)`

**Current phrases:**
```typescript
const intros = [
  "Let's start with something simple... 🌷",
  "Okay, now I'm curious... 👀",
  "I really want to know this one... 💭",
  "A little more personal this time... 🤍",
  "Okay... be honest with me. 😳",
  "We're getting to the interesting questions now... 💫",
  "Just a few more... promise. 💗",
  "Almost there! 🎉",
  "Getting closer... ✨",
  "Tell me more... 🌟",
  "This is important to me... 💕",
  "Let's go deeper... 🌙",
  "One more thing I want to know... 💌",
];
```

**To customize:**
1. Open `src/utils/helpers.ts`
2. Edit the `intros` array
3. Keep the same number of items or add more
4. Rebuild with `npm run build`

---

## ✍️ Customize Template Questions

### Change Default Questions

**File:** `supabase/schema.sql`

**Find this section:**
```sql
INSERT INTO questions (question_text, question_type, ...) VALUES
('What''s your name?', 'TEXT', true, 1),
('Can I have your Facebook?', 'YES_NO', false, 2),
...
```

**Edit the values:**
- First value: question text
- Second value: question type
- Third value: is_required (true/false)
- Last value: display_order

**Then re-run the schema in Supabase SQL Editor.**

---

## 🎨 Change Typography

### Change Fonts

**File:** `src/index.css`

Add at the top:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600;700&display=swap');

@layer base {
  body {
    @apply font-poppins;
  }
  
  h1, h2, h3 {
    @apply font-playfair;
  }
}
```

Then update Tailwind config in `vite.config.ts` to include these fonts.

---

## 🌐 Change Website Theme

### Change Landing Page Layout

**File:** `src/components/questionnaire/Landing.tsx`

**Customize:**
- `<h1>` - Main title
- `<p>` - Subtitle and messages
- Colors: Replace `rose-`, `lavender-` with your colors
- Icon: Change emoji and animations

### Change Success Screen

**File:** `src/components/questionnaire/Success.tsx`

**Customize:**
- Messages
- Emoji celebration
- Button text
- Colors

### Change Admin Layout

**File:** `src/components/admin/AdminNav.tsx`

**Customize:**
- Navigation items
- Colors
- Icons
- Labels

---

## 🔧 Advanced: Multiple Choice Behavior

### Add Conditional Logic

For example: Show "What's your Facebook?" only if they want to share:

**Current setup in schema.sql:**
```sql
conditional_question_id UUID REFERENCES questions(id),
conditional_value TEXT,
```

**To enable conditional questions:**

In `src/pages/Questionnaire.tsx`, add logic like:

```typescript
const shouldShowQuestion = (question: Question) => {
  if (!question.conditional_question_id) return true;
  
  const conditionAnswer = answers[question.conditional_question_id];
  return conditionAnswer === question.conditional_value;
};
```

Then filter questions when displaying.

---

## 📱 Customize Mobile Layout

### Adjust Touch Targets

In `src/components/ui/Button.tsx`, change button padding:
```tsx
// Currently: px-6 py-2.5 (for md)
// For larger: px-8 py-4 (for mobile)
```

### Adjust Font Sizes

In `src/components/questionnaire/Question.tsx`:
```tsx
// Change heading size
<h2 className="text-2xl md:text-3xl">  // Adjust these numbers
```

---

## 🔐 Change Admin Access

### Change Keyboard Shortcut

**File:** `src/App.tsx`

**Find:**
```typescript
if (e.altKey && e.key.toLowerCase() === 'a')
```

**Change 'a' to your preferred letter:**
```typescript
if (e.altKey && e.key.toLowerCase() === 'x')  // Now Alt+X
```

### Change Admin Route

Currently: `/admin`

To change, modify `src/App.tsx` routing logic.

---

## 💾 Export & Backup

### Export CSV

1. Admin → Responses
2. Click **Export CSV** button
3. Downloaded file contains all responses

### Export Individual Response

1. Admin → Responses
2. Select a response
3. Copy text or screenshot

### Database Backup

1. Go to Supabase
2. Settings → Backups
3. Create manual backup
4. Or download from backup list

---

## 🚀 Performance Customization

### Optimize Images

If you add images:
```bash
# Compress before adding
npm install sharp-cli
sharp -i image.jpg -o image-small.jpg -w 600
```

### Minimize Build Size

```bash
# Check current size
npm run build

# Already optimized, but you can:
# 1. Remove unused Tailwind utilities
# 2. Tree-shake unused code
# 3. Lazy load components (advanced)
```

---

## 🎨 Design Customization Examples

### Example 1: Purple Theme

Replace all instances:
- `rose-` → `purple-`
- `pink-` → `violet-`
- `lavender-` → `indigo-`

Then rebuild.

### Example 2: Green Theme

Replace all instances:
- `rose-` → `green-`
- `pink-` → `emerald-`
- `lavender-` → `teal-`

Then rebuild.

### Example 3: Blue Theme

Replace all instances:
- `rose-` → `blue-`
- `pink-` → `cyan-`
- `lavender-` → `sky-`

Then rebuild.

---

## 📝 Add Custom Questions

### Quick Add (Admin Panel)

1. Manually insert via Supabase SQL Editor
2. Or wait for form-based admin creation

### SQL Example

```sql
-- Add a custom question
INSERT INTO questions (
  question_text,
  question_type,
  options,
  is_required,
  is_active,
  display_order
) VALUES (
  'What''s your favorite season? 🌸',
  'SINGLE_CHOICE',
  '["Spring 🌸", "Summer ☀️", "Fall 🍂", "Winter ❄️"]',
  true,
  true,
  15
);
```

---

## 🔄 Update After Changes

**After editing code:**
```bash
npm run build
```

**After database changes:**
- Changes are immediate (no rebuild needed)
- Public sees new questions instantly

---

## ⚠️ Important Notes

### Don't Edit While Live
If deployed to Vercel:
1. Test changes locally first
2. Run `npm run build` to verify
3. Then push to GitHub
4. Vercel auto-deploys

### Keep Backups
Before making changes:
```bash
# Backup your code
git commit -m "Before customization"

# Backup Supabase
- Manual backup in Supabase
```

### Semantic HTML
When customizing HTML:
- Keep semantic elements
- Don't remove labels
- Keep accessible structure

---

## 🎓 Learning Resources

- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **React Hooks**: https://react.dev/reference/react/hooks
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase SQL**: https://supabase.com/docs/guides/database

---

## 🆘 Troubleshooting Customization

### "Build fails after changes"
```bash
# Check for TypeScript errors
npm run build

# Read error message carefully
# Fix the issue and try again
```

### "Changes don't appear"
```bash
# Clear browser cache
Ctrl+Shift+Delete (or Cmd+Shift+Delete)

# Rebuild project
npm run build

# Restart dev server
npm run dev
```

### "Colors look different"
- Check browser CSS support
- Different browsers may render colors slightly differently
- Test in multiple browsers

### "Mobile layout broken"
- Check responsive classes: `md:`, `lg:`
- Test with device inspector (F12)
- Ensure touch targets are large enough

---

## 📝 Common Customizations Checklist

- [ ] Change website title (Admin Settings)
- [ ] Change welcome message (Admin Settings)
- [ ] Change final message (Admin Settings)
- [ ] Customize color scheme
- [ ] Add custom questions
- [ ] Change question introductions
- [ ] Modify admin access method
- [ ] Add custom fonts
- [ ] Optimize mobile layout
- [ ] Deploy changes

---

**Start with admin customizations (Settings, Questions) - no code needed!**

For code customizations, always test locally with `npm run dev` before deploying.

---

Made with 💗
