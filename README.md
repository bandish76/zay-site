# Zay — deployable site

The new Zay homepage and `/brands` page, ready to deploy.
Built with React + Vite + Tailwind + Framer Motion.

✅ Formspree waitlist already wired (form ID: `maqvrzyk`)
✅ All copy, swipe demo, animations, referral mechanic ready
✅ Mobile responsive
✅ Custom favicon

---

## Deploy to Vercel — 15 minutes

### Quickest route: terminal deploy

You need Node.js installed. If you don't have it, grab the LTS version from [nodejs.org](https://nodejs.org).

1. Open Terminal (Mac: Cmd+Space → "Terminal") or Command Prompt (Windows: Win → "cmd")
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate into the unzipped folder. Easiest way: type `cd ` (with a space) then drag the `zay-site` folder into the terminal window. Hit Enter.
4. Deploy:
   ```
   vercel
   ```
5. Answer the prompts. Hit Enter to accept the defaults on every one:
   - Set up and deploy? → **Y**
   - Which scope? → Enter
   - Link to existing project? → **N**
   - Project name? → Enter
   - Code directory? → Enter
   - Modify settings? → **N**
6. Wait ~60 seconds. You'll get a URL like `https://zay-site-abc123.vercel.app`. Open it. Your site is live.

### Alternative: drag and drop

1. Go to [vercel.com/new](https://vercel.com/new) and sign up with Google
2. Look for a drag-and-drop area (Vercel's UI shifts but they always have one)
3. Drag the `zay-site` folder in. They auto-detect Vite. Deploy.

---

## After deploying

### Test before pointing the domain

Open the Vercel URL. Sign up with your own email. Verify:
- Success screen shows with points stack and invite link
- Email lands in your inbox from Formspree within 1 minute
- Try the swipe demo, the "for brands" nav, mobile view
- Click your invite link in an incognito window. Should show the "a friend sent you" banner

### Point zay.xyz at the new site

1. In your Vercel project: Settings → Domains → add `zay.xyz`
2. Vercel shows DNS records (A and CNAME)
3. Log in to wherever zay.xyz is registered (Namecheap / GoDaddy / Cloudflare / etc)
4. Delete existing A and CNAME records for `@` and `www`
5. Add the records Vercel showed you
6. Wait 5 to 30 min for DNS propagation. zay.xyz now loads the new site.

---

## Common edits you might want to make yourself

All in `src/App.jsx`:

| What | Find this text | What to change |
|------|----------------|---------------|
| Hero headline | `side hustle` | Replace with new headline |
| Testimonials | `lewis` / `maya` / `sophia` | Edit names, quotes, locations |
| Drop cards | `Aimé Leon Dore` | Edit brand questions in the DROPS array |
| Welcome points | `WELCOME_POINTS = 100` | Change the number |
| Brands page hero | `what gen z actually thinks.` | Replace headline |
| Brands FAQ | search for `faqs = [` | Edit the array |

After editing, redeploy by running `vercel --prod` from the terminal in the project folder.

---

## Local preview before pushing

To see the site running on your laptop before deploying:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Saves auto-reload.

---

## Honest caveats to remember

1. **Referral tracking is server-side.** Every signup gets logged to Formspree with the `referredBy` field. You'll see who invited whom in your Formspree dashboard. The "X friends joined" counter is intentionally NOT shown on user success screens because cross-device tracking would require a real backend. At launch day, export Formspree as CSV and credit referral points based on real data.

2. **Formspree free plan is 50 submissions/month.** If campus push goes well, you'll hit that within a few days. Two options:
   - Upgrade to Formspree Bronze ($10/mo, unlimited)
   - Come back to me and I'll swap the endpoint to a Google Sheet webhook (free, unlimited)

3. **No OG share image yet.** When zay.xyz is shared on WhatsApp / X / LinkedIn, it'll show as plain text. To fix: make a 1200x630 PNG (use Canva or the deck cover), drop it at `public/og.png`, then uncomment two lines in `index.html` (look for the TODO).

---

## If something breaks

- White screen on the live site → Vercel dashboard → Deployments → click the failed one → read the error log
- Form submits but no email → check Formspree dashboard (submissions appear there too). If empty, the form might need email verification. Check your inbox for a Formspree confirmation
- DNS not propagating → it takes up to 30 min, sometimes longer. Check status in Vercel → Domains
- Anything else → come back to the chat with what you're seeing

---

Now go ship it.
