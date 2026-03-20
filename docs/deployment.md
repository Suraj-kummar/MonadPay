# Deployment Guide

## Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Set `Build Command`: `npm run build`
3. Set `Output Directory`: `dist`
4. Deploy!

Vercel config is already included in `vercel.json`.

## Manual / Static Host
```bash
npm run build
# Upload the dist/ folder to any static host (Netlify, GitHub Pages, etc)
```

## Environment Variables
Copy `.env.example` to `.env` and fill in your values before building.
