# ECHO — Chat That Feels Instant 💬

> Your servers. Your messages. One socket forever.

**ECHO** is a dependency-free landing page for a self-hosted WebSocket chat
platform, built in a light "paper" theme. Its centerpiece is a **live
simulated chat card** — typing dots, incoming bubbles, delivery ticks in an
endless loop — floating over a canvas network of client nodes pulsing toward
a server hub. No libraries, no build step, no backend required to demo it.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![Build](https://img.shields.io/badge/build-not%20required-brightgreen.svg)]()

<img width="1349" height="3996" alt="image" src="https://github.com/user-attachments/assets/f2155753-945a-44df-97b5-282811768c72" />

---

## ✨ Features

- 💬 **Live chat demo** — scripted conversation with typing indicators,
  presence dot and read receipts; loops forever, trims its own history
- 🕸️ **Canvas network** — 14 drifting client nodes, edges and message pulses
  travelling to/from a breathing server hub
- 🎈 **Floating chat bubbles** — five pastel CSS bubbles rising on
  independent loops with mouse parallax
- 📊 **Count-up stats** — 12 ms median delivery · 99.98% uptime · 40k conns
- 🧑‍💻 **Code card** — dark terminal panel with a 10-line WebSocket client
- 👀 **Scroll reveals** — gated behind `html.js`, content never hides if
  scripts are blocked
- ♿ **Reduced-motion aware** — bubbles, pings and reveals all calm down
- 📴 **Offline-ready** — works from `file://` in any modern browser

## 🚀 Quick Start

```bash
git clone https://github.com/AmiARMiess/echo.git
cd echo
open index.html        # double-click works — no server needed
```

Fonts (Outfit + Inter) load from Google Fonts when online and fall back to
system sans offline. Everything else is fully local.

## 📁 Structure

```
echo/
├── index.html     # hero + live chat card, features, developers, pricing, CTA
├── style.css      # tokens, paper theme, chat bubbles, chat card, animations
├── script.js      # chat simulator + network canvas + watchdog, reveals, counters
├── README.md      # this file
└── .gitattributes # line-ending + linguist rules
```

## 🧩 Sections

| Section    | Content                                              |
|------------|------------------------------------------------------|
| Hero       | Split layout: headline + stats beside the live chat card |
| Features   | 6 cards — sockets, presence, receipts, history, E2E, scaling |
| Developers | Checklist + dark code card with WS client snippet    |
| Quote      | CTO testimonial with gradient accent                 |
| Pricing    | 3 tiers with gradient-border "Team favourite" plan   |
| CTA        | Glass panel with dual buttons                        |
| Footer     | Auto year + status/docs/security links               |

## 🎨 Theming

All tokens live in `:root` of `style.css`:

```css
:root{
  --paper:#F5F3EE;   /* warm paper background */
  --ink:#101820;     /* deep slate text       */
  --coral:#FF6B4A;   /* outgoing / accent A   */
  --teal:#12A594;    /* incoming / accent B   */
  --grad:linear-gradient(100deg,var(--coral),var(--teal));
}
```

Swap the two accents and every gradient, bubble, tick, tag and ticket border
follows automatically. Flip `--paper`/`--ink` for an instant dark mode.

## 🛡️ Graceful Degradation

1. **JS blocked** → the chat card still shows a real static conversation
   (pre-rendered in HTML); reveals never hide content (`html.js` gate).
2. **Canvas unavailable** → network init exits silently; bubbles remain.
3. **Loop stalled** → a 400 ms watchdog re-arms `requestAnimationFrame`
   after tab switches, sleep or browser throttling.
4. **No IntersectionObserver** → reveals and counters resolve instantly.
5. **Reduced motion** → bubbles, pings and typing dots freeze gracefully.

## ⚙️ Performance

- Zero network requests except optional fonts
- All CSS motion is compositor-friendly (transform / opacity on fixed layers)
- Canvas draws ≤14 nodes, ≤10 pulses per frame at capped DPR (2)
- Chat simulator uses chained timeouts and trims DOM to 9 messages
- ~170 lines of vanilla JS, fully wrapped in `try/catch`

## 🧑 Browser Support

Any modern browser (Chrome, Edge, Firefox, Safari), including older builds —
no WebGL, no modules, no polyfills.

## 📄 License

MIT — free for personal and commercial use.

---

*Ship conversations, not sockets.*
