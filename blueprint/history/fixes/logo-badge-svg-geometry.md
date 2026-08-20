# Fix: Logo badge SVG geometry

**Type:** Fix
**Completed:** 2026-08-21

The fallback certificate logo now renders as one self-contained SVG with a
square `0 0 100 100` view box. Its outer ring and six Traversy Media dots use
fixed coordinates, equal grid spacing, and the exact center point for the stem,
so CSS layout cannot displace individual dots or distort the circle.

The rendered badge measured `124.421875px` square with zero aspect-ratio delta,
and its captured output matched the reference geometry. `npm run lint` and
`npm run build` passed.
