"""Couvertures du dashboard Excel Engoo (XHS) à partir des captures
exportées par l'utilisatrice (assets/Engoo_Excel/Engoo Dashboard_FR|EN.webp) :
capture entière, filet et ombre douce, sur la couleur de carte de chaque page,
avec 36 px de fond uni sur les côtés (demande de l'utilisatrice).
Écrit assets/covers/engoo-dashboard(-data)(-en).webp (1 200 × 800)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H, M = 1200, 800, 36
CARTES = {'': ((243, 241, 235), (26, 24, 21), (203, 199, 186)),
          '-data': ((238, 243, 239), (22, 33, 31), (195, 207, 201))}

for lang, suffix in (('FR', ''), ('EN', '-en')):
    cap = Image.open(ROOT / 'assets' / 'Engoo_Excel' / f'Engoo Dashboard_{lang}.webp').convert('RGB')
    pw = W - 2 * M
    ph = round(cap.height * pw / cap.width)
    if ph > H - 2 * M:
        ph = H - 2 * M
        pw = round(cap.width * ph / cap.height)
    cap = cap.resize((pw, ph), Image.LANCZOS)
    x, y = (W - pw) // 2, (H - ph) // 2
    for page, (carte, encre, filet) in CARTES.items():
        im = Image.new('RGB', (W, H), carte)
        sh = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sh).rectangle((x + 4, y + 10, x + pw - 4, y + ph + 8), fill=70)
        im = Image.composite(Image.new('RGB', (W, H), encre), im, sh.filter(ImageFilter.GaussianBlur(14)))
        im.paste(cap, (x, y))
        ImageDraw.Draw(im).rectangle((x - 1, y - 1, x + pw, y + ph), outline=filet)
        dest = ROOT / 'assets' / 'covers' / f'engoo-dashboard{page}{suffix}.webp'
        im.save(dest, 'WEBP', quality=88)
        print(dest.relative_to(ROOT))
