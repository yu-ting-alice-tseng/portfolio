"""Couvertures du rapport hebdomadaire Engoo à partir des diapositives
exportées par l'utilisatrice (diapositive 2 derrière, diapositive 1 devant),
sur la couleur de carte de chaque page, avec peu de fond uni autour
(demande de l'utilisatrice : marges de 36 px) :
papier #f3f1ea (marketing) et carte céladon #eef3ef (data).
Écrit assets/covers/engoo-weekly(-data)(-en).webp (1 200 × 800)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H, M, SW = 1200, 800, 36, 1010
CARTES = {'': ((243, 241, 235), (26, 24, 21)), '-data': ((238, 243, 239), (22, 33, 31))}

def slide(lang, n):
    im = Image.open(ROOT / 'assets' / f'Engoo_Weekly Report_{lang}' / f'Diapositive{n}.JPG').convert('RGB')
    return im.resize((SW, round(im.height * SW / im.width)), Image.LANCZOS)

for lang, suffix in (('FR', ''), ('EN', '-en')):
    s2, s1 = slide(lang, 2), slide(lang, 1)
    for page, (carte, encre) in CARTES.items():
        canvas = Image.new('RGB', (W, H), carte)
        for s, (x, y) in ((s2, (W - M - SW, M)), (s1, (M, H - M - s1.height))):
            sh = Image.new('L', (W, H), 0)
            ImageDraw.Draw(sh).rectangle((x + 6, y + 14, x + s.width - 6, y + s.height + 10), fill=80)
            sh = sh.filter(ImageFilter.GaussianBlur(16))
            canvas = Image.composite(Image.new('RGB', (W, H), encre), canvas, sh)
            canvas.paste(s, (x, y))
        dest = ROOT / 'assets' / 'covers' / f'engoo-weekly{page}{suffix}.webp'
        canvas.save(dest, 'WEBP', quality=88)
        print(dest.relative_to(ROOT))
