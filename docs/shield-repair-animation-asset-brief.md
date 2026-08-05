# RBS shield repair animation: asset brief

**Status:** future production asset brief. No motion is implemented by this brief.

## Verified asset inventory

- [`public/rbs-shield-only-logo.png`](/Users/mattgnelson/Developer/rootstock/reallybadsecurity-site/public/rbs-shield-only-logo.png) is a single 1024 × 1024 flattened PNG containing the shield, crack, and bandage together.
- No separate shield-base, crack, or bandage artwork exists in `public/` or `images/` as of this review.

The flattened PNG is the visual reference and permanent fallback. It must remain static and must not be altered or animated directly.

## Required production-quality asset package

Create three aligned, transparent layers that preserve the original mark’s dimensional, beveled, polished orange-and-blue finish:

1. `rbs-shield-base` — uncracked shield, with no bandage.
2. `rbs-shield-crack` — crack/split state only, transparent outside the fracture.
3. `rbs-shield-bandage` — bandage only, transparent outside the bandage.

Each layer must share a square canvas, identical visual bounds, a common origin, and a documented source/design owner. Do not use flat clip-art, generic shield geometry, thick black outlines, or simplified cartoon styling.

### Deliverables

- Editable SVG or original design-source layers for all three layers.
- Transparent exported PNG fallbacks for each layer at 2× and 3× the approved hero display size.
- A short alignment sheet showing the three layers overlaid on the existing PNG reference.
- A licensing/source record confirming the artwork is original to RBS and may be used in the website hero.

## Future behavior (not implemented)

After a one-time, nonessential entrance: the intact shield cracks, its halves separate slightly, the shield rejoins, the bandage lands, and the repaired mark remains still. It must not loop, replay on ordinary navigation, or gate content. Under `prefers-reduced-motion: reduce`, render the existing repaired PNG immediately with no transition.

## Acceptance criteria before implementation

- Owner approves the three source layers, their visual alignment, and their fidelity to the existing shield mark.
- All layers have descriptive repository metadata and no embedded external dependency.
- The final static state matches the existing shield mark’s dimensional finish rather than merely preserving recognition.
- The animation has a reduced-motion path, keyboard-independent behavior, and no layout shift.
