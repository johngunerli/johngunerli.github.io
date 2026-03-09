# Cloudflare Pages Setup Instructions

## Setting up your API Key in Cloudflare Pages

1. **Push your code to GitHub** (if you haven't already)
   ```bash
   git add .
   git commit -m "Add Cloudflare Function for API proxy"
   git push
   ```

2. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com/
   - Click on "Workers & Pages" in the sidebar

3. **Create a new Pages project** (or select your existing one)
   - Click "Create application" → "Pages"
   - Connect to your GitHub repository
   - Select your `johngunerli.github.io` repository

4. **Configure Build Settings**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/` (root)

5. **Add Environment Variable**
   - Go to your Pages project settings
   - Click "Settings" → "Environment variables"
   - Add a new variable:
     - **Variable name**: `OPENROUTER_API_KEY`
     - **Value**: Your actual OpenRouter API key (starts with `sk-or-v1-...`)
     - **Environment**: Production (and Preview if you want)
   - Click "Save"

6. **Deploy**
   - Click "Save and Deploy"
   - Your site will be available at `your-project.pages.dev`

## How it works

- Your frontend calls `/api/chat` (your Cloudflare Function)
- The Cloudflare Function uses your secret `OPENROUTER_API_KEY` from environment variables
- The function proxies the request to OpenRouter
- Your API key is never exposed to the browser ✅

## Testing locally

To test locally with Cloudflare's development server:

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Create a `.dev.vars` file (this is git-ignored):
   ```
   OPENROUTER_API_KEY=your-actual-key-here
   ```

3. Run locally:
   ```bash
   wrangler pages dev .
   ```

Your site will be available at `http://localhost:8788`

## Notes

- The `functions/` directory is automatically detected by Cloudflare Pages
- Environment variables are only available server-side (in the function)
- Your API key is secure and never sent to the client browser
