# Paws Boutique: website

A scroll-driven website for **Paws Boutique**, a pedigree puppy business in Amritsar. Every page is built to end in one action: **ask for a price**.

- **Home** is a scroll-driven story built with GSAP 3.13 (ScrollTrigger, SplitText, Flip) and Lenis smooth scrolling, starring the husky mascot:
  1. **Loading screen (no progress bar).** The husky sits with its back to you while bouncing dots and rotating lines ("Fluffing the fur…") play. Once the hero images are in, it turns round and barks "Woof!", then flies into its place in the hero while the maroon backdrop closes around it. It plays once per visit.
  2. **Hero.** A huge headline sits behind the husky: "Meet your new best friend / sofa buddy / shadow / walk partner / forever pup". The words swap letter by letter.
     - The husky is three layers (tail, body and head). Its head follows the cursor, its tail wags, it breathes and glances around when idle.
     - Tapping it makes it hop with hearts and a bark.
     - Sticker badges float round it and drift with the cursor. Paw prints trail the cursor.
     - On scroll, the headline splits apart, the stickers fly off, the husky leans in and a maroon curtain rises.
  3. **Manifesto.** It lights up word by word. Key phrases glow in sky and lilac.
  4. **Bands and stats.** Two tilted marquee bands react to scroll speed. The counters are tilted sticker tiles in sky, lilac and maroon.
  5. **Sizes.** The five size groups scroll sideways, each panel in its own palette colour, while the paw grows.
  6. **Breed listing.** Sticker-style cards with Flip-animated filter tabs and 3D tilt.
  7. **How it works (pinned).** As you scroll, a phone acts out a price request for a husky:
     - tapping View Price, answering the flashcards
     - the WhatsApp chat filling with photos, a video and the price PDF
     - a map pin dropping on a booked visit
  8. **Health record.** The husky's record turns in 3D, ticks off its checks and gets a "Ready for home" stamp.
  9. **Summer guide.** The thermometer climbs to 45°C.
  10. **FAQ.**
  11. **Final call to action.** The husky looks up at a speech bubble that cycles through lines. The back-view husky sits on the footer's top edge.
- **Layout:** sections stack like sheets: the breed listing (lilac), health record, summer guide and FAQ (white cards on sage) each slide over the one before with rounded tops. "How it works" sits on sky.
- **Everywhere:**
  - Headings drop in letter by letter.
  - The price buttons burst into paw confetti.
  - A paw-print panel wipes between pages.
  - Desktop gets a custom cursor, magnetic buttons and card tilt.
- **Puppies** (`puppies.html`) lists all breeds with search, size tabs, a "Good for flats" filter and a "Handles summer heat" filter. `?size=toy` (or small, medium, large, giant) opens a tab directly.
- **Breed pages** (`breeds/<id>.html`): one SEO page per breed ("Labrador Retriever puppies for sale in Amritsar") with a fit table, the health promise and similar breeds.
- **View Price** opens the quote **flashcards**: breed → male/female → when → name and WhatsApp number. The breed is pre-selected from the card the visitor tapped. Each answer flips to the next card. The panel always shows **Call us** and **WhatsApp us** as alternatives.
- Desktop extras: a custom cursor ("Meet" / "Price" labels), magnetic buttons and 3D card tilt. A floating WhatsApp button appears on every page.

## Run it

```bash
npm run build     # writes the static site to dist/
npm run serve     # serves dist/ on http://localhost:8080
```

You need Node 18+ and nothing else. `dist/` is committed, so it can be uploaded to any static host as-is (Netlify, Vercel, Cloudflare Pages, cPanel/Hostinger via FTP). Pushing to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`. This needs a one-time setting: **Settings → Pages → Source: GitHub Actions**.

## Before launch: what to replace

The build prints a "Before launch" list until these are done.

| What | Where |
|---|---|
| Phone, WhatsApp number, email, street address, hours, Google Maps link, domain | `company` in `src/assets/js/data.js` |
| **Puppy photos**: one per breed, named `<breed id>.webp` (e.g. `labrador-retriever.webp`), about 1200×1000 px | `src/assets/img/breeds/` |
| Health promises, the four steps and the FAQ answers: confirm each with the client | `promises`, `steps`, `faqs` in `data.js` |
| Breeds the client actually sells (add, remove, mark `featured: true` for the homepage "Popular" tab) | `breeds` in `data.js` |
| Domain in `robots.txt` | `src/robots.txt` |

Until a breed has a photo, its card shows coat-colour art: a gradient in the breed's typical coat colours with its initial. Real photos replace it automatically on the next build. Buyers decide on photos, so this is the most important item on the list.

## Where quote requests go

With `company.leadWebhook` empty (the default), submitting the flashcards opens WhatsApp with every answer pre-filled:

```
Hi Paws Boutique, I'd like the price for a German Shepherd puppy.
Gender: Female
When: This month
Name: …
WhatsApp: +91 98…
City: Amritsar
```

Set `leadWebhook` to an n8n (or any) webhook URL and each request is POSTed there as JSON (`breed`, `breedName`, `gender`, `when`, `name`, `phone`, `city`, `page`, `submittedAt`, `message`). From there it can be logged to a sheet or CRM and sent as an instant WhatsApp alert to the owner. The visitor still gets a button to continue on WhatsApp. If the webhook fails, the visitor is told and offered WhatsApp instead, so no lead is lost silently.

## Where things live

| What | File |
|---|---|
| All content: business details, breeds, sizes, promises, steps, FAQs | `src/assets/js/data.js` |
| Page templates | `scripts/pages/*.js` (home, puppies, breed, not-found) |
| Header, footer, quote flashcards, floating WhatsApp | `scripts/lib/layout.js` |
| Breed card and image helpers | `scripts/lib/ui.js` |
| Styles (design tokens at the top) | `src/assets/css/site.css` |
| Homepage scroll choreography | `src/assets/js/home.js` |
| Smooth scroll, cursor, filters, quote flashcards | `src/assets/js/site.js` |
| Husky mascot: front pose split into `husky-head` / `husky-body` / `husky-tail` layers, plus `husky-side`, `husky-back` and `husky-front` | `src/assets/img/brand/` |
| GSAP 3.13 + plugins, Lenis (self-hosted, no CDN) | `src/assets/vendor/` |

## Design

- **Palette:**
  - Sage `#DDE0BD`: secondary sections and chips. A 20% tint of it, `#F8F9F2`, is the page background.
  - Maroon `#4A051C`: text, dark sections and primary buttons. A darker shade, `#2E0211`, is used for the footer and "How it works".
  - Sky `#89DAFF`: the call-to-action button, and accents on maroon.
  - Lilac `#F2D5F8`: the highlighter stroke behind key words in headings, plus card and step fills.
  - WhatsApp green stays on WhatsApp buttons so visitors recognise them.
- **Type:** Helvetica Neue throughout (`--display` and `--sans` in `site.css`), with tight tracking on headings. The stack falls back to Helvetica, then Arial. Helvetica Neue is built into Apple devices only. Windows shows Arial and Android shows Roboto, unless a Helvetica Neue web-font licence is bought and the files are self-hosted in `src/assets/fonts/`.
- **Mascot images:** about 560 KB in total (WebP). The loading screen waits for them, but it never waits more than 6 seconds.
- **Accessibility:** the site respects `prefers-reduced-motion`. With reduced motion, pinning, smooth scroll and the preloader are switched off and all content is shown at once. The quote dialog traps focus, closes on Escape and works with the keyboard alone. If the scripts fail to load, the page falls back to a static layout after 4 seconds.
