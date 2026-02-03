# F1 Racing Landing Page - Deployment & Optimization Guide

## Project Overview
This is a Next.js 14 application featuring a high-performance 60fps canvas animation of an F1 car, synchronized with scroll. It uses Framer Motion for UI animations and Tailwind CSS for styling.

## 1. Local Development & Troubleshooting

### Installation Issues
If you encounter `code ENOSPC` or "No space left on device" errors during installation:
1. **Check Disk Space**: Ensure you have at least 1GB of free space.
2. **Clear Cache**: Run `npm cache clean --force`.
3. **Delete node_modules**: If it exists, delete `d:\Myprojects 2\f1car-zip\node_modules` and `package-lock.json`.
4. **Retry Install**: Run `npm install` again.

### Running the App
Once dependencies are installed:
```bash
npm run dev
```
Access the site at `http://localhost:3000`.

## 2. Vercel Deployment (Recommended)

Vercel is the creators of Next.js and provides the best hosting performance.

### Steps:
1. **Push to GitHub/GitLab**:
   - Initialize git: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Push to your repository.

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository.

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next` (default)
   - **Environment Variables**: None required for this static animation.

4. **Deploy**: Click "Deploy". Vercel will build and host your site globally.

## 3. Performance Optimization

### Image Optimization
The project uses raw JPEG sequences for the canvas animation.
- **Current Setup**: Images are in `public/f1car-zip/`.
- **Optimization Tip**: Convert JPEGs to **WebP** format for smaller file size without quality loss.
  - You can use a tool like `imagemin` or an online converter.
  - Update `lib/frameLoader.ts` to look for `.webp` extension if you do this.

### Canvas Performance
- **Offscreen Rendering**: The canvas currently scales images on the fly.
- **Memory**: The app preloads all 40 frames (~2-3MB total). This is efficient for desktop and most mobile devices.
- **Debouncing**: Scroll events are throttled to 60fps to prevent main-thread blocking.

## 4. Lighthouse & Core Web Vitals

To achieve a score of 90+:
- **LCP (Largest Contentful Paint)**: The canvas is the LCP element. Preloading is implemented to minimize delay.
- **CLS (Cumulative Layout Shift)**: The valid HTML structure ensures no layout shifts.
- **FID (First Input Delay)**: React's hydration is optimized by Next.js.

## 5. Mobile Responsiveness
- The canvas uses `window.innerWidth` and `window.innerHeight` to resize dynamically.
- `object-fit: cover` logic is implemented manually in the canvas draw function to ensure the car always fills the screen without stretching.
