---
name: debugging
description: Systematic debugging frameworks for finding and fixing bugs - includes root cause analysis, defense-in-depth validation, and verification protocols
when_to_use: when encountering bugs, test failures, unexpected behavior, or needing to validate fixes before claiming completion
version: 1.0.0
languages: html, css, javascript
---

# Debugging Skills

A collection of systematic debugging methodologies that ensure thorough investigation before attempting fixes.

## Available Sub-Skills

### Systematic Debugging
Four-phase debugging framework: Root Cause Investigation -> Pattern Analysis -> Hypothesis Testing -> Implementation. The iron law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

### Root Cause Tracing
Trace bugs backward through the call stack to find the original trigger. Don't fix symptoms - find where invalid data originated and fix at the source.

### Defense-in-Depth Validation
Validate at every layer data passes through to make bugs structurally impossible. Four layers: Entry Point -> Business Logic -> Environment Guards -> Debug Instrumentation.

### Verification Before Completion
Run verification commands and confirm output before claiming success. The iron law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

## When to Use

- **Bug in production** -> Start with systematic-debugging
- **Error deep in stack trace** -> Use root-cause-tracing
- **Fixing a bug** -> Apply defense-in-depth after finding root cause
- **About to claim "done"** -> Use verification-before-completion

## Quick Dispatch

| Symptom | Approach |
|---------|----------|
| Visual glitch, unexpected layout | Check CSS specificity, z-index, stacking context |
| Animation not working | Check keyframe names, animation properties, JS triggers |
| JS error in console | Trace through module imports, check event listeners |
| Responsive broken | Check media queries, flexbox/grid rules, viewport |
| Performance issue | Check FPS, repaints, image sizes, blocking resources |

## PortFolio-Specific Debugging

### CSS Issues
```
1. Open DevTools -> Elements -> Computed Styles
2. Check specificity (Bootstrap overrides vs custom)
3. Check CSS variable values in :root
4. Check media query breakpoints
5. Check animation keyframe names match
```

### JavaScript Issues
```bash
# Check syntax of all modules
for f in modules/*.js; do node --check "$f" && echo "OK: $f" || echo "FAIL: $f"; done
```

### Canvas Issues (Stellar Engine)
```
1. Check requestAnimationFrame loop
2. Verify canvas dimensions match window
3. Check mouse event coordinates
4. Monitor FPS with performance.now()
5. Check for memory leaks (particle arrays growing)
```

### Common Patterns
| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Animation jank | Layout thrashing (width/height) | Use transform/opacity only |
| Z-index not working | Missing position: relative | Add position property |
| Hover not working on mobile | No touch events | Add touchstart listener |
| Font not loading | CORS or display:swap missing | Check preconnect, add swap |
| Image not showing | Wrong path (case sensitive) | Check exact filename case |

## Core Philosophy

> "Systematic debugging is FASTER than guess-and-check thrashing."

From real debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
