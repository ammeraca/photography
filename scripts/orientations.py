"""Génère src/lib/albumOrientations.ts : le format (paysage / portrait) de chaque photo.

À relancer après avoir ajouté ou remplacé des photos :
    python3 scripts/orientations.py
"""
import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
GALLERIES = ROOT / "public" / "images" / "galleries"
OUT = ROOT / "src" / "lib" / "albumOrientations.ts"

data = {}
for album in sorted(p for p in GALLERIES.iterdir() if p.is_dir()):
    files = sorted(
        (f for f in album.iterdir() if re.fullmatch(r"\d+\.webp", f.name)),
        key=lambda f: int(f.stem),
    )
    formats = []
    for f in files:
        with Image.open(f) as img:
            formats.append("landscape" if img.width >= img.height else "portrait")
    data[album.name] = formats

OUT.write_text(
    "// Fichier généré par scripts/orientations.py — ne pas modifier à la main.\n"
    "// Format de chaque photo, dans l'ordre des fichiers (1.webp, 2.webp, …).\n\n"
    "export const albumOrientations: Record<string, (\"landscape\" | \"portrait\")[]> = "
    + json.dumps(data, indent="\t")
    + ";\n"
)
print(f"✔ {OUT.relative_to(ROOT)} : " + ", ".join(f"{k} ({len(v)})" for k, v in data.items()))
