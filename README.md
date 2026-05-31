# NYWASA — Coming Soon Landing Page

Premium personalized gifting brand. Launching soon.

---

## 🚀 GitHub Pages Deployment

1. Create a new GitHub repository (e.g. `nywasa-coming-soon`)
2. Upload `index.html`, `style.css`, `script.js` to the root
3. Go to **Settings → Pages → Source → Deploy from branch → main**
4. Your site will be live at `https://yourusername.github.io/nywasa-coming-soon`
5. For a custom domain (`nywasa.com`), add a `CNAME` file containing just your domain name

---

## ✏️ Customization Checklist

### Background Image
In `style.css`, find the `.hero` selector and replace:
```css
background-image: url('YOUR_IMAGE_URL_HERE');
```
Free high-quality images: [Unsplash](https://unsplash.com) — search "luxury gift", "velvet texture", "bokeh gold ribbon"

### Launch Date
In `script.js`, line ~20:
```js
const LAUNCH_DATE = new Date('2026-01-15T00:00:00').getTime();
```
Change to your real launch date.

### Email Collection (Free — Formspree)
1. Go to [formspree.io](https://formspree.io) → sign up free
2. Create a new form → copy the Form ID (e.g. `xpzgkqrd`)
3. In `script.js`, replace `'YOUR_FORM_ID'`:
```js
await submitViaFormspree(email, 'xpzgkqrd');
```
Formspree free tier: **50 submissions/month**, emails to your inbox, CSV export.
Connect to Mailchimp / ConvertKit directly from the Formspree dashboard.

### Social Media URLs
In `index.html`, find the social links section and replace the placeholder URLs:
```html
href="https://instagram.com/nywasa"  → your real Instagram
href="https://tiktok.com/@nywasa"    → your real TikTok
href="https://pinterest.com/nywasa"  → your real Pinterest
href="https://facebook.com/nywasa"   → your real Facebook
```

### Favicon
Generate a favicon set at [realfavicongenerator.net](https://realfavicongenerator.net) using your logo,
then drop the files in the root folder alongside `index.html`.

### OG Image (Social Sharing Preview)
Create a `1200×630px` image branded with NYWASA.
Upload it to your repo as `og-image.jpg` and update the URLs in `index.html`:
```html
<meta property="og:image" content="https://nywasa.com/og-image.jpg" />
```

---

## 📦 File Structure

```
/
├── index.html       ← Main page
├── style.css        ← All styles
├── script.js        ← Countdown + email logic
├── favicon.svg      ← Add your favicon
├── og-image.jpg     ← Add your social preview image
└── README.md
```

---

## 🆓 Free Tools Used / Recommended

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| [Formspree](https://formspree.io) | Email collection | 50/month |
| [EmailJS](https://emailjs.com) | Email collection alt | 200/month |
| [GitHub Pages](https://pages.github.com) | Hosting | Free |
| [Unsplash](https://unsplash.com) | Background photos | Free |
| [Mailchimp](https://mailchimp.com) | Email marketing | 500 contacts free |

---

*Crafted with intention.*
