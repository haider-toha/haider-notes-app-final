#!/bin/sh
# Requires libwebp's cwebp. Both outputs use lossless encoding; only the small
# reading-page variant is resampled. The full-resolution WebP preserves pixels.
set -eu
cd "$(dirname "$0")/.."
cwebp -lossless -m 6 -exact public/sahad_tulip.png -o public/sahad_tulip.webp
cwebp -lossless -m 6 -exact -resize 320 0 public/sahad_tulip.png -o public/sahad_tulip-320.webp
