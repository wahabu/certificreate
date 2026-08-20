# Fix: Footer logo centering

**Type:** Fix
**Completed:** 2026-08-21

The certificate footer now uses two explicit `minmax(0, 1fr)` side tracks,
identical full-width signature/date blocks, and `justify-self: center` for the
logo badge. This prevents text length from influencing the middle track and
keeps the badge at the certificate's geometric 50% position.

Browser geometry checks with both a one-character instructor name and a long
instructor name measured the same `0.0078125px` center delta and equal side
tracks within `0.015625px` subpixel rounding. `npm run lint` and
`npm run build` passed.
