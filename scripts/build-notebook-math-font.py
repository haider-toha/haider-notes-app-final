# SPDX-License-Identifier: OFL-1.1
"""Build the OFL Notebook Math derivative; requires fonttools and brotli.

Run with Python 3.11+: python scripts/build-notebook-math-font.py
Existing Reenie Beanie outlines are retained. Missing mathematical symbols are
original pen strokes drawn in the same loose, narrow handwriting style.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.pens.basePen import BasePen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts"
Point = tuple[float, float]

# Coordinates use Reenie's 1000-unit em: lowercase tops around 400, capitals
# around 600. Curved, slightly asymmetric centerlines avoid mechanical strokes.
# Each entry is (advance width, pen strokes); none are substituted Latin glyphs.
STROKES: dict[str, tuple[int, list[str]]] = {
    "Θ": (480, ["M245 572 C55 585 28 80 230 50 C435 24 452 558 245 572", "M90 290 C190 308 281 279 391 310"]),
    "θ": (360, ["M196 430 C38 428 36 46 178 39 C327 24 338 425 196 430", "M66 211 C151 231 214 210 292 235"]),
    "λ": (400, ["M84 568 C155 603 186 408 216 291 C242 170 285 61 351 40", "M220 278 C174 211 107 111 48 25"]),
    "ν": (360, ["M57 385 C98 339 93 157 116 65 C186 130 265 267 309 390"]),
    "ρ": (390, ["M66 -162 C83 -28 95 122 106 257 C118 394 297 422 326 289 C356 154 223 53 109 132"]),
    "τ": (390, ["M39 363 C141 388 250 366 343 381", "M220 372 C200 261 174 142 193 72 C205 38 228 50 247 70"]),
    "ψ": (480, ["M59 358 C72 205 75 116 203 105 C336 85 390 222 412 359", "M274 477 C259 305 230 46 211 -164"]),
    "ϕ": (450, ["M254 371 C111 415 35 221 105 117 C199 -11 391 123 384 253 C380 326 323 378 254 371", "M286 511 C256 309 222 54 196 -152"]),
    "ϵ": (355, ["M302 351 C131 440 59 315 92 240 C50 172 87 57 273 79", "M93 242 C147 259 215 240 267 254"]),
    "β": (390, ["M63 -144 C87 31 101 245 124 446 C134 569 293 620 314 501 C334 402 222 326 126 323 C268 346 359 286 328 180 C302 88 206 56 114 98"]),
    "φ": (430, ["M233 366 C73 380 43 121 185 87 C343 52 398 345 233 366", "M256 512 C250 301 214 36 199 -151"]),
    "⊥": (415, ["M218 526 C215 365 211 211 206 65", "M46 58 C158 75 272 54 367 71"]),
    "→": (660, ["M50 239 C219 246 423 233 590 248", "M450 376 C506 321 550 281 594 247 C546 215 494 169 451 127"]),
    "∀": (465, ["M49 555 C106 408 163 217 221 32 C290 211 358 417 414 572", "M127 332 C211 344 300 330 351 341"]),
    "∇": (475, ["M53 549 C170 558 308 547 423 564 C352 390 292 219 230 37 C166 208 110 382 53 549"]),
    "∈": (445, ["M392 418 C228 467 83 380 78 244 C68 104 207 30 380 72", "M82 244 C178 250 281 234 373 248"]),
    "∗": (370, ["M185 391 C194 304 177 208 182 112", "M62 322 C155 273 218 234 312 181", "M69 170 C154 223 225 277 308 328"]),
    "∝": (530, ["M475 351 C349 421 291 112 171 98 C55 82 45 320 154 340 C266 362 360 52 475 105"]),
    "∣": (175, ["M91 558 C99 371 78 180 83 -65"]),
    "⋅": (235, ["M119 225 L121 226"]),
    "⌈": (270, ["M229 580 C172 578 119 584 66 572 C62 359 61 131 67 -84"]),
    "⌉": (270, ["M39 578 C94 584 148 578 207 582 C203 369 211 135 202 -80"]),
    "⌊": (270, ["M68 578 C60 357 71 136 63 -81 C119 -77 170 -85 231 -78"]),
    "⌋": (270, ["M201 579 C214 361 196 136 209 -79 C148 -81 91 -76 37 -86"]),
    "⟹": (720, ["M45 297 C232 305 405 294 581 304", "M49 192 C244 194 413 185 581 198", "M473 422 C536 344 600 297 664 246 C599 208 534 141 468 75"]),
    "\ue020": (320, ["M45 -21 C105 177 185 371 267 561"]),
}

# Keep semantic alphabet distinctions within the same handwritten font family.
# Alternates preserve the source E/L codepoints and activate only in mathbb/cal.
ALTERNATES: dict[str, tuple[int, list[str]]] = {
    "notebookDoubleStruckE": (440, [
        "M82 42 C83 223 92 407 99 575 C207 584 302 569 388 581",
        "M153 574 C143 412 143 223 136 52",
        "M87 312 C176 324 261 306 336 318",
        "M80 46 C182 58 277 39 382 53",
    ]),
    "notebookScriptL": (490, [
        "M54 250 C191 292 347 533 273 590 C182 658 103 431 143 239 C166 131 131 57 70 59 C174 136 333 -17 444 79",
    ]),
}


def sized_symbol_paths(character: str, bounds: tuple[int, int, int, int]) -> list[str]:
    """Draw new pen strokes at the height/baseline expected by KaTeX layout.

    Only numeric bounds are read from KaTeX. No typeset outlines are copied;
    keeping pen width constant avoids fat horizontal strokes on tall brackets.
    """
    x_min, y_min, x_max, y_max = bounds
    left, bottom, right, top = x_min + 22, y_min + 22, x_max - 22, y_max - 22
    middle = (top + bottom) / 2
    height = top - bottom
    if character in "[]⌈⌉⌊⌋":
        outer, inner = (left, right) if character in "[⌈⌊" else (right, left)
        strokes = [f"M{outer} {top} C{outer + 5} {top - height / 3} {outer - 4} {bottom + height / 3} {outer} {bottom}"]
        if character not in "⌊⌋":
            strokes.append(f"M{outer} {top} C{(inner + outer) / 2} {top + 3} {inner - 4} {top - 2} {inner} {top}")
        if character not in "⌈⌉":
            strokes.append(f"M{outer} {bottom} C{(inner + outer) / 2} {bottom - 3} {inner + 3} {bottom + 2} {inner} {bottom}")
        return strokes
    if character in "()":
        outer, inner = (left, right) if character == "(" else (right, left)
        return [f"M{inner} {top} C{outer} {top - height * .2} {outer - 3} {middle + height * .16} {outer} {middle} C{outer + 3} {middle - height * .16} {outer} {bottom + height * .2} {inner} {bottom}"]
    if character in "{}":
        outer, inner = (left, right) if character == "{" else (right, left)
        spine = (outer + inner) / 2
        return [f"M{inner} {top} C{spine - 3} {top} {spine} {top - height * .1} {spine} {top - height * .2} C{spine + 4} {middle + height * .08} {spine} {middle + height * .03} {outer} {middle} C{spine} {middle - height * .03} {spine - 3} {middle - height * .08} {spine} {bottom + height * .2} C{spine} {bottom + height * .1} {spine + 3} {bottom} {inner} {bottom}"]
    if character == "∑":
        center = left + (right - left) * .58
        return [f"M{right} {top} C{(left + right) / 2} {top + 3} {left + 4} {top - 3} {left} {top} L{center} {middle} L{left + 4} {bottom} C{(left + right) / 2} {bottom + 4} {right - 4} {bottom - 2} {right} {bottom}"]
    if character == "∫":
        center = (left + right) / 2
        return [f"M{right} {top - 28} C{center} {top + 40} {center + 8} {top - height * .12} {center} {middle} C{center - 8} {bottom + height * .12} {center} {bottom - 40} {left} {bottom + 28}"]
    raise ValueError(f"No handwritten size geometry for {character!r}")


class Centerlines(BasePen):
    """Flatten authored curves into short segments for a varying-width pen."""

    def __init__(self) -> None:
        super().__init__(None)
        self.strokes: list[list[Point]] = []

    def _moveTo(self, point: Point) -> None:
        self.strokes.append([point])

    def _lineTo(self, point: Point) -> None:
        self.strokes[-1].append(point)

    def _curveToOne(self, first: Point, second: Point, end: Point) -> None:
        start = self.strokes[-1][-1]
        for step in range(1, 19):
            t = step / 18
            self.strokes[-1].append(tuple(
                (1 - t) ** 3 * start[axis] + 3 * (1 - t) ** 2 * t * first[axis]
                + 3 * (1 - t) * t * t * second[axis] + t ** 3 * end[axis]
                for axis in (0, 1)
            ))

    def _closePath(self) -> None:
        self.strokes[-1].append(self.strokes[-1][0])

    def _endPath(self) -> None:
        pass


def outline_stroke(pen: TTGlyphPen, points: list[Point], width: float) -> None:
    """Create a filled pen outline with subtle pressure variation and round ends."""
    left: list[Point] = []
    right: list[Point] = []
    angles: list[float] = []
    radii: list[float] = []
    for index, (x, y) in enumerate(points):
        previous = points[max(0, index - 1)]
        following = points[min(len(points) - 1, index + 1)]
        angle = math.atan2(following[1] - previous[1], following[0] - previous[0])
        radius = width / 2 * (1 + 0.12 * math.sin(index * 0.43))
        normal = (-math.sin(angle) * radius, math.cos(angle) * radius)
        left.append((x + normal[0], y + normal[1]))
        right.append((x - normal[0], y - normal[1]))
        angles.append(angle)
        radii.append(radius)
    contour = left[:]
    for step in range(1, 9):
        angle = angles[-1] + math.pi / 2 - math.pi * step / 8
        contour.append((points[-1][0] + math.cos(angle) * radii[-1], points[-1][1] + math.sin(angle) * radii[-1]))
    contour.extend(reversed(right))
    for step in range(1, 9):
        angle = angles[0] - math.pi / 2 - math.pi * step / 8
        contour.append((points[0][0] + math.cos(angle) * radii[0], points[0][1] + math.sin(angle) * radii[0]))
    pen.moveTo(contour[0])
    for point in contour[1:]:
        pen.lineTo(point)
    pen.closePath()


def build_font() -> None:
    """Retain Reenie outlines, add the audited symbols, and emit a compact WOFF2."""
    font = TTFont(FONTS / "reenie.ttf", recalcTimestamp=False)
    glyph_order = list(font.getGlyphOrder())
    additions = {**STROKES, "\u200b": (0, [])}
    glyphs = {f"notebook{ord(character):04X}": specification for character, specification in additions.items()}
    glyphs.update(ALTERNATES)
    size_substitutions: dict[str, list[tuple[str, str]]] = {}
    for size in range(1, 5):
        metric_font = TTFont(ROOT / "node_modules" / "katex" / "dist" / "fonts" / f"KaTeX_Size{size}-Regular.ttf")
        metric_cmap = metric_font.getBestCmap()
        substitutions = size_substitutions[f"ss0{size + 2}"] = []
        for character in "[](){}⌈⌉⌊⌋∑∫":
            if ord(character) not in metric_cmap:
                continue
            original = metric_cmap[ord(character)]
            metric = metric_font["glyf"][original]
            name = f"notebookSize{size}_{ord(character):04X}"
            glyphs[name] = (metric_font["hmtx"][original][0], sized_symbol_paths(character, (metric.xMin, metric.yMin, metric.xMax, metric.yMax)))
            substitutions.append((character, name))
    for name, (advance, paths) in glyphs.items():
        pen = TTGlyphPen(None)
        for path in paths:
            lines = Centerlines()
            parse_path(path, lines)
            for stroke in lines.strokes:
                outline_stroke(pen, stroke, 44)
        glyph = pen.glyph()
        font["glyf"][name] = glyph
        glyph.recalcBounds(font["glyf"])
        font["hmtx"][name] = (advance, getattr(glyph, "xMin", 0))
        glyph_order.append(name)
    for character in additions:
        for table in font["cmap"].tables:
            if table.isUnicode():
                table.cmap[ord(character)] = f"notebook{ord(character):04X}"
    font.setGlyphOrder(glyph_order)
    font["maxp"].numGlyphs = len(glyph_order)
    features = """
        feature ss01 { sub E by notebookDoubleStruckE; } ss01;
        feature ss02 { sub L by notebookScriptL; } ss02;
    """
    for tag, substitutions in size_substitutions.items():
        mappings = " ".join(f"sub {font.getBestCmap()[ord(character)]} by {name};" for character, name in substitutions)
        features += f"feature {tag} {{ {mappings} }} {tag};\n"
    addOpenTypeFeaturesFromString(font, features)
    for record in font["name"].names:
        names = {1: "Notebook Math", 2: "Regular", 3: "Notebook Math 1.0", 4: "Notebook Math Regular", 6: "NotebookMath-Regular", 16: "Notebook Math", 17: "Regular"}
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    font["OS/2"].recalcUnicodeRanges(font)
    inventory = json.loads((ROOT / "scripts" / "notebook-math-glyphs.json").read_text())
    missing = [character for character in inventory["characters"] if ord(character) not in font.getBestCmap()]
    if missing:
        raise ValueError(f"Uncovered equation characters: {missing!r}")
    font.flavor = "woff2"
    destination = FONTS / "notebook-math.woff2"
    font.save(destination)
    print(f"Built {destination.relative_to(ROOT)}: {len(inventory['characters'])} audited characters; {len(additions)} added outlines/spacing glyphs.")


if __name__ == "__main__":
    build_font()
