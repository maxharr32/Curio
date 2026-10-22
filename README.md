# Rateroom

A prototype for an app where people rate, review and collect anything with a design: brands, characters, logos and products. Think Letterboxd's catalogue and profile, with Pinterest's breadth.

"Rateroom" is a placeholder name. Change `APP_NAME` in `src/config.ts` and it updates across the UI (also edit `<title>` in `index.html`).

**This version is for working out the UI.** There is no server and no accounts. You add entries by hand, and everything is saved in your browser (localStorage). Export and import buttons on the Profile page let you back it up or move it.

## Run it

Needs Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # type-check and build into dist/
npm run preview    # serve the built app
npm run typecheck  # types only
```

## What is in it

| Page | Route | What it does |
| --- | --- | --- |
| Browse | `/` | Masonry feed. Filter by type, search, sort. Filters live in the URL. |
| Entry | `/entry/:id` | Cover, facts, tags, community score, your half-star rating and review. Edit or delete. |
| Add / edit | `/add`, `/entry/:id/edit` | Form with a live preview tile and a duplicate warning while you type the name. |
| Profile | `/profile` | Your ratings by category, everything you have rated, and export / import / reset. |

URLs use a hash (`/#/entry/123`) so the app works on GitHub Pages and any static host with no server rules.

## Where things live

```
src/
  config.ts          App name, entry types, colours and template fields per type
  types.ts           Entry, Rating and the export file shape
  data/seed.ts       Sample entries (edit freely, or empty the list)
  lib/storage.ts     The ONLY place that knows where data is stored
  lib/similar.ts     Name normalising and fuzzy duplicate matching
  lib/score.ts       Community score (sample score plus your rating)
  components/        EntryTile, EntryForm, Cover, Stars, Layout
  pages/             Feed, EntryPage, AddEntry (+ EditEntry), Profile
  styles.css         All styling: tokens at the top, plain CSS
```

### Design tweaks you will probably make

- **Colours and fonts:** variables at the top of `src/styles.css`. Each entry type's colour is in `src/config.ts`.
- **Add a type** (for example "Poster"): add it to `EntryType` in `src/types.ts`, then add a definition to `TYPES` and `TYPE_ORDER` in `src/config.ts`. Each type's `fields` list is its template, and the form builds itself from it.
- **Sample data:** `src/data/seed.ts`. The seed scores are made up for UI work, not real ratings. Check the facts before relying on them.

## Images

Entries only store an image **link**. Nothing is uploaded or hosted. If there is no link, or it fails to load, the entry shows a coloured letter tile. Only link to images you are allowed to show, such as openly licensed files from Wikimedia Commons. Crediting the owner does not make copyrighted images safe to use.

## Put it on GitHub

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Or with the GitHub CLI: `gh repo create rateroom --private --source=. --push`

**To get a live link:** in the repo, open Settings > Pages and set Source to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` then builds and publishes on every push to `main`. Note that each visitor's data is saved in their own browser, so everyone sees the sample entries plus only their own additions.

## Moving to a real back end later

All reads and writes go through `src/lib/storage.ts`. When you add accounts, keep the same method names (`addEntry`, `updateEntry`, `deleteEntry`, `setRating`, and so on) and replace their insides with calls to Supabase or your own API. Pages and components do not change.

Rough mapping to tables:

| Now | Later |
| --- | --- |
| `Entry` | `entries` table, with `fields` as a JSON column |
| `Entry.tags` | `tags` and `entry_tags` tables |
| `Rating` (one local user) | `ratings` table with a `user_id` |
| `Entry.sample` | dropped, the score becomes a real average of `ratings` |
| `status` | `unverified` / `verified`, set by community confirmation |
| none yet | `entry_versions` (edit history), `reports`, `takedowns`, `media` (licence and source per image) |

Planned pipeline steps that are not built here yet: importing from Wikidata, image quality and licence checks, AI-drafted descriptions, and server-side duplicate detection (embeddings and an LLM judge). The in-browser name matcher in `src/lib/similar.ts` is the first, cheapest layer of that.

## Notes

- Names, logos and characters belong to their owners. Keep descriptions in your own words and store facts, not copied text.
- Before any public launch you will need terms, a privacy policy and a copyright takedown process.
