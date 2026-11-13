# reachonemore.cccomaha.org

Single-page archive of CCC's Reach One More initiative. Hosted on Netlify (Comm Team), auto-deploys from `main`.

## Editing (staff)
Use Pages CMS at https://app.pagescms.org and open `ccc-omaha/reach-one-more`. The sidebar follows the page top to bottom:

1. Intro and vision
2. Primary goal
3. Secondary goal (giving amounts drive the totals and bar charts)
4. Stories (Vimeo links)
5. Letter from Minister Mark Ashton
6. FAQ
7. Background photos
8. Footer

Keep photo uploads under about 1 MB. Text fields accept `**bold**`, `*italic*` and `[link text](https://...)`.

## How it builds
- `content/*.json` holds all editable copy.
- `src/template.html` holds the design, styles and scripts.
- `build.js` combines them into `index.html`. Netlify runs it on every deploy (`netlify.toml`).
- To preview locally: `node build.js` then open `index.html`.
