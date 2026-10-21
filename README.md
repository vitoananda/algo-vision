# AlgoVision • LeetCode Algorithm Visualizer & Plain Words Translator

A 100% free, interactive web application designed to help developers ace technical coding interviews by transforming algorithm code into animated visualizations and plain English conceptual explanations.

## Features
- **100% Free & In-Browser**: Zero external paid APIs, zero backend servers. All execution traces and translations run client-side.
- **Top Live-Coding LeetCode Problems Pre-Loaded**:
  1. **Two Sum** (Hash Map complement lookup)
  2. **Best Time to Buy & Sell Stock** (Greedy single-pass tracking)
  3. **Valid Palindrome** (Two Pointers inward scan)
  4. **Container With Most Water** (Two Pointers greedy wall search)
  5. **Longest Substring Without Repeating Characters** (Sliding Window dynamic shrink & expand)
  6. **Valid Parentheses** (Stack LIFO bracket matching)
  7. **Binary Search** (Logarithmic search space halving)
- **Plain-English Translation**:
  - Explains what the code is doing in layman's terms at each exact line.
  - Explains the **intuition & reasoning** behind every pointer shift or stack operation.
  - Highlights the **invariant / rule** being preserved.
- **Interactive Time-Travel Stepper**:
  - Play, Pause, Step Forward, Step Back, Replay.
  - Scrub through the timeline with a slider.
  - Adjustable playback speed (0.5x, 1x, 2x, 5x).
- **Custom Inputs**:
  - Test custom arrays, strings, and targets directly within the app.
- **Vercel-Ready**:
  - Standard Vite + React + TypeScript setup ready for instant one-click deployment to Vercel, Cloudflare Pages, or GitHub Pages.

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

## Vercel Deployment
To deploy to Vercel:
1. Push this folder to a GitHub repository.
2. In Vercel, select **Add New Project** and import the repository.
3. Framework Preset: **Vite** (detected automatically).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.
