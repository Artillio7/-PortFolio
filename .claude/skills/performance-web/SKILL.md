---
name: performance-web
description: "Web performance optimization for PortFolio. Covers Core Web Vitals, image optimization, render blocking, lazy loading, and Canvas performance."
version: 1.0.0
---

# Web Performance - PortFolio

> **Purpose**: Patterns for optimizing load time, rendering, and runtime performance.

## Activation

This skill activates when:
- Optimizing page load speed
- Fixing performance issues (jank, slow load)
- Adding images or heavy resources
- Working on Canvas animations (stellar engine)
- Preparing for Lighthouse audit

---

## 1. CORE WEB VITALS TARGETS

| Metric | Target | Measures |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading performance |
| FID (First Input Delay) | < 100ms | Interactivity |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

---

## 2. IMAGE OPTIMIZATION

### Rules
- Max 500KB per image (prefer < 200KB)
- Use `loading="lazy"` for below-fold images
- Provide `width` and `height` attributes (prevent CLS)
- Use `srcset` for responsive images
- Prefer WebP/AVIF with PNG fallback

### Current Assets
```
ressources/
├── logo.png (1.5MB - NEEDS OPTIMIZATION)
├── Profile images (~200KB each)
├── Portfolio screenshots (~100-300KB each)
└── Tech icons (~50KB each)
```

### Optimization Commands
```bash
# Find large images
find ressources/ -type f \( -name "*.png" -o -name "*.jpg" \) -size +500k

# Convert to WebP (if tools available)
# cwebp -q 80 input.png -o output.webp
```

---

## 3. RESOURCE LOADING

### Critical Rendering Path
```html
<!-- 1. Preconnect to external origins (FIRST) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">

<!-- 2. Preload critical CSS -->
<link rel="preload" href="styles/style.css" as="style">

<!-- 3. CSS (render-blocking, but necessary) -->
<link rel="stylesheet" href="styles/style.css">

<!-- 4. Font loading with display=swap -->
<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap">

<!-- 5. JS at end of body or with defer -->
<script type="module" src="modules/advanced-animations.js"></script>
```

### Rules
- CSS in `<head>`, JS at end of `<body>`
- `defer` or `type="module"` for non-critical JS
- `async` for analytics/widgets only
- Preconnect to CDN origins
- Version query params for cache busting (`?v=8`)

---

## 4. CANVAS PERFORMANCE (Stellar Engine)

### FPS Targets
- Desktop: 60fps
- Mobile: 30fps acceptable
- Below 30fps: Reduce particle count

### Optimization Techniques
```javascript
// 1. Off-screen detection
if (particle.x < -10 || particle.x > width + 10) continue;

// 2. Batch similar draw calls
ctx.beginPath();
particles.forEach(p => {
  ctx.moveTo(p.x + p.radius, p.y);
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
});
ctx.fill(); // Single fill call

// 3. Reduce particles on mobile
const isMobile = window.innerWidth < 768;
const starCount = isMobile ? 150 : 350;

// 4. Hero zone dimming (reduce computation)
heroZoneDimming: 0.4 // Reduce intensity in hero area
```

### Memory Management
- Object pooling for particles
- Cancel rAF on page visibility change
- Clean up on destroy

---

## 5. CSS PERFORMANCE

### Avoid
```css
/* BAD - Expensive selectors */
.container > div > ul > li > a { }
* { box-shadow: ...; }

/* BAD - Triggers layout on animate */
.animated { width: 100px; transition: width 0.3s; }
```

### Prefer
```css
/* GOOD - Efficient selectors */
.nav-link { }

/* GOOD - GPU-accelerated */
.animated { transform: scaleX(1); transition: transform 0.3s; }
```

---

## 6. LAZY LOADING PATTERN

```javascript
// Intersection Observer for lazy images
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px' }); // Start loading 200px before visible
```

---

## 7. PERFORMANCE CHECKLIST

- [ ] No image > 500KB
- [ ] All below-fold images have `loading="lazy"`
- [ ] Preconnect to Google Fonts and CDN
- [ ] CSS loaded before JS
- [ ] Fonts use `display=swap`
- [ ] Canvas reduces particles on mobile
- [ ] No layout-triggering animations
- [ ] No unused CSS (dead selectors)
- [ ] Version params on CSS/JS for cache busting
