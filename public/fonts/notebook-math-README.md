Notebook Math preserves the original Reenie Beanie outlines and adds the 27
missing mathematical/spacing characters used by equations and simulations.
The new Greek letters and operators use authored curved pen strokes with slight
pressure variation, using the original font's 1000-unit em and writing height.
No equation text or mathematical notation is substituted.

OpenType stylistic sets preserve mathematical alphabet distinctions within the
handwriting: `ss01` supplies a double-stroked E for `\mathbb{E}`, and `ss02` supplies
a looped script L for `\mathcal{L}`. Source text and MathML retain their codepoints.

`ss03` through `ss06` provide handwritten delimiters at KaTeX's four expected
size metrics, including the correct baseline and advance widths. Each is newly
drawn at its intended height with constant pen weight; only numerical bounds are
read from KaTeX, never its typeset outlines. Large sums/integrals use the same
metric-aware variants, so brackets surround matrices and limits align properly.
The added pen strokes use a 44-unit width, matching measured original Reenie
Latin strokes (approximately 41–45 units) rather than rendering Greek lighter.

The renamed derivative and its build source are licensed under SIL OFL 1.1;
see `notebook-math-OFL.txt` for the original copyright and complete license.

Reproduce from the repository root with Python 3.11 or newer:

```sh
node scripts/collect-notebook-math-glyphs.mjs
python3 -m venv /tmp/notebook-font-tools
/tmp/notebook-font-tools/bin/pip install fonttools==4.64.0 brotli==1.2.0
/tmp/notebook-font-tools/bin/python scripts/build-notebook-math-font.py
```

The generator rejects uncovered source-equation characters. The inventory is
generated from KaTeX's HTML output for all source equations; invisible MathML
and structural SVG paths are excluded. KaTeX keeps its equation layout, including
fractions, subscripts, superscripts, and scalable vector radicals.
