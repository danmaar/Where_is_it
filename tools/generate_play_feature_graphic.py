from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH = 1024
HEIGHT = 500


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates.extend(
            [
                Path("C:/Windows/Fonts/segoeuib.ttf"),
                Path("C:/Windows/Fonts/arialbd.ttf"),
            ]
        )
    else:
        candidates.extend(
            [
                Path("C:/Windows/Fonts/segoeui.ttf"),
                Path("C:/Windows/Fonts/arial.ttf"),
            ]
        )

    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)

    return ImageFont.load_default()


def vertical_gradient(width: int, height: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    gradient = Image.new("RGB", (width, height), top)
    draw = ImageDraw.Draw(gradient)
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = tuple(
            int(top[i] * (1 - ratio) + bottom[i] * ratio)
            for i in range(3)
        )
        draw.line((0, y, width, y), fill=color)
    return gradient


def add_glow(base: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], opacity: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, opacity))
    blurred = overlay.filter(ImageFilter.GaussianBlur(radius=26))
    base.alpha_composite(blurred)


def add_shadowed_logo(base: Image.Image, logo_path: Path, position: tuple[int, int], size: tuple[int, int]) -> None:
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail(size, Image.LANCZOS)

    shadow = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (30, 30, shadow.width - 20, shadow.height - 12),
        radius=48,
        fill=(5, 12, 22, 180),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    base.alpha_composite(shadow, (position[0] + 8, position[1] + 24))
    base.alpha_composite(logo, position)


def draw_chip(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    font: ImageFont.ImageFont,
    width: int | None = None,
    height: int | None = None,
) -> None:
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    text_width = right - left
    width = width or (text_width + 34)
    text_height = bottom - top
    height = height or (text_height + 18)
    draw.rounded_rectangle(
        (x, y, x + width, y + height),
        radius=20,
        fill=(245, 238, 228),
        outline=(214, 199, 180),
        width=2,
    )
    text_x = x + (width - text_width) / 2 - left
    text_y = y + (height - text_height) / 2 - top - 1
    draw.text((text_x, text_y), text, font=font, fill=(64, 53, 45))


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    logo_path = repo_root / "assets" / "logo_inventory.png"
    output_dir = repo_root / "assets" / "google-play"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "feature-graphic-1024x500.png"

    background = vertical_gradient(
        WIDTH,
        HEIGHT,
        top=(247, 241, 232),
        bottom=(226, 220, 211),
    ).convert("RGBA")

    add_glow(background, (182, 145), 150, (255, 184, 62), 120)
    add_glow(background, (770, 112), 170, (73, 120, 157), 90)
    add_glow(background, (874, 392), 180, (34, 59, 82), 70)

    overlay = Image.new("RGBA", background.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)

    overlay_draw.rounded_rectangle(
        (38, 34, WIDTH - 38, HEIGHT - 34),
        radius=32,
        outline=(255, 255, 255, 95),
        width=2,
    )

    overlay_draw.rounded_rectangle(
        (432, 64, 970, 438),
        radius=36,
        fill=(255, 252, 247, 155),
        outline=(255, 255, 255, 110),
        width=2,
    )

    overlay_draw.rounded_rectangle(
        (454, 92, 948, 164),
        radius=24,
        fill=(238, 245, 249, 165),
    )
    overlay_draw.rounded_rectangle(
        (454, 184, 716, 290),
        radius=28,
        fill=(255, 247, 233, 155),
    )
    overlay_draw.rounded_rectangle(
        (736, 184, 948, 330),
        radius=28,
        fill=(232, 241, 247, 165),
    )
    overlay_draw.rounded_rectangle(
        (454, 308, 690, 390),
        radius=24,
        fill=(245, 239, 230, 150),
    )

    background.alpha_composite(overlay)

    add_shadowed_logo(background, logo_path, position=(88, 68), size=(340, 340))

    draw = ImageDraw.Draw(background)
    heading_font = load_font(70, bold=True)
    title_font = load_font(26, bold=False)
    body_font = load_font(24, bold=False)
    chip_font = load_font(18, bold=True)

    draw.text((468, 102), "Where is it?", font=heading_font, fill=(29, 27, 26))
    draw.text(
        (470, 188),
        "Home inventory that stays easy to search,",
        font=title_font,
        fill=(78, 71, 66),
    )
    draw.text(
        (470, 220),
        "browse, and trust.",
        font=title_font,
        fill=(78, 71, 66),
    )

    draw.text(
        (470, 286),
        "Keep photos, locations, and notes in one calm,",
        font=body_font,
        fill=(61, 57, 53),
    )
    draw.text(
        (470, 316),
        "offline-first place.",
        font=body_font,
        fill=(61, 57, 53),
    )

    chip_width = 154
    chip_height = 42
    chip_gap = 10
    chip_row_x = 458
    chip_y = 374

    draw_chip(draw, chip_row_x, chip_y, "Quick search", chip_font, width=chip_width, height=chip_height)
    draw_chip(
        draw,
        chip_row_x + chip_width + chip_gap,
        chip_y,
        "Photo support",
        chip_font,
        width=chip_width,
        height=chip_height,
    )
    draw_chip(
        draw,
        chip_row_x + (chip_width + chip_gap) * 2,
        chip_y,
        "Private & local",
        chip_font,
        width=chip_width,
        height=chip_height,
    )

    final = background.convert("RGB")
    final.save(output_path, format="PNG", optimize=True)
    print(output_path)


if __name__ == "__main__":
    main()
