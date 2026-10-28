"""Transforme chaque projet des portfolios en exposition :
préface (titre, résumé, cartel, affiche), murs de texte, une salle par œuvre
(cartel à gauche, rouleau à droite), épilogue. Le contenu n'est que déplacé.
Usage : python tools/build-exposition.py portfolio-data.html
Les articles déjà convertis (classe « ex ») sont laissés tels quels ; le CSS
et le script de l'exposition sont déjà dans les deux pages."""
import re, sys
VOID={'img','br','hr','meta','link','input','source','wbr','col','area','base','embed','param','track'}
TOK=re.compile(r'<!--.*?-->|<(/?)([a-zA-Z][\w:-]*)((?:[^>"\']|"[^"]*"|\'[^\']*\')*?)(/?)>',re.S)
ATTR=re.compile(r'([\w:-]+)(?:\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+))?')
class N:
    def __init__(s,tag,attrs,start,parent):
        s.tag=tag;s.a=attrs;s.start=start;s.end=None;s.ch=[];s.p=parent;s.open_end=None
    @property
    def cls(s): return s.a.get('class','')
    def has(s,c): return c in s.cls.split()
    def html(s,src): return src[s.start:s.end]
    def inner(s,src): return src[s.open_end:s.end-len('</%s>'%s.tag)]
    def find(s,pred):
        for c in s.ch:
            if pred(c): yield c
            yield from c.find(pred)
    def __repr__(s): return f'<{s.tag} .{s.cls}>'
def parse(src,start=0,end=None):
    root=N('#root',{},start,None);cur=root;end=end or len(src)
    raw=None
    for m in TOK.finditer(src,start,end):
        if m.group(0).startswith('<!--'): continue
        close,tag,attrs,selfc=m.group(1),m.group(2).lower(),m.group(3),m.group(4)
        if raw and not(close and tag==raw): continue
        if close:
            raw=None
            n=cur
            while n is not root and n.tag!=tag: n=n.p
            if n is root: continue
            # close n (and any unclosed descendants)
            x=cur
            while x is not n: x.end=m.start(); x=x.p
            n.end=m.end(); cur=n.p
        else:
            a={k:(v[1:-1] if v and v[0] in '"\'' else (v or '')) for k,v in ATTR.findall(attrs)}
            n=N(tag,a,m.start(),cur);n.open_end=m.end();cur.ch.append(n)
            if tag in VOID or selfc: n.end=m.end()
            else:
                cur=n
                if tag in('script','style'): raw=tag
    root.end=end
    return root


PAGE = sys.argv[1]
src = open(PAGE, encoding='utf-8').read()
NO_POSTER = {'sephora-powerbi', 'bcg-beaute'}   # couverture = toutes les pages réunies
WIDE = ('pf-wk-kpis', 'pf-wk-table-wrap', 'pf-wk-drivers', 'pf-res-stats', 'pf-stats', '<table')

def h(n): return src[n.start:n.end]
def visual(n):
    x = h(n)
    if n.tag in ('figure',) or n.has('ig-carousel-wrap') or n.has('pf-img-figure') or n.has('pf-chart-grid'):
        return True
    return '<img' in x or ('<svg' in x and 'pf-slide-svg' in x)
def star_parts(n, drop=()):
    """(titre, corps) d'un bloc pf-star, sans les éléments de `drop`."""
    x = h(n)
    for d in drop: x = x.replace(h(d), '', 1)
    lbl = next((c for c in n.ch if c.has('pf-star-lbl') or c.has('pf-result-callout-lbl')), None)
    head = h(lbl) if lbl else ''
    inner = x[x.index('>') + 1: x.rindex('</div>')]
    if head: inner = inner.replace(head, '', 1)
    head = head.replace('pf-star-lbl', 'ex-salle-titre').replace('pf-result-callout-lbl', 'ex-salle-titre')
    return head, inner.strip()
def labelable(n):
    return n.has('pf-star') and not any(w in h(n) for w in WIDE) and not visual(n)

ROLL = '<span class="ex-roll" aria-hidden="true"></span>'
def room(head, body, vis):
    hand = f'<div class="ex-hand"><div class="ex-scroll">{vis}</div>{ROLL}</div>'
    if not head and not body:
        return ('room', f'<section class="ex-salle ex-salle--seule">\n      {hand}\n    </section>')
    return ('room', '<section class="ex-salle">\n      <div class="ex-cartel"><p class="ex-salle-n">{N}</p>'
            f'{head}{body}</div>\n      {hand}\n    </section>')

out = []; last = 0; count = 0
root = parse(src)
for art in list(root.find(lambda n: n.tag == 'article' and n.has('pf-case') and not n.has('ex'))):
    aid = art.a['id']
    grid = next(c for c in art.ch if c.has('pf-case-grid'))
    side = next(c for c in grid.ch if c.has('pf-case-side'))
    main = next(c for c in grid.ch if c.has('pf-case-main'))
    tail = src[grid.end:art.end - len('</article>')]
    # ── préface
    kicker = ''.join(h(c) for c in side.ch if c.has('pf-case-kicker'))
    titles = ''.join(h(c) for c in side.ch if c.tag == 'h2')
    cartel = ''.join(h(c) for c in side.ch if c.has('pf-stats') or c.has('pf-tags') or c.has('pf-btns'))
    rest_side = [c for c in side.ch if not (c.has('pf-case-kicker') or c.tag == 'h2' or c.has('pf-stats') or c.has('pf-tags') or c.has('pf-btns'))]
    cartel += ''.join(h(c) for c in rest_side)
    cover = None; texte = ''; source = ''; seq = []
    for c in main.ch:
        if cover is None and (c.has('pf-case-cover') or c.has('pf-slide')):
            cover = c; continue
        if c.has('pf-case-lead') or c.has('pf-case-note') or (c.tag == 'p' and not c.has('pf-img-caption') and not c.has('pf-case-source')):
            texte += h(c); continue
        if c.has('pf-case-source'): source = h(c); continue
        if c.tag == 'details':
            seq += [d for d in c.ch if d.tag != 'summary']
        else:
            seq.append(c)
    def comments(node):
        x = src[node.open_end:node.end]
        for ch in node.ch: x = x.replace(h(ch), '', 1)
        return ''.join(re.findall(r'<!--.*?-->', x, re.S))
    kept_comments = comments(side) + comments(main) + ''.join(comments(d) for d in main.ch if d.tag == 'details')
    poster = ''
    if cover is not None and aid not in NO_POSTER:
        poster = f'<div class="ex-affiche"><div class="ex-scroll">{h(cover)}</div></div>'
    elif cover is not None:
        pass  # couverture composite retirée : les œuvres se voient une à une
    preface = f'''<header class="ex-preface{' ex-preface--affiche' if poster else ''}">
      <p class="ex-preface-lbl"><span data-lang-show="fr">Préface</span><span data-lang-show="en">Preface</span></p>
      {kicker}
      {titles}
      <div class="ex-preface-grid">
        <div class="ex-preface-txt">{texte}
          <div class="ex-preface-cartel">{cartel}{source}</div>
        </div>
        {poster}
      </div>{kept_comments}
    </header>'''
    # ── parcours
    items = []; pend = []; caption = None
    def flush():
        global pend
        if pend: items.append(('wall', ''.join(h(p) for p in pend)))
        pend = []
    i = 0
    while i < len(seq):
        n = seq[i]
        if n.tag == 'p' and n.has('pf-img-caption'):
            caption = n; i += 1; continue
        if not visual(n):
            pend.append(n); i += 1; continue
        # groupe de variantes de langue (div data-lang-show contenant chacune l'œuvre)
        if 'data-lang-show' in n.a and n.tag == 'div':
            grp = [n]
            while i + len(grp) < len(seq) and 'data-lang-show' in seq[i + len(grp)].a and visual(seq[i + len(grp)]):
                grp.append(seq[i + len(grp)])
            head = body = ''
            if pend and labelable(pend[-1]): head, body = star_parts(pend.pop())
            elif caption is not None: body = h(caption).replace('pf-img-caption', 'pf-star-txt')
            flush(); caption = None
            items.append(room(head, body, ''.join(h(g) for g in grp))); i += len(grp); continue
        if n.has('pf-chart-grid'):
            head = ''
            if pend and pend[-1].has('pf-star-lbl'):
                head = h(pend.pop()).replace('pf-star-lbl', 'ex-salle-titre')
            flush()
            for it in n.ch:
                cap = next(it.find(lambda x: x.has('pf-img-caption')), None)
                body = h(cap).replace('pf-img-caption', 'pf-star-txt') if cap else ''
                vis = h(it).replace(h(cap), '', 1) if cap else h(it)
                items.append(room(head, body, vis))
            i += 1; continue
        if n.has('pf-star'):
            direct = [c for c in n.ch if c.tag == 'figure' or c.has('pf-img-figure')]
            langs = [c for c in n.ch if 'data-lang-show' in c.a and c.tag == 'div']
            nested = [list(l.find(lambda x: x.tag == 'li' and any(y.tag == 'figure' for y in x.ch))) for l in langs]
            flush()
            if direct:
                head, body = star_parts(n, drop=direct)
                items.append(room(head, body, h(direct[0])))
                for d in direct[1:]: items.append(room('', '', h(d)))
            elif nested and all(nested):
                head, _ = star_parts(n)
                segs_by_lang = []
                for l in langs:
                    lst = next(l.find(lambda x: x.tag in ('ul', 'ol') and any(y.tag == 'li' and any(z.tag == 'figure' for z in y.ch) for y in x.ch)))
                    pre = src[l.open_end:lst.start].strip(); post = src[lst.end:l.end - len('</div>')].strip()
                    open_tag = src[lst.start:lst.open_end]
                    segs = []; acc = []
                    for li in [y for y in lst.ch if y.tag == 'li']:
                        fig = next((z for z in li.ch if z.tag == 'figure'), None)
                        if fig is None: acc.append(h(li)); continue
                        acc.append(h(li).replace(h(fig), '', 1)); segs.append([acc, h(fig)]); acc = []
                    if acc: segs[-1][0] += acc
                    texts = [open_tag + ''.join(a) + f'</{lst.tag}>' for a, _ in segs]
                    texts[0] = pre + texts[0]; texts[-1] = texts[-1] + post
                    segs_by_lang.append((l.a['data-lang-show'], texts, [f for _, f in segs]))
                if len({len(t) for _, t, _ in segs_by_lang}) != 1: raise SystemExit(f'{aid}: segments inégaux')
                for k in range(len(segs_by_lang[0][1])):
                    body = ''.join(f'<div data-lang-show="{lg}">{t[k]}</div>' for lg, t, _ in segs_by_lang)
                    items.append(room(head, body, segs_by_lang[0][2][k]))
            else:
                raise SystemExit(f'{aid}: bloc visuel non reconnu {n}')
            i += 1; continue
        # œuvre seule (figure, pf-img-figure, carrousel)
        head = body = ''
        if pend and labelable(pend[-1]): head, body = star_parts(pend.pop())
        elif caption is not None: body = h(caption).replace('pf-img-caption', 'pf-star-txt')
        flush(); caption = None
        items.append(room(head, body, h(n))); i += 1
    if caption is not None: pend.append(caption)
    rooms = sum(1 for k, _ in items if k == 'room')
    parts = []; r = 0
    for k, x in items:
        if k == 'room':
            r += 1; parts.append(x.replace('{N}', f'{r} / {rooms}'))
        else:
            parts.append(f'<section class="ex-mur">{x}</section>')
    epi = ''.join(h(p) for p in pend)
    if epi: parts.append(f'<section class="ex-epilogue">{epi}</section>')
    attrs = src[art.start:src.index('>', art.start) + 1].replace('class="pf-case', 'class="pf-case ex ex--hand', 1)
    new = f'''{attrs}
  <div class="ex-expo">
    {preface}
    {chr(10).join('    ' + p for p in parts)}
  </div>{tail}</article>'''
    out.append(src[last:art.start]); out.append(new); last = art.end; count += 1
    print(f'{aid}: affiche={"oui" if poster else "non"}, salles={rooms}, murs={sum(1 for k,_ in items if k=="wall")}, épilogue={"oui" if epi else "non"}')
out.append(src[last:])
open(PAGE, 'w', encoding='utf-8').write(''.join(out))
print(count, 'projets')
