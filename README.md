# Our Love Story

A personal, responsive love story built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React. All dates, names, messages, and photos are examples until you personalize them.

## Run locally

```sh
npm install
npm run dev
```

## Make it yours

Edit `src/config/loveStory.ts` to replace your names, dates, timeline, memories, images, romantic messages, letters, and music settings. Use dates in `YYYY-MM-DD` format. Dates use the visitor's local time zone. February 29 birthdays are observed on February 28 in non-leap years.

Put photographs in `public/photos/` and use paths such as `/photos/first-date.jpg` in the configuration. The initial Unsplash photos and Google Fonts require internet. Broken photos display an accessible fallback.

Add a personal or licensed song as `public/music/our-song.mp3`. No audio is bundled by default. Music starts only after a click on Open Our Story or the play control. Missing audio never interrupts the story. Set `music.enabled` to `false` to remove music controls.

The gallery supports Escape, left/right arrow keys, next/previous controls, and native dialog focus trapping. Animations respect reduced-motion preferences. The main letter has a Show full letter control.

## Verify

```sh
npm test
npm run build
npm run lint
```

`npm run preview` serves the production bundle. This project is entirely frontend-only, with no accounts, tracking, or backend. Hosting it publicly makes photographs and letters public too; do not include information you need to keep private.
