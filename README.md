# MathNotes — CIE A Level Mathematics & Further Mathematics

A public Cambridge International (CIE/CAIE) A Level maths revision website. The current collection focuses on Further Mathematics 9231: 14 topics represented in the supplied notes, comprising 5 FP1, 4 FP2 and 5 Further Statistics topics. The shared MF19 reference also supports Mathematics 9709.

- One Topic Map groups the notes by module and orders them by syllabus topic.
- 14 guides contain 78 numbered question types, short methods, essential formulas and worked examples.
- One Question papers library contains 12 original collections with 101 complete questions, plus 10 separately supplied answer files.
- Every question page also has a full-page lossless preview for browsers without a PDF viewer. The source question and answer PDFs are copied intact, preserving page order, numbering, subparts, diagrams and supplied commentary. Byte-identical duplicate files are included once.
- The official Cambridge MF19 formula sheet is linked in the sidebar, resources and paper reader. There is no separate formula index.
- English/Chinese alias search, print layouts, device-local study status and a compact footer view counter are retained.

## Run and check

Use Node.js 24 LTS and the locked dependencies:

```sh
npm ci
npm run dev
```

For the GitHub Pages build:

```sh
BASE_PATH=/mathnotes-further-maths/ SITE_URL=https://justinwangqx.github.io npm run check
BASE_PATH=/mathnotes-further-maths/ SITE_URL=https://justinwangqx.github.io npm run build
BASE_PATH=/mathnotes-further-maths/ npm test
```

The workflow checks and deploys `dist/` on pushes to `main`. Repository Settings → Pages → Source must be GitHub Actions. The production build generates the browser search catalogue and a Pagefind index. Internal URLs honour the deployment base.

## Content and provenance

- `src/content/notes/`: note metadata and shared question-type layout.
- `src/data/question-types.json`: all numbered methods, formulas, examples and source references.
- `src/data/curriculum.ts`: the 14 topics, syllabus ordering, aliases and reference links.
- `src/data/paper-collections.json`: source filenames, question counts, PDF metadata and SHA-256 digests.
- `public/papers/`: the 22 selected source question/answer PDFs. The ignore rules permit PDFs only here.
- `docs/paper-collections.md`: exact collection and answer pairings.
- `docs/content-scope.md`: source-note coverage.

Only question collections supplied by the user are included in the paper library. The full coursebook and lesson-note PDFs are excluded. The previous generated practice questions and external-paper archive have been removed. `/practice/` and `/past-papers/` redirect to `/papers/`; `/syllabus/` redirects to the single `/notes/` Topic Map. Guide URLs are unchanged.

Math working uses stacked fractions and vertical display equations. `src/utils/math-layout.mjs` formats successive equalities; use explicit `aligned` blocks for authored working and retain matrices and cases as authored. Split long expressions at meaningful mathematical boundaries for narrow screens.

The reference syllabus is CIE 9231 for 2026–2027. Guide availability does not imply complete syllabus coverage or independent teacher review. Submit mathematical corrections through GitHub Issues.

## Validation

Checks cover routes and anchors, base-path handling, all 14 guides and 78 question types, source PDF checksums, the unified navigation, removed sections, math rendering, search aliases, visit counting and numerical checks on worked examples. The PDF checks protect the original documents from accidental truncation or substitution.

## Search and discovery

Every indexable page has a unique subject-specific title and description, canonical URL, social preview and structured page/breadcrumb metadata. The sitemap lists 34 useful pages and all 22 original question/answer PDFs; search, errors and legacy redirects are excluded. See `docs/search-discovery.md` for indexing details.

On-site search recognises CIE/CAIE/Cambridge, A Level/A-level/Alevel, Mathematics/Maths, English/Chinese topic names, module names and note/paper intent. It matches the current notes and text extracted from the original question PDFs, returning whole collections. `src/data/paper-search.json` also contains original paper references printed in the supplied answer PDFs where available. Refresh that file after changing a source collection with `python3 scripts/index-paper-text.py` (optional authoring dependency: `pypdf`); normal builds need no Python.

## Footer view count

The footer shows the public site-wide page-view total supplied by Hits Counter, counted from 4 November 2026. Repeat page loads count as additional views. Earlier traffic was not recorded.

`src/utils/visits.mjs` makes one request per live page load with the fixed canonical site URL as the counter key. Local previews and the 404 page are excluded. Query strings, search terms, cookies and account identifiers are not sent. Requests are not automatically retried to avoid duplicate increments. Keep `trackedSite` stable to retain the accumulated total. The provider can be unavailable or blocked; the footer then shows `—` rather than a fabricated count.

## Study controls and rollback

All 78 question types offer a try-first source example, an independent hint reveal and a collapsed worked solution. Brief exam cues stay optional. Confidence is recorded per type in browser storage; numbered topic-map links show each state. Below 981px, a sticky compact contents menu replaces the desktop contents column. Printing expands worked solutions temporarily.

Specific method searches return direct `#type-N` links with editorial plain-text descriptions. Paper results continue to open intact source collections.

The exact pre-refinement release is preserved as `before-study-refinement-2026-11-05` (`c849ed6`). To publish it again, run the existing Actions workflow from main with that tag as its **revision** input. See [rollback instructions](docs/rollback.md) for both website-only recovery and source restoration without deleting history. A normal push still publishes main.
