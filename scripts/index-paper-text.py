"""Refresh the browser search corpus from the unchanged public source PDFs.

Optional authoring dependency: pypdf. Not required for normal builds.
Question text is used for matching only; results open the whole collection.
"""
import json
import re
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
papers = json.loads((root / 'src/data/paper-collections.json').read_text())
texts = {}
for paper in papers:
    def extract(asset):
        return ' '.join(page.extract_text() or '' for page in PdfReader(root / 'public' / asset['file']).pages)
    text = extract(paper['questions'])
    # Only copy printed paper references from supplied answers; do not infer years or variants.
    references = sorted(set(re.findall(r'20\d{2}/(?:Winter|Summer|Spring)/Paper\d+_\d+/Q\d+', extract(paper['answers'])))) if paper['answers'] else []
    texts[paper['id']] = ' '.join((text + ' ' + ' '.join(references)).split())
(root / 'src/data/paper-search.json').write_text(json.dumps(texts, ensure_ascii=False, indent=2) + '\n')
print(f'Indexed {len(texts)} complete source collections.')
