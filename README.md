# Property Portal Home – Static Clone

A static, responsive homepage clone built for educational use. Includes search hero, featured listings, guides, and a prominent multi-surface “Call Sales” enquiry experience:

- Floating right-side form (desktop/tablet)
- Hero and nav CTAs
- Mobile sticky bottom bar
- Dialog/overlay on all breakpoints
- Webhook submission to n8n with validation + toasts

## Local Preview

```
cd propertyguru-home-clone
python3 -m http.server
# open http://localhost:8000
```

## Deploy to Netlify

## Deploy to GitHub Pages (free, quick)

This repo is already configured to deploy to GitHub Pages via Actions.

- On push to `main`, GitHub will build and publish the site.
- The URL will be: `https://adelphos-tech.github.io/property-Guru/`

If it doesn’t appear after a minute:
- Go to GitHub → Repo → Settings → Pages → Ensure “Build and deployment” is set to “GitHub Actions”.

- Drag and drop this folder at https://app.netlify.com/drop
- Or connect a Git repo; `netlify.toml` already sets `publish = "."`

## Git Setup

Initialize and commit:

```
cd propertyguru-home-clone
git init
git add .
git commit -m "Initial site: homepage clone + Call Sales"
```

Add remote and push (replace with your repo URL):

```
git branch -M main
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

## Webhook

The Call Sales forms POST JSON to your n8n webhook:

```
https://dsadcdc.app.n8n.cloud/webhook/e6ca4a69-d3bd-433a-b3a6-9f36f1ab9bd6
```

Payload includes name, E.164 phone, question, country code, timestamp, page, referrer, userAgent, language, screen, tz offset, and UTM params.

## Notes

- No server code; static HTML/CSS/JS only.
- If CORS blocks the webhook in production, add CORS on n8n or proxy via Netlify Functions.
