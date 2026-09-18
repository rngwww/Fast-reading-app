# TACHYON - High-Velocity RSVP Reader

**Read faster than thought.**

TACHYON is a mobile-first Progressive Web App (PWA) designed to dramatically increase your reading speed through Rapid Serial Visual Presentation (RSVP). By perfectly locking words onto an Optimal Recognition Point (ORP), TACHYON eliminates eye saccades and reduces subvocalization.

## Project Structure

```text
Fast-reading-app/
├── index.html              # Core app container with PWA meta and Apple tags
├── manifest.json           # PWA standalone configuration
├── sw.js                   # Service Worker for full offline caching
├── assets/
│   ├── css/
│   │   └── style.css       # Obsidian & PS3 XMB styling, animations, safe-area CSS
│   ├── js/
│   │   ├── app.js          # Main UI controller, routing, and event delegation
│   │   ├── rsvp.js         # Core RSVP engine, ORP alignment, and timer loop
│   │   ├── audio.js        # Web Audio API synthetic click engine
│   │   └── storage.js      # LocalStorage manager for library and playback state
│   ├── icons/
│   │   ├── icon-192.png    # PWA icon
│   │   ├── icon-512.png    # PWA icon
│   │   └── apple-touch-icon.png # iOS home screen icon (180x180)
│   └── videos/
│       └── demo.mp4        # RSVP visual demonstration video
└── README.md               # Documentation and GitHub Pages live setup guide
```

## Features
- **PS3 XMB Aesthetics**: Obsidian dark mode, frosted glass elements, ambient sine waves, and synthetic Web Audio clicks.
- **PWA / iOS Optimized**: Add to your home screen for a completely standalone, offline, 60fps experience that beautifully maps around notches and dynamic islands.
- **ORP Focal Engine**: Every word is mathematically centered based on its length.
- **Dynamic Pacing**: The engine slows down naturally at commas, periods, and very long words.
- **State Persistence**: Closes in the middle of a sentence? Your exact position, volume, and text are saved locally.

## Deployment

This repository is ready to be deployed statically. 
We recommend **GitHub Pages**, **Vercel**, or **Netlify**. 

Simply point the build directory to the root `/` and serve.

*Note: `demo.mp4` and PNG icons are currently placeholders and should be swapped out before production marketing.*
