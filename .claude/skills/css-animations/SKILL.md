---
name: css-animations
description: "CSS and Canvas animation patterns for PortFolio. Covers keyframes, transitions, Canvas API, performance optimization, and responsive animation design."
version: 1.0.0
---

# CSS & Canvas Animations - PortFolio

> **Purpose**: Patterns and rules for creating performant, accessible animations.

## Activation

This skill activates when:
- Creating or modifying CSS animations/transitions
- Working with stellar-engine.js (Canvas)
- Adding micro-interactions
- Optimizing animation performance

---

## 1. CSS KEYFRAME PATTERNS

### Fade Animations
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Glitch Effect
```css
@keyframes glitch {
  0%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 2px); }
  40% { clip-path: inset(40% 0 20% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 1px); }
  80% { clip-path: inset(10% 0 80% 0); transform: translate(1px, -1px); }
}
```

### Orbital Animation
```css
@keyframes orbit-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 2. PERFORMANCE RULES (CRITICAL)

### GPU-Accelerated Properties ONLY
```css
/* GOOD - Composited, no reflow/repaint */
transform: translateX() translateY() scale() rotate();
opacity: 0..1;

/* BAD - Triggers layout/paint */
width, height, top, left, right, bottom;
margin, padding, border-width;
font-size, line-height;
```

### will-change Usage
```css
/* GOOD - Applied before animation starts */
.about-to-animate {
  will-change: transform, opacity;
}

/* BAD - Applied to everything */
* { will-change: transform; } /* Memory waste */
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. CANVAS ANIMATION PATTERNS (Stellar Engine)

### Animation Loop
```javascript
animate() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.updateParticles();
  this.drawParticles();
  this.animationId = requestAnimationFrame(() => this.animate());
}
```

### Particle Management
- Max particles: 350 (configurable)
- Object pooling for shooting stars
- Off-screen culling (don't draw invisible particles)
- Batch draw calls where possible

### Mouse Interaction
```javascript
handleMouseMove(e) {
  const rect = this.canvas.getBoundingClientRect();
  this.mouseX = e.clientX - rect.left;
  this.mouseY = e.clientY - rect.top;
}
```

### Memory Management
- Cancel animationFrame on destroy
- Remove event listeners on cleanup
- Clear particle arrays
- Resize canvas on window resize

---

## 4. TRANSITION PATTERNS

### Standard Transition
```css
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### Card Flip (3D)
```css
.card {
  perspective: 1000px;
}
.card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.card:hover .card-inner {
  transform: rotateY(180deg);
}
```

### Stagger Animation
```css
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
```

---

## 5. EXISTING ANIMATIONS INVENTORY

| Animation | File | Type |
|-----------|------|------|
| Stellar background | stellar-engine.js | Canvas |
| Shooting stars | stellar-engine.js | Canvas |
| Geek constellations | stellar-engine.js | Canvas (Easter egg) |
| Glitch text | style.css | CSS keyframes |
| Typing effect | style.css | CSS keyframes |
| Orbit ring | style.css | CSS keyframes |
| Card flip | style.css | CSS transition |
| Fade-in scroll | animator.js | JS + CSS |
| Gradient shift | style.css | CSS keyframes |
| Scan line | style.css | CSS keyframes |

---

## 6. RULES

### DO:
- Use `transform` and `opacity` for animations
- Use `requestAnimationFrame` for JS animations
- Implement `prefers-reduced-motion` fallback
- Test on mobile (lower GPU power)
- Keep canvas particle count reasonable
- Use CSS transitions for simple state changes

### DO NOT:
- Animate layout properties (width, height, top, left)
- Use `setInterval` for animations (use rAF)
- Create infinite CSS animations without purpose
- Forget to clean up event listeners and rAF
- Apply `will-change` globally
- Ignore mobile performance
