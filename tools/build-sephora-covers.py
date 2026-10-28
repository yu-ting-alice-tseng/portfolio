"""Couvertures du catalogue pour Sephora : une seule page du dashboard
(Portfolio Matrix), entière, posée sur la couleur de carte de chaque page.
Écrit assets/covers/sephora-matrice(-data)(-en).webp (1 200 × 800)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'PowerBI_Sephora'
OUT = ROOT / 'assets' / 'covers'
W, H, PAGE_W = 1200, 800, 1078
CARDS = {'': (243, 241, 234), '-data': (238, 243, 239)}   # marketing #f3f1ea, data #eef3ef
INK = (26, 24, 21)

for lang in ('', '-en'):
    page = Image.open(SRC / f'sephora-powerbi-2{lang}.webp').convert('RGB')
    pw, ph = PAGE_W, round(page.height * PAGE_W / page.width)
    page = page.resize((pw, ph), Image.LANCZOS)
    x, y = (W - pw) // 2, (H - ph) // 2
    for suffix, card in CARDS.items():
        im = Image.new('RGB', (W, H), card)
        shadow = Image.new('L', (W, H), 0)
        ImageDraw.Draw(shadow).rectangle((x + 4, y + 10, x + pw - 4, y + ph + 8), fill=70)
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        im = Image.composite(Image.new('RGB', (W, H), INK), im, shadow)
        im.paste(page, (x, y))
        ImageDraw.Draw(im).rectangle((x - 1, y - 1, x + pw, y + ph), outline=(203, 199, 186) if suffix == '' else (195, 207, 201))
        dest = OUT / f'sephora-matrice{suffix}{lang}.webp'
        im.save(dest, 'WEBP', quality=88)
        print(dest.relative_to(ROOT))
