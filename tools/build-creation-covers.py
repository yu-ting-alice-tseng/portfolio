"""Couvertures des projets de création de portfolio-marketing.html
(AIESEC YOLO, Club de Guzheng) : œuvres entières, côte à côte, à la même
hauteur, sur le papier #f3f1ea, avec le moins de marge possible tout en
gardant de l'air autour (demande de l'utilisatrice : « réduire le fond uni,
agrandir les images »).
Écrit assets/covers/aiesec-yolo.webp et guzheng-facebook.webp (1 200 × 800)
et affiche la position de chaque œuvre en % pour les zones cliquables
.pf-cover-hit de la page."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 800
MARGE, ECART = 36, 36
PAPIER = (243, 241, 235)
ENCRE = (26, 24, 21)

COUVERTURES = {
    'aiesec-yolo': ['yolo-camp-main-visual-en', 'yolo-camp-main-visual-zh'],
    'guzheng-facebook': ['guzheng-club-recruitment-poster', 'guzheng-club-year-end-gathering'],
}

for nom, oeuvres in COUVERTURES.items():
    ims = [Image.open(ROOT / 'assets' / f'{o}.webp').convert('RGB') for o in oeuvres]
    ratios = [im.width / im.height for im in ims]
    h = min(H - 2 * MARGE, (W - 2 * MARGE - ECART * (len(ims) - 1)) / sum(ratios))
    h = int(h)
    tailles = [(round(r * h), h) for r in ratios]
    total = sum(t[0] for t in tailles) + ECART * (len(ims) - 1)
    x, y = (W - total) // 2, (H - h) // 2
    toile = Image.new('RGB', (W, H), PAPIER)
    ombre = Image.new('L', (W, H), 0)
    places = []
    for (w, _), im in zip(tailles, ims):
        ImageDraw.Draw(ombre).rectangle((x + 6, y + 12, x + w - 6, y + h + 8), fill=70)
        places.append((x, y, w, h, im.resize((w, h), Image.LANCZOS)))
        x += w + ECART
    ombre = ombre.filter(ImageFilter.GaussianBlur(14))
    toile = Image.composite(Image.new('RGB', (W, H), ENCRE), toile, ombre)
    for px, py, w, h_, im in places:
        toile.paste(im, (px, py))
        print(f'{nom}: left:{px / W * 100:.2f}%;top:{py / H * 100:.2f}%;width:{w / W * 100:.2f}%;height:{h_ / H * 100:.2f}%')
    toile.save(ROOT / 'assets' / 'covers' / f'{nom}.webp', 'WEBP', quality=88)
