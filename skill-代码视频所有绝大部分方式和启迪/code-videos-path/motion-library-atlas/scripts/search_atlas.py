#!/usr/bin/env python3
"""Read-only, local Unicode/alias search. No network or third-party packages."""
import argparse,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def norm(s):return re.sub(r'[\s_.\-/]+','',s.casefold())
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('query',nargs='?',default='');p.add_argument('--id');p.add_argument('--limit',type=int,default=6);a=p.parse_args()
    if a.id:
        if not re.fullmatch(r'[a-z0-9-]+',a.id):p.error('Invalid id')
        target=ROOT/'references/libraries'/a.id/'README.md'
        if not target.exists():p.error('Unknown library id')
        print(target.read_text(encoding='utf-8'));return
    rows=json.loads((ROOT/'references/catalog-index.json').read_text(encoding='utf-8'))
    if isinstance(rows,dict):rows=rows.get('libraries',rows.get('entries',[]))
    words=[norm(x) for x in a.query.split() if norm(x)]
    hits=[]
    for row in rows:
        hay=norm(json.dumps(row,ensure_ascii=False));score=sum(1 for w in words if w in hay)
        if not words or score:
            hits.append((score,row))
    hits.sort(key=lambda x:-x[0])
    for score,row in hits[:max(1,min(a.limit,50))]:
        print(json.dumps(row,ensure_ascii=False))
    if not hits:print('No matches. Try an effect, English name, category or alias.')
if __name__=='__main__':main()
