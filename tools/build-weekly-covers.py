"""Couvertures du rapport hebdomadaire Engoo à partir des diapositives
exportées par l'utilisatrice (diapositive 2 derrière, diapositive 1 devant),
sur la couleur de carte de la page : papier #f3f1ea (marketing, fichiers
existants engoo-weekly(-en).webp) ou carte céladon #eef3ef (data).
Écrit assets/covers/engoo-weekly-data(-en).webp (1 200 × 800)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H, SW = 1200, 800, 940
CARD = (238, 243, 239)
INK = (22, 33, 31)

def slide(lang, n):
    im = Image.open(ROOT / 'assets' / f'Engoo_Weekly Report_{lang}' / f'Diapositive{n}.JPG').convert('RGB')
    return im.resize((SW, round(im.height * SW / im.width)), Image.LANCZOS)

for lang, suffix in (('FR', ''), ('EN', '-en')):
    canvas = Image.new('RGB', (W, H), CARD)
    for n, (x, y) in ((2, (200, 90)), (1, (90, 175))):
        s = slide(lang, n)
        sh = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sh).rectangle((x + 6, y + 14, x + s.width - 6, y + s.height + 10), fill=80)
        sh = sh.filter(ImageFilter.GaussianBlur(16))
        canvas = Image.composite(Image.new('RGB', (W, H), INK), canvas, sh)
        canvas.paste(s, (x, y))
    dest = ROOT / 'assets' / 'covers' / f'engoo-weekly-data{suffix}.webp'
    canvas.save(dest, 'WEBP', quality=88)
    print(dest.relative_to(ROOT))
