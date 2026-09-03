# Transparent Responsive Navbar

A transparent, responsive navigation component built with semantic HTML, modern native CSS, and minimal JavaScript.

The component supports:

- Transparent desktop navbar
- Responsive mobile navbar
- Mobile liquid-glass navigation overlay
- Light / dark theme switching
- Desktop language popover
- Mobile language menu
- Responsive layout with shared design tokens
- Accessible touch targets
- Native browser capabilities before JavaScript fallbacks

## File Structure

```text
transparent-responsive-navbar/
├── README.md
├── transparent-responsive-navbar.html
├── transparent-responsive-navbar.css
└── transparent-responsive-navbar.js
```

### File Responsibilities

### `transparent-responsive-navbar.html`

Owns the semantic structure and component hierarchy.

HTML defines:

- Navbar structure
- Logo
- Primary navigation
- Utility controls
- Language controls
- Theme controls
- Mobile navigation overlay
- Mobile menu structure

HTML should not contain layout logic that belongs to CSS or interaction logic that belongs to JavaScript.

### `transparent-responsive-navbar.css`

Owns:

- Design tokens
- Typography
- Layout
- Spacing
- Responsive behavior
- Hover / active / open states
- Theme-aware colors
- Liquid glass appearance
- Accessibility hit areas
- Native CSS positioning
- Animation and visual transitions

### `transparent-responsive-navbar.js`

Owns behavior and state only.

JavaScript is responsible for:

- Theme state
- Language state
- Mobile navigation state
- Mobile language menu state
- Native feature detection
- Browser fallback behavior

JavaScript should not be used to calculate layout values that CSS can already handle.

# CODE CONVENTION

## 1. Architecture First

Parent controls where children go.
Child controls what the child looks like.

## 2. Latest Native CSS

Prefer latest widely available / Baseline Native CSS.
Use modern CSS when it improves layout, state, accessibility, or maintainability.
Avoid unnecessary JavaScript or experimental features.

## 3. Clear Separation of Concerns

Keep tokens, layout, components, states, responsive rules, and behavior clearly separated.

## 4. Well-Organized Structure

Use predictable hierarchy, consistent naming, logical sections, and minimal duplication.

## 5. Reuse-Ready Components

Build components with clear responsibilities, isolated styling, predictable states, and reusable structure.

## 6. Parent-Owned Layout

Parent owns positioning, alignment, spacing, gap, and responsive arrangement.
Avoid child margins for sibling spacing.

## 7. Minimal JavaScript

JavaScript handles behavior and state.
CSS handles layout, appearance, and visual state whenever possible.

## 8. Code Formatting & Readability

Use clean, conventional, consistent formatting.
Keep related code together.
Use meaningful blank lines only between sections.
Avoid excessive line breaks.
Preserve formatting style when updating existing code.
Final code should be professionally formatted, readable, and easy to maintain.

## 9. Touch & Accessibility Sizing

Every interactive control must meet a minimum pointer/touch target of 44x44px (WCAG 2.5.8 AA / platform HIG), even when the visible icon is smaller.

Expand the hit area via an invisible pseudo-element (`::before`, absolute + inset centering) rather than resizing the visible icon or changing the element's layout box. This keeps flex gaps and visual density exactly as designed.

## 10. No Hardcoded Sizing Values

Every size, spacing, or typography value must live in a token (`--variable`) in the tokens section. If a value appears anywhere that isn't a `var()`, that's a signal the token system was skipped — add the token first, then reference it.

## 11. Intentional Responsive Scaling

When a token has both a desktop and mobile variant (for example icon size or padding), the ratio between them should be a deliberate choice, not an accident of editing one without the other.

Document the ratio in a comment next to the token so future edits preserve the intended proportion instead of drifting.

## 12. Concise Line Breaking

A line break must earn its place — it should separate distinct ideas, not fragment a single short statement.

Collapse to one line when elements, function calls, or statements fit comfortably and stay readable.

Good:

```html
<a href="#" class="logo" data-i18n="logo">Logo</a>
```

Good:

```js
dom.languageTrigger?.setAttribute("aria-expanded", "false");
```

Bad:

```html
<a
  href="#"
  class="logo"
>
  Logo
</a>
```

Bad:

```js
option.setAttribute(
  "aria-current",
  String(...)
);
```

Break across lines only when it genuinely helps reading:

- an element/tag has enough attributes (roughly 4+, or long values like `aria-*` + `popover*`) that one line would be hard to scan
- a function call has multiple non-trivial arguments or a multi-line callback body
- a conditional has multiple combined conditions
- breaking prevents a line from running far past the surrounding code's typical width

Never break a single short argument, a short key/value pair, or a trivial ternary onto its own line just for the sake of one thing per line.

When in doubt, prefer the version that takes fewer lines without sacrificing clarity — conciseness is the tiebreaker.

# DESIGN LOGIC

## 1. Transparent Navbar Philosophy

The navbar is intentionally transparent. The navbar itself does not create an opaque visual block around the top of the page.

Desktop navigation primarily relies on spacing, typography, icons, and subtle interaction states rather than a permanent solid background.

## 2. Visual Alignment vs Layout Alignment

The component aligns layout boxes rather than attempting to mathematically align the visible ink of text and icons.

Text has font-dependent glyph metrics, SVGs have their own `viewBox`, and icons can contain internal whitespace. Therefore:

```text
Parent
  -> aligns element boxes

Control
  -> defines icon box

SVG
  -> defines artwork geometry
```

The default strategy is to align layout boxes first and avoid arbitrary negative margins or right-padding compensation. Optical adjustment should only be introduced when the SVG artwork geometry actually requires it.

## 3. Mobile Overlay Architecture

The mobile menu is a separate overlay architecture rather than a reuse of the desktop navigation layout:

```text
Mobile Overlay
├── Top
│   └── Close
├── Middle
│   └── Navigation Links
└── Bottom
    ├── Language
    └── Theme
```

This gives mobile its own information hierarchy while the parent overlay controls positioning and spacing.

# NATIVE CSS LOGIC

## 1. CSS Custom Properties

The component is token-driven through CSS custom properties. Design decisions are centralized in `:root` and consumed with `var()`.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

## 2. `color-scheme`

The document declares support for light and dark color schemes so browser-native UI can adapt to the active scheme.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme

## 3. `light-dark()`

Theme-aware tokens use `light-dark(light-value, dark-value)` so many light/dark values can stay in a single declaration.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark

## 4. `color-mix()`

Hover and active colors are derived from the current text color rather than duplicated theme-specific RGB values.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix

## 5. `@scope`

Navbar styles are scoped to the component subtree to reduce selector leakage into unrelated application markup.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40scope

## 6. Native Popover API

The desktop language selector uses the native Popover API. The browser handles top-layer behavior while CSS controls the appearance through states such as `:popover-open`.

Reference: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

## 7. CSS Anchor Positioning

The desktop language dropdown is positioned relative to its trigger through CSS anchor positioning instead of JavaScript-calculated coordinates.

The trigger establishes an anchor and the dropdown references that anchor for placement.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Using

## 8. Mobile Liquid Glass

The mobile navigation surface combines a translucent background with `backdrop-filter` so the underlying page remains visible through a blurred glass surface.

Conceptually:

```text
Page content
     ↓
translucent overlay
     ↓
backdrop-filter
     ↓
blurred content visible through surface
```

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter

## 9. Popover `::backdrop`

The mobile overlay keeps its backdrop visually separate from the glass panel. The panel itself provides the translucent surface while the full-screen `::backdrop` remains transparent.

Reference: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using

## 10. Mobile Language Menu

The mobile language menu is a regular menu inside the mobile overlay rather than a nested Popover. JavaScript toggles its open state while CSS owns its presentation.

This keeps mobile interaction simple and avoids unnecessary nested top-layer behavior.

# THEME LOGIC

Theme state is controlled by JavaScript while theme presentation remains CSS-driven.

JavaScript updates the root state:

```js
document.documentElement.dataset.theme = "dark";
```

CSS consumes the active theme through theme-aware tokens such as `light-dark()`.

# LANGUAGE LOGIC

Language state updates the component's translatable labels, including logo text and navigation labels.

The active language option is represented semantically using `aria-current="true"`.

# ACCESSIBILITY LOGIC

The component uses semantic buttons for actions, accessible labels for icon-only controls, `aria-expanded`, `aria-current`, keyboard-compatible native popover behavior, visible focus states, and minimum touch targets.

The visible icon size is intentionally independent from the interactive hit area.

# BROWSER-NATIVE FIRST PRINCIPLE

```text
Can HTML do it?
    ↓ yes
Use HTML

Can native CSS do it?
    ↓ yes
Use CSS

Can a browser-native API do it?
    ↓ yes
Use the native API

Only then:
Use JavaScript
```

JavaScript exists to bridge behavior and application state, not to recreate browser capabilities that already exist natively.

# DESIGN PRINCIPLES

```text
Parent controls layout.
Child controls appearance.

CSS controls presentation.
JavaScript controls behavior.

Native browser capability first.
Fallback only when necessary.

Design tokens before hardcoded values.

Visible size and interaction size are separate concerns.

Responsive changes are intentional, not accidental.

Visual alignment starts from layout-box alignment,
then considers optical geometry only when necessary.
```

# References

- MDN — CSS Custom Properties
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
- MDN — `color-scheme`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
- MDN — `light-dark()`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
- MDN — `color-mix()`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix
- MDN — `@scope`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40scope
- MDN — Popover API
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- MDN — Using the Popover API
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- MDN — CSS Anchor Positioning
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Using
- MDN — `backdrop-filter`
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter
