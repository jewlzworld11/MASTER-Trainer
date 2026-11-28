# Master Trainer

Jewlz World · Applied AI · Miami

Every class trainer in one place, built around one end goal: **Forward Deployed Engineer**.

**Open it:** https://jewlzworld11.github.io/MASTER-Trainer/

## Install it as an app

- **Android (Chrome):** open the link, tap **Install app** (or ⋮ menu → **Add to home screen** → **Install**).
- **iPhone (Safari):** open the link, tap **Share** → **Add to Home Screen**.

After the first visit it works offline. Progress saves on the device you use.

## What's inside

| Page | Class |
|---|---|
| `index.html` | 3D home: the AI Journey galaxy (click a planet to land in its trainer) |
| `hub.html` | Command center (holographic dashboard) |
| `classic.html` | 2D home |
| `fde-lab.html` | FDE Lab (end goal) |
| `python-output.html` | Intro to Python |
| `math-placement.html` | Math placement test prep |
| `ai-business.html` | GEB 1432 · Applied AI in business |
| `ethics-octagon.html` | PHI 2680 · AI Ethics |
| `english-writing.html` | ENC 1101 · English Comp |

Each trainer lands on its own world (`mt-world.js`, loaded by `cc-skin.js`): a scene behind the lessons, a playable world panel with lesson markers, rank/XP and achievements.

`sw.js` saves everything for offline use. When files change, bump `VERSION` at the top of `sw.js` so phones pick up the update.
