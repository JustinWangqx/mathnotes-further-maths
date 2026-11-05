# Search and discovery

MathNotes is an independent Cambridge International (CIE/CAIE) A Level Mathematics and Further Mathematics resource. Current topic notes and question collections cover **Further Mathematics 9231** only. Mathematics 9709 is referenced for the shared official MF19 formula sheet, not as a published course.

## Search engines

- Every useful HTML page has a unique descriptive title and summary, an absolute canonical URL and an orange social preview.
- Visible breadcrumbs agree with the JSON-LD hierarchy. Notes and paper readers identify their educational level and actual resource type. Reader metadata links to the unchanged source PDFs.
- Sitemap: <https://justinwangqx.github.io/mathnotes-further-maths/sitemap-index.xml>. It includes 34 indexable HTML pages and all 22 original question/answer PDFs. Search, 404 and legacy redirects are excluded.
- Titles, descriptions and page text use Cambridge International, CIE, CAIE, A Level Mathematics, Further Mathematics, revision notes and past-paper questions where appropriate. There are no keyword-stuffed hidden passages or claims of complete syllabus coverage.

Search-engine indexing and ranking are external to deployment. The sitemap has **not** been submitted through an authenticated Search Console account. A verified owner can add the URL-prefix property `https://justinwangqx.github.io/mathnotes-further-maths/` in Google Search Console and submit `sitemap-index.xml`. If verification requires an HTML tag or file, add the value actually supplied by Google; never invent a verification token. No Google account or analytics setup is needed for the local search feature.

GitHub project sites live below a path. A `robots.txt` inside `/mathnotes-further-maths/` would not control the host's crawler policy, so the project does not create a misleading one. The canonical sitemap is linked from every page's head.

## On-site search

The browser downloads `search-index.json` on first use. Its 28 main entries are the 14 current note guides, 12 intact question collections and two reference resources. The note entries also index all 78 question types; specific method matches link directly to their section anchors with plain-text editorial descriptions. Search runs locally; typed terms are not sent to a search provider or the footer counter.

Examples:

- `CIE A Level Mathematics notes` → all 14 current 9231 note guides.
- `integration papers` or `积分真题` → the two original Integration collections.
- `复数笔记` → Complex numbers notes.
- `FP1 notes` → the five Further Pure 1 guides.
- `MF19`, `formula sheet` or `9709` → the official shared formula PDF.

Type and module controls can narrow the results. A phrase from a source question matches its complete collection; the result does not reproduce a broken-out question or imply a complete examination paper. PDF extraction is a matching aid and can omit mathematical glyphs and image-only text; the original PDF and full-page previews remain the reading sources.

## Verification

`npm run check`, the production build and `npm test` check metadata uniqueness, structured JSON, breadcrumb hierarchy, sitemap scope and source PDF checksums, plus English/Chinese search intent and module filtering. Search corpus regeneration is an explicit authoring step so normal builds do not add a Python dependency.
