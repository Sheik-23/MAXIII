---
version: alpha
name: maxiii-design-system
description: "A high-performance, dark-mode nutrition engineering canvas designed for Indian gym-goers, lifters, and home cooks. Built around deep obsidian canvas (#0B0F17), technical charcoal elevation surfaces (#121822 to #1A2230), and hairline slate borders (#232D3F). The chromatic palette features high-velocity Emerald Green (#10B981) for protein hits and target adherence, alongside warm Culinary Saffron Amber (#F59E0B) for home-cooking yields and energy. The design evokes disciplined athletic engineering: dense, numeric-first, fast-logging ergonomics with zero wellness fluff. Typography utilizes modern system sans with tight numeric tracking, prominent macro tags, and household portion affordances (katori, ladle, phulka)."

colors:
  # Brand & Core Chromatic
  primary: "#10B981"                 # Emerald green: protein hits, completed goals, primary CTAs
  primary-hover: "#059669"
  primary-muted: "rgba(16, 185, 129, 0.16)"
  on-primary: "#000000"              # High-contrast black text on emerald primary buttons
  
  accent: "#F59E0B"                  # Warm Saffron Amber: cooking yield engine, flame, energy
  accent-hover: "#D97706"
  accent-muted: "rgba(245, 158, 11, 0.16)"
  on-accent: "#000000"

  # Macro-Nutrient Chromatic Matrix (Fixed & Non-negotiable)
  protein: "#10B981"                 # Emerald: Lifter priority #1
  protein-muted: "rgba(16, 185, 129, 0.15)"
  carbs: "#FBBF24"                   # Gold Amber: Fuel & glycogen
  carbs-muted: "rgba(251, 191, 36, 0.15)"
  fat: "#FB7185"                     # Rose Coral: Lipids & oils
  fat-muted: "rgba(251, 113, 133, 0.15)"
  fibre: "#A78BFA"                   # Lavender Purple: Digestive fibre goal
  fibre-muted: "rgba(167, 139, 250, 0.15)"
  calories: "#38BDF8"                # Electric Sky Blue: Daily energy budget
  calories-muted: "rgba(56, 189, 248, 0.15)"

  # Text & Ink
  ink: "#F8FAFC"                     # Primary text: Crisp near-white
  ink-secondary: "#94A3B8"           # Secondary text: Slate grey
  ink-tertiary: "#64748B"            # Muted text: Deep slate captions, unit labels
  ink-inverse: "#0B0F17"             # Deep obsidian for inverse badge text

  # Surfaces & Canvas
  canvas: "#0B0F17"                  # Root background: Deep obsidian blue-black
  surface-1: "#121822"               # Primary cards, summary panels
  surface-2: "#1A2230"               # Interactive elements, form fields, secondary buttons
  surface-3: "#212B3D"               # Active states, selected tabs, floating modals
  surface-highlight: "#0F181B"       # Subtle green-tinted charcoal for protein highlight cards

  # Borders & Dividers
  hairline: "#232D3F"                # Card borders, cell dividers
  hairline-strong: "#334155"         # Focused inputs, active chips
  hairline-accent: "rgba(16, 185, 129, 0.35)" # Protein focus rings & yield borders

  # Data Source Verification Badges
  source-yield-bg: "rgba(16, 185, 129, 0.18)"
  source-yield-text: "#34D399"
  source-usda-bg: "rgba(56, 189, 248, 0.18)"
  source-usda-text: "#38BDF8"
  source-label-bg: "rgba(245, 158, 11, 0.18)"
  source-label-text: "#FBBF24"

typography:
  display-xl:
    fontSize: 28px
    fontWeight: 900
    letterSpacing: -0.6px
    lineHeight: 1.15
  display-lg:
    fontSize: 22px
    fontWeight: 800
    letterSpacing: -0.4px
    lineHeight: 1.2
  heading-md:
    fontSize: 17px
    fontWeight: 800
    letterSpacing: -0.2px
    lineHeight: 1.3
  body-md:
    fontSize: 14px
    fontWeight: 500
    letterSpacing: 0px
    lineHeight: 1.4
  body-sm:
    fontSize: 13px
    fontWeight: 600
    letterSpacing: 0px
    lineHeight: 1.4
  caption:
    fontSize: 11px
    fontWeight: 700
    letterSpacing: 0.4px
    lineHeight: 1.3
  micro-label:
    fontSize: 10px
    fontWeight: 800
    letterSpacing: 0.6px
    textTransform: uppercase

rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 18px
  pill: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px

components:
  # Navigation & Tabs
  bottom-tab-bar:
    background: "{colors.surface-1}"
    borderTop: "1px solid {colors.hairline}"
    height: 64px
    activeColor: "{colors.primary}"
    inactiveColor: "{colors.ink-secondary}"
    labelSize: 11px
    labelWeight: 600

  # Calorie Energy Progress Card
  calorie-budget-card:
    background: "{colors.surface-1}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.lg}"
    remainingHighlightColor: "{colors.primary}"
    barTrackColor: "{colors.surface-2}"
    barFillColor: "{colors.primary}"

  # Lifter Macro Card
  macro-pill-card:
    background: "{colors.surface-1}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.md}"
    progressTrack: "{colors.surface-2}"
    proteinVariant:
      background: "{colors.surface-highlight}"
      border: "1px solid {colors.hairline-accent}"

  # Meal Section Group
  meal-section-group:
    background: "{colors.surface-1}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.md}"
    headerBorderBottom: "1px solid {colors.hairline}"
    rowBorderBottom: "1px solid rgba(255, 255, 255, 0.04)"

  # Buttons
  button-primary:
    background: "{colors.primary}"
    textColor: "{colors.on-primary}"
    fontWeight: 800
    borderRadius: "{rounded.md}"
    padding: "12px 16px"
    minHeight: 44px
  button-secondary:
    background: "{colors.surface-2}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    fontWeight: 600
    borderRadius: "{rounded.md}"
    padding: "10px 14px"
    minHeight: 40px
  button-action-small:
    background: "{colors.primary-muted}"
    border: "1px solid {colors.hairline-accent}"
    textColor: "{colors.primary}"
    borderRadius: "{rounded.sm}"
    padding: "5px 10px"

  # Form Inputs & Search
  text-input:
    background: "{colors.surface-2}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    padding: "10px 12px"
    textColor: "{colors.ink}"
    placeholderColor: "{colors.ink-tertiary}"
    focusBorder: "{colors.primary}"
    minHeight: 44px

  # Filter Pills & Language Chips
  filter-pill:
    background: "{colors.surface-2}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.pill}"
    padding: "6px 12px"
    activeBackground: "{colors.primary-muted}"
    activeBorder: "{colors.primary}"
    activeTextColor: "{colors.primary}"

  # Yield Engine Calculator Dashboard
  yield-results-panel:
    background: "#0F1A24"
    border: "1px solid rgba(56, 189, 248, 0.3)"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.lg}"
    densityPillBackground: "rgba(56, 189, 248, 0.15)"
    densityTextColor: "{colors.calories}"
---

# MAXIII: Visual Design & UX Specification (DESIGN.md)

This document serves as the canonical design contract for MAXIII. Any AI agent or developer building or updating screens must strictly follow these rules, component tokens, and ergonomic guidelines.

---

## 1. Visual Theme & Atmosphere

- **Core Identity:** Precision athletic engineering for Indian nutrition. MAXIII is built for serious lifters, bodybuilders, and everyday people who weigh their home-cooked dishes.
- **Atmosphere:** Dark obsidian canvas (`#0B0F17`) reminiscent of technical developer tools (Linear, Raycast) combined with athletic data visualization.
- **Zero Wellness Fluff:** No pastel watercolor gradients, no stock images of smiling avocados, no vague "intuitive eating" messaging. Every number is grounded in weighed grams, Atwater verification, and raw-to-cooked yield mathematics.
- **Information Density:** High density, high scannability. Lifters check their protein multiple times a day: remaining protein and calories must be legible in under 1 second of screen glance.

---

## 2. Color Matrix & Functional Roles

| Token | Hex / Value | Purpose |
|---|---|---|
| `primary` | `#10B981` (Emerald) | Protein hit completion, primary action CTAs, target adherence |
| `accent` | `#F59E0B` (Saffron Amber) | Yield engine branding, cooking oil calculations, culinary yield ratio |
| `calories` | `#38BDF8` (Sky Blue) | Energy budget, daily kcal consumed |
| `protein` | `#10B981` (Emerald) | Protein grams (1st priority for lifters, 2.0g/kg bodyweight) |
| `carbs` | `#FBBF24` (Gold) | Carbohydrates (rice, phulka, grains) |
| `fat` | `#FB7185` (Rose Coral) | Lipids, cooking oil in/out, ghee |
| `fibre` | `#A78BFA` (Amethyst) | Dietary fibre (dal, sabzi, chana husk) |
| `canvas` | `#0B0F17` | Root background (deep obsidian blue-black) |
| `surface-1` | `#121822` | Cards, container panels, bottom tab bar |
| `surface-2` | `#1A2230` | Interactive tiles, form inputs, secondary buttons |
| `hairline` | `#232D3F` | Hairline borders, table dividers |

---

## 3. Typography & Numerical Precision

- **Font Family:** System grotesque (`-apple-system`, `Roboto`, `Inter`).
- **Numbers are First-Class Citizens:**
  - Macro numbers are always rendered bold (`800` or `900` weight).
  - Secondary units (`g`, `kcal`) are rendered in `ink-tertiary` (`#64748B`) to reduce visual noise while maintaining clarity.
  - Rounding rule: **Display numbers round to 1 decimal place** (`roundNutrients(n, 1)`). Raw database storage retains exact floating points.
- **Regional Script Harmony:**
  - Regional translations (தமிழ், हिंदी, తెలుగు) must render at slightly larger line heights (+2px) to prevent vertical clipping of diacritics and ligatures.

---

## 4. Household Measure System (Indian Portions)

Western calorie apps force users to guess in "cups" or "servings". MAXIII uses standardized Indian household measurements, backed by stored gram weights:

1. **Grams (`g`) First:** Exact digital scale weight is the primary gold standard.
2. **Katori:**
   - Standard Katori: `150g` cooked dal/curry.
   - Small Katori: `100g` cooked dish.
   - Big Bowl / Serving Katori: `220g` cooked dish.
3. **Phulka / Roti:**
   - Medium dry puffed Phulka (no ghee): `30g` (atta dough ~25g).
   - Large tawa roti: `45g`.
4. **Ladle (`Karandi`):**
   - Deep curry ladle: `75g - 80g`.
5. **Scoop:**
   - Protein powder scoop: `30g - 33g`.

---

## 5. The Yield Engine UI Contract

The Yield Engine is MAXIII's core competitive advantage. When building or modifying the Yield screen:

- **Flow:**
  $$\text{Raw Weighed Ingredients} + (\text{Oil Added} - \text{Oil Left in Pan}) \xrightarrow{\text{Cooking}} \text{Cooked Pot Weight}$$
- **Key Display Metrics:**
  - **Yield Ratio:** e.g., `3.5x` (when water is absorbed, e.g., dal) or `0.75x` (when water evaporates, e.g., roasted meats).
  - **Energy Density:** Always displayed prominently in `kcal / gram` (e.g., `1.21 kcal/g`).
  - **Atwater Consistency Check:** Display Atwater calculation check ($\pm 5\%$ tolerance). Flag anomalous inputs to the user.
- **Direct Save Affordance:** Every calculated recipe must have an instant `Save to Food Database` button so it can be logged in future meals with zero recalculation.

---

## 6. Do's and Don'ts

### Do
- **Do prioritize Protein visibility:** Protein is the lifter's primary metric. Give it prime placement on dashboard cards with remaining grams (`"25g to target"`).
- **Do display Data Source tags:** Every food item must visually show its source (`USDA`, `Cooked Yield`, `Label`).
- **Do provide one-tap fast actions:** Gym-goers log 4–6 times daily; provide `Quick Entry`, `Search & Log`, and `Copy Yesterday`.
- **Do enforce health safety floors:** Show a clear calorie floor notice ($\ge 1,600 \text{ kcal}$ minimum for males, $\ge 1,200 \text{ kcal}$ for females) and a disclaimer: *"Calculation accuracy when ingredients are weighed. Not medical advice."*
- **Do respect touch target sizes:** All buttons, pills, and touchable rows must hold $\ge 44\text{px}$ minimum tap targets.

### Don't
- **Don't claim fake precision:** Never use marketing claims like *"97% accurate"*. Use *"Calculation accuracy when ingredients are weighed"*.
- **Don't use pure `#000000` black for cards:** Use `#121822` and `#1A2230` to preserve depth and elevation contrast.
- **Don't hide nutrition numbers in deep menus:** Macros (P, C, F, Kcal) must be visible on the card row without requiring extra taps.
- **Don't bundle IFCT data:** ICMR-NIN IFCT 2017 data is copyrighted and must not be distributed until commercial licensing is secured.

---

## 7. Responsive Behavior & Mobile Ergonomics

| Viewport | Width | Layout Adjustments |
|---|---|---|
| Compact Mobile | $\le 380\text{px}$ | Macro grid drops to 2-column compact; bottom tabs use icon + compact label |
| Standard Mobile | $390\text{px} - 430\text{px}$ | Standard 2x2 macro cards, full meal lists, 4-tab bottom navigation |
| Tablet / Foldable | $\ge 600\text{px}$ | Content clamped to `max-width: 720px` centered for single-hand readability |

### Thumb-Zone Ergonomics
- Frequently tapped actions (`+ Log Food`, `Save Recipe`, `Portion Selector`) are positioned in the bottom 60% of the screen.
- Bottom tab navigation holds a `64px` height with `8px` bottom inset for iOS Home Indicator and Android gesture bars.

---

## 8. Agent Implementation Checklist

When adding or altering any component in MAXIII, verify:

1. [ ] Colors use defined tokens from `src/constants/theme.ts`.
2. [ ] Macro ordering follows standard lifter convention: **Protein** first, then **Carbs**, **Fats**, and **Fibre**.
3. [ ] All numerical calculations pass Jest unit tests (`npm test`).
4. [ ] TypeScript strict mode compiles without errors (`npx tsc --noEmit`).
5. [ ] DPDP Act compliance and "Not medical advice" notices remain intact.
