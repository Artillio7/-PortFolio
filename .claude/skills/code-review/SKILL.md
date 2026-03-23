---
name: code-review
description: Use when completing tasks requiring review before proceeding, or before making any completion claims. Covers receiving feedback with technical rigor, requesting reviews, and verification gates requiring evidence before claims.
---

# Code Review

Guide proper code review practices emphasizing technical rigor, evidence-based claims, and verification over performative responses.

## Core Principle

**Technical correctness over social comfort.** Verify before implementing. Ask before assuming. Evidence before claims.

## Receiving Feedback Protocol

### Response Pattern
READ -> UNDERSTAND -> VERIFY -> EVALUATE -> RESPOND -> IMPLEMENT

### Key Rules
- No performative agreement: "You're absolutely right!", "Great point!"
- No implementation before verification
- Restate requirement, ask questions, push back with technical reasoning
- If unclear: STOP and ask for clarification

## Verification Gates Protocol

### The Iron Law
**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

### Gate Function
IDENTIFY command -> RUN full command -> READ output -> VERIFY confirms claim -> THEN claim

### Requirements
- JS syntax: `node --check` passes for all modules
- Visual: Browser test confirms expected appearance
- Responsive: Mobile/tablet/desktop all look correct
- Performance: No visible jank or slow loading
- A11y: Keyboard navigation works

### Red Flags - STOP
Using "should"/"probably"/"seems to", expressing satisfaction before verification, ANY wording implying success without running verification

## PortFolio Review Checklist

### HTML
- [ ] Semantic elements used correctly
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] Meta tags complete (SEO, OG, Twitter)
- [ ] No inline styles

### CSS
- [ ] Uses CSS variables from :root
- [ ] Responsive at all breakpoints
- [ ] Animations use transform/opacity (GPU)
- [ ] No !important abuse
- [ ] Dark/light theme consistency

### JavaScript
- [ ] ES6 class pattern followed
- [ ] No global variables (except window.stellarEngine)
- [ ] Event listeners properly managed
- [ ] IntersectionObserver cleanup
- [ ] requestAnimationFrame for animations

### Performance
- [ ] Images optimized (lazy loading, srcset)
- [ ] Fonts preloaded with display=swap
- [ ] No render-blocking resources
- [ ] Canvas FPS acceptable (>30fps)

## Bottom Line

1. Technical rigor over social performance
2. Evidence before claims - Verification gates always
3. Verify. Question. Then implement. Evidence. Then claim.
