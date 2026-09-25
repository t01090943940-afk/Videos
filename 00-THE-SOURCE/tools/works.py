import json
from pathlib import Path
WORKS = json.loads((Path(__file__).resolve().parent.parent / 'src' / 'works.json').read_text('utf8'))
