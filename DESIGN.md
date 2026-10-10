# alessandrobattisti.com design rules ("Trace", Oct 2026)

One page, one color, one pixel size. Code: `src/personal.css` (scoped under `.ab`),
`src/components/{SiteFrame,Trace,PixelIcon}.tsx`, `src/pages/{Home,NotFound}.tsx`.

## Tokens
- `--ab-bg #E7E8E4` cool grey page
- `--ab-ink #2430E0` the only color: text, links, pixels. 6.9:1 on the page
- `--ab-tint #CDD0E3` hairlines only, never text
- `--ab-px 2px` the pixel size for everything drawn
- Type: Bricolage Grotesque (self-hosted, `src/fonts`). Name 750, company names 650, body 400 to 450, labels 650 at 14px

## The 2px rule
Every graphic is 1-bit and sits on the same 2px grid:
- Bands: `src/img/band.png` (480 x 24) shown at 960 x 48. Bands are the only dividers between sections
- Icons: 14 x 12 grids in `PixelIcon.tsx`, shown at 28 x 24
- Trail: 2px squares
- Cursors: pixel arrow and crosshair drawn at 2px
- Exceptions: the portrait (below), and a sprite shown big as a hero (Mango on the 404), which must still be a whole multiple of 2 (12px now)

## Portrait
- The Brooklyn Bridge photo, wide crop with the skyline, 260 x 325 Atkinson dither, ink pixels on transparent so the page grey shows through
- Shown at up to 390px wide (1.5px per image pixel, 3 device pixels on retina), `image-rendering: pixelated`
- A tighter head-and-shoulders crop at 200 x 250 was tried and rejected: it read as odd

## Behavior
- Cursor trail dissolves pixel by pixel over about 3.5 seconds, at most 1,500 pixels on screen
- "You've wandered X m" counts cursor distance on desktop and scroll distance on phones (96 dpi, 3,780 px per metre), shown once past 0.5 m
- Reduced motion: no trail, no link animation. The counter still works
- Link hover: ink fills in from the left in 5 steps, text flips to the page grey

## Don't
- Add a second color, gradients, shadows, rounded corners or cards
- Use hairlines between sections (use a band) or a pixel size other than 2px
- Use handwriting fonts, sticky notes, tape, or anything that reads as a research wall
- Load anything from a third party (fonts, analytics, embeds)
- Use em dashes in copy

## Making new pixel images
Recipe: grayscale, crop to 4:5, autocontrast, resize, Atkinson dither, ink pixels on transparent.
Keep the background in the shot. Use the same recipe for the Mango photo.
