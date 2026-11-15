import os
import sys
from pathlib import Path
from PIL import Image

# ====== SETTINGS ======
MAX_WIDTH = 1920       # Change if needed
QUALITY = 82           # 75–85 is ideal for web
OUTPUT_FORMAT = "WEBP" # WEBP recommended
# ======================


def optimize_image(input_path: Path, output_path: Path):
    try:
        with Image.open(input_path) as img:
            img = img.convert("RGB")

            # Resize if wider than MAX_WIDTH
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                new_height = int(img.height * ratio)
                img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

            output_path.parent.mkdir(parents=True, exist_ok=True)

            img.save(
                output_path.with_suffix(".webp"),
                OUTPUT_FORMAT,
                quality=QUALITY,
                optimize=True,
                method=6
            )

            print(f"✔ Optimized: {input_path.name}")

    except Exception as e:
        print(f"✘ Failed: {input_path.name} → {e}")


def process_folder(folder_path: Path):
    supported_formats = [".jpg", ".jpeg", ".png"]

    for root, _, files in os.walk(folder_path):
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in supported_formats:
                input_path = Path(root) / file

                relative_path = input_path.relative_to(folder_path)
                output_path = folder_path / "optimized" / relative_path

                optimize_image(input_path, output_path)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python optimize_images.py <folder_path>")
        sys.exit(1)

    folder = Path(sys.argv[1])

    if not folder.exists():
        print("Folder does not exist.")
        sys.exit(1)

    process_folder(folder)

    print("\n🎉 All images processed.")