# ReTrace — Intelligent Lost Item Recovery Platform (Frontend)

A React + Vite frontend for ReTrace, a lost-and-found recovery platform.
The core UX is a **dynamic, category-based reporting flow**: users pick a
report type, category and subcategory, and only ever see the fields
relevant to that exact item — a lost phone asks different questions than
a lost backpack.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Project structure

```
src/
 ├── components/   Reusable UI: CategoryCard, DynamicForm, PhotoUpload,
 │                 MatchScoreCard, MatchBreakdown, ItemCard, etc.
 ├── pages/        One file per route/screen (see App.jsx for the map)
 ├── layouts/      MainLayout (public site) and AdminLayout (admin panel)
 ├── services/     Mock API layer — itemService, matchService, claimService.
 │                 Every function here maps 1:1 to a future REST endpoint.
 ├── hooks/        useReportForm — drives the multi-step report wizard
 ├── utils/        Formatting + display helpers
 └── data/         Mock JSON-like data: categories/fields schema, items,
                   matches, notifications
```

## Key screens

- `/` — Landing page
- `/report` — Dynamic category-based report flow (lost or found)
- `/matches` and `/matches/:id` — Possible-match list and detail, with the
  match-score ring and signal breakdown (category/brand/color/location/
  time/description)
- `/claim/:id` — Private ownership-verification questions
- `/dashboard` — Personal stats, lost/found items, matches, recovery history
- `/browse` — Public search over found items (privacy-conscious cards —
  no phone numbers, emails, serial numbers or document numbers)
- `/notifications` — Match / verification / approval notifications
- `/admin`, `/admin/reports`, `/admin/claims`, `/admin/users` — Admin panel

## Dynamic category schema

All of the category → subcategory → field-set logic lives in
`src/data/categories.js`. To add a new item type, add an entry there —
no page or component needs to change, since `DynamicForm` and
`DynamicField` render whatever field list a subcategory defines.

Fields marked `type: "private-text"` (IMEI/serial numbers, document
numbers) render with a "Private" badge and are deliberately excluded from
`ReviewSummary` and every public-facing card.

## Connecting the real backend

This build uses mock data and an in-memory mock service layer
(`src/services/*.js`) instead of a real backend. Each function's comment
names the future Spring Boot endpoint it stands in for, e.g.:

```
GET  /api/items/lost
GET  /api/items/found
POST /api/items/lost
POST /api/items/found
GET  /api/matches
GET  /api/matches/{id}
POST /api/claims
POST /api/verification
```

To connect a real API, replace the bodies of the functions in
`itemService.js`, `matchService.js` and `claimService.js` with `fetch`
calls — the pages that consume them don't need to change.

## Design

Deep navy ink (`#101425`) on a soft paper background (`#F7F7F5`), a
muted indigo accent (`#3B4CC9`) for primary actions, and a teal / amber /
rose signal palette used consistently for "strong / moderate / weak"
match signals and status states. Headings use Space Grotesk, body and UI
text uses Inter. Tailwind tokens for all of this live in
`tailwind.config.js`.
