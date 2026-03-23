---
name: ux-patterns
description: "UX patterns and page layouts for PortFolio. Covers navigation, section structure, user flows, micro-interactions, responsive patterns, and accessibility."
version: 1.0.0
---

# UX Patterns - PortFolio

> **Purpose**: Design-level guidance for building coherent user experiences on the portfolio site.

## Activation

This skill activates when:
- Designing a new section or layout
- Planning navigation or user flows
- Discussing UX improvements, usability
- Working on responsive design
- Improving accessibility

---

## 1. SECTION LAYOUT PATTERNS

### Hero Section (#accueil)
```
+----------------------------------------------+
| [Stellar Engine Canvas Background]            |
|                                               |
|   [Glitch Text: "Artillio"]                  |
|   [Typing Animation: "Ingenieur..."]         |
|                                               |
|   [Cyber-Profile with Orbital Animation]      |
|                                               |
|   [CTA Button]                                |
+----------------------------------------------+
```
- Full viewport height
- Transparent background (stellar engine shows through)
- Text effects: glitch + typing animation
- Profile image with orbital CSS animations

### Portfolio Section (#portfolio)
```
+----------------------------------------------+
| [Gradient Title]                              |
|                                               |
| [Card] [Card] [Card]    <- 3 cols desktop    |
| [Card] [Card] [Card]    <- 2 cols tablet     |
| [Card]                   <- 1 col mobile     |
|                                               |
| Each card: front (image) / back (description) |
+----------------------------------------------+
```
- Card flip animation (3D transform)
- Responsive grid (Bootstrap col-lg-4, col-md-6, col-12)
- Hover to flip on desktop, tap on mobile

### Services Section (#services)
```
+----------------------------------------------+
| [3 service cards in a row]                    |
| [Icon] [Title] [Description] [Link]          |
+----------------------------------------------+
```

### Contact Section (#contact)
```
+----------------------------------------------+
| [Contact Info]  |  [Contact Form]            |
| Location        |  Name, Email, Message      |
| Phone           |  Submit Button             |
| LinkedIn        |                             |
+----------------------------------------------+
```
- Formspree integration
- HTML5 validation + Bootstrap feedback

---

## 2. NAVIGATION PATTERNS

### Desktop
- Fixed navbar with blur backdrop
- Hide on scroll down, show on scroll up
- Active section tracking (Intersection Observer)
- Smooth scroll to sections

### Mobile
- Hamburger menu (3 bars -> X animation)
- Full-screen overlay menu
- Animated menu items (stagger fadeInRight)
- Close on link click or Escape key

### Back-to-Top
- Floating button (bottom-right)
- Show after scrolling past first viewport
- Smooth scroll to top

---

## 3. ANIMATION PATTERNS

### Scroll-Triggered
- Fade-in on viewport entry (Intersection Observer, threshold: 0.1)
- Data attributes: `data-animation="fade-in-up"`
- Stagger delay for multiple elements

### Micro-Interactions
- Button hover: scale + glow
- Card hover: flip or lift shadow
- Link hover: underline slide
- Focus visible: outline + glow

### Performance Rules
- ONLY animate `transform` and `opacity`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`
- Canvas animations: requestAnimationFrame
- Target 60fps (accept 30fps on mobile)

---

## 4. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 576px | Single column, hamburger menu |
| Tablet | 576-991px | 2 columns, hamburger menu |
| Desktop | >= 992px | 3 columns, full navbar |

### Mobile-First Rules
- Touch targets: min 44x44px
- Font size: min 16px (no zoom on iOS)
- No hover-dependent features
- Swipe gestures where appropriate

---

## 5. ACCESSIBILITY PATTERNS

### Keyboard Navigation
- Tab: Navigate focusable elements
- Enter/Space: Activate buttons/links
- Escape: Close menus/modals
- Skip-to-content link (first focusable element)

### ARIA
- `role="navigation"` on nav
- `aria-expanded` on hamburger
- `aria-controls` linking toggle to menu
- `aria-label` on icon-only buttons
- `aria-current="page"` on active nav link

### Color & Contrast
- Text on dark background: min 4.5:1 ratio
- Interactive elements: visible focus ring
- Don't rely on color alone for information

---

## 6. DESIGN SYSTEM

### Colors (CSS Variables)
```css
--bg-darker: #0a0a0a
--primary-color: #4a90e2
--secondary-color: #6fa8dc
--accent-blue: #5b9bd5
--text-light: #ffffff
```

### Typography
- Primary: Poppins (headings)
- Secondary: Space Grotesk (body/code)
- Scale: 16px base, 1.25 ratio

### Spacing
- Section padding: 80px vertical
- Card gap: 30px
- Content max-width: 1200px (container)
