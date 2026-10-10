# alessandrobattisti.com design rules ("Trace", Oct 2026)

One page, one color, one pixel size. Code: `src/personal.css` (scoped under `.ab`),
`src/components/{SiteFrame,Trace,PixelIcon}.tsx`, `src/pages/{Home,NotFound}.tsx`.

## Tokens
- `--ab-bg #E7E8E4` cool grey page
- `--ab-ink #2430E0` the only color: text, links, pixels. 6.9:1 on the page
- `--ab-tint #CDD0E3` portrait card and hairlines only, never text
- `--ab-px 2px` the pixel size for everything drawn
- Type: Bricolage Grotesque (self-hosted, `src/fonts`). Name 750, company names 650, body 400 to 450, labels 650 at 14px

## The 2px rule
Every graphic is 1-bit and sits on the same 2px grid:
- Portrait: 200 x 250 Atkinson dither, shown at 400 x 500 max, `image-rendering: pixelated`
- Bands: `src/img/band.png` (480 x 24) shown at 960 x 48. Bands are the only dividers between sections
- Icons: 14 x 12 grids in `PixelIcon.tsx`, shown at 28 x 24
- Trail: 2px squares
- Cursors: pixel arrow and crosshair drawn at 2px
- The one exception is a sprite shown big as a hero (Mango on the 404), which must still be a whole multiple of 2 (12px now)

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
Portrait script lives with the design comps, not in the repo. Recipe: grayscale, crop to 4:5 head and shoulders,
levels (0.12 to 0.84), fade background to white, lift dark clothing to about 50% grey so the face is the darkest
area, resize to 200 x 250, Atkinson dither, ink pixels on transparent. Use the same recipe for the Mango photo.
