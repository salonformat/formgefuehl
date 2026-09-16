---
name: Salon Format · Formgefühl
description: An immersive pattern-to-room experience inspired by the Wiener Werkstätte.
colors:
  paper: "#f3efe5"
  ink: "#252820"
  red: "#b74332"
  red-hover: "#903527"
  brass: "#b38b40"
  muted-blue: "#48626b"
  muted: "#625e52"
  line: "#cbc5b7"
typography:
  display:
    fontFamily: "Della Respira, Georgia, serif"
    fontSize: "clamp(64px, 7.8vw, 116px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  primary-label:
    fontFamily: "Della Respira, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
  navigation-label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
rounded:
  circular: "50%"
spacing:
  swatch-gap: "10px"
  material-gap: "20px"
  page-gutter: "4.5vw"
  mobile-content-gutter: "24px"
  primary-padding: "19px 25px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    typography: "{typography.primary-label}"
    padding: "{spacing.primary-padding}"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
  language-active:
    textColor: "{colors.red}"
    typography: "{typography.navigation-label}"
  swatch:
    rounded: "{rounded.circular}"
    width: "30px"
    height: "30px"
---

# Salon Format · Formgefühl

## Overview

Mode: Experience. The artifact leads. A small amount of museum learning appears at the moment it explains an action.

## Colors

Palette: paper #f3efe5, ink #252820, vermilion #b74332, brass #b38b40, muted blue #48626b. Paper and ink dominate; vermilion carries Salon Format character. Brass belongs to material rather than generic luxury decoration.

## Typography

Typography: locally hosted Della Respira for expressive headings and large buttons; a restrained system sans serif for short instructions and controls. Never substitute a different display face.

## Layout

Composition: full-viewport editorial space with a geometric artifact occupying the right side on desktop. Split motif editor and live repetition. One central transformation opens a real-time 3D room. Mobile stacks explanation above the work, with controls always reachable. No cards, glass UI, dashboard chrome, or decorative statistics.

The paper header stays sticky at the top. Salon Format and the localized All projects link remain on the left; motion, sound, and the DE/EN language switch remain at the top right. At 760px and below, the brand links stack and the editor shows a full-width, 80px-high live repeat strip beneath the motif. At 400px and below, header gaps and padding tighten.

## Elevation & Depth

The interface uses flat paper surfaces and fine rules without box shadows; depth comes from the real-time room.

Motion: smooth camera transition from flat pattern to room; slow pointer parallax. Reduced motion removes continuous drift and uses short transitions. Audio off by default and explicitly enabled.

## Shapes

The motif and primary actions are rectangular; accent swatches and small sound indicators are circular.

## Components

Interaction: enter; edit 5×5 motif with pointer or keyboard; choose one accent; enter room; compare paper, textile, metal; reflect on the Gesamtkunstwerk; save a personal pattern print. All essential controls are native buttons or inputs. The room is interpretive, not a historical reconstruction.

The language selector uses native buttons with pressed state, muted inactive labels, and a red underlined active label. Switching language preserves the current work and updates the lang query parameter. Phase changes use the URL hashes #anfang, #zeichen, #raum, and #gedanke with native browser history; browser Back and Forward restore the corresponding phase.

Primary actions use a vermilion paper-colored label, darken on hover, and rise 2px over 0.2s. Keyboard focus uses a 3px red outline with 6px offset. Disabled buttons use 40% opacity.

## Do's and Don'ts

Quality bar: strong Della Respira typography, a genuinely spatial reveal, immediate feedback on user-designed motifs, short accurate learning text, accessible fallback, no unattributed museum imagery.

## Responsive refinement — 16 September 2026
The closing screen now uses the full desktop width: context and craft illustration, women designers with a large illustration, and a vermilion column containing the personal note and export. The ambient pattern is hidden on that reading screen. Images retain transparency and descriptive alt text; explanatory captions remain available to assistive technology.
Desktop editor actions remain visible at the bottom, while background information sits beside the pattern. On mobile, the editor scrolls in the space above its fixed action, avoiding content underneath the button. The introductory mobile pattern occupies a measured, separate block; its text and footer do not overlap the drawing.
