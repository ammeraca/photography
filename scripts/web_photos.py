"""Prépare les photos pour le site, à partir des originaux.

    photos/galleries/<album>/<n>.webp     (originaux, jamais modifiés ni servis)
        → public/images/galleries/<album>/<n>.webp   (versions web)

Chaque version web est :
  - réduite à MAX_SIDE px sur son plus grand côté (assez pour l'écran, trop
    petit pour un tirage) ;
  - signée d'un filigrane discret en bas à droite, si WATERMARK n'est pas vide.

On peut relancer le script autant de fois qu'on veut : il repart toujours des
originaux (pas de double filigrane). Après avoir ajouté des photos dans
photos/galleries :
    python3 scripts/web_photos.py
    python3 scripts/orientations.py
"""
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos" / "galleries"
OUT = ROOT / "public" / "images" / "galleries"

MAX_SIDE = 1600
QUALITY = 82
WATERMARK = ""  # ex. "© Mama_clic" ; vide = pas de filigrane
FONT = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
TEXT_OPACITY = 0.55  # 0 = invisible, 1 = blanc plein
FONT_RATIO = 0.024  # taille du texte / plus grand côté de la photo
MARGIN_RATIO = 0.025  # marge au bord / plus grand côté


def watermark(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")
    if not WATERMARK:
        return img
    side = max(img.size)
    font = ImageFont.truetype(FONT, max(14, round(side * FONT_RATIO)))
    margin = round(side * MARGIN_RATIO)

    draw = ImageDraw.Draw(img)
    left, top, right, bottom = draw.textbbox((0, 0), WATERMARK, font=font)
    x = img.width - margin - (right - left) - left
    y = img.height - margin - (bottom - top) - top

    # Ombre douce (lisible sur les zones claires), puis texte blanc translucide
    shadow = Image.new("L", img.size, 0)
    ImageDraw.Draw(shadow).text((x, y), WATERMARK, font=font, fill=round(255 * 0.45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(1, side / 600)))
    img.paste(Image.new("RGB", img.size, (0, 0, 0)), (0, 0), shadow)

    text = Image.new("L", img.size, 0)
    ImageDraw.Draw(text).text((x, y), WATERMARK, font=font, fill=round(255 * TEXT_OPACITY))
    img.paste(Image.new("RGB", img.size, (255, 255, 255)), (0, 0), text)
    return img


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    count = 0
    for src in sorted(SRC.rglob("*.webp")):
        dest = OUT / src.relative_to(SRC)
        dest.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as img:
            img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            # pas de métadonnées (EXIF…) dans les versions web
            watermark(img).save(dest, "WEBP", quality=QUALITY, method=6)
        count += 1
    print(f"{count} photos → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
