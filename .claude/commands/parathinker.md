---
description: Analyze a problem using 8 parallel strategy agents for comprehensive multi-perspective analysis
argument-hint: [problem-description]
---

# ParaThinker Coordinator - PortFolio

You need to solve a complex coding problem using the ParaThinker approach - spawning multiple independent reasoning paths to avoid tunnel vision.

## Problem to Analyze

$ARGUMENTS

---

## Implementation Protocol

### 1. Spawn 8 Independent Agents

Create 8 `@strategy-analyzer` agents, each with a DIFFERENT strategy:

| Agent | Strategy |
|-------|----------|
| 1 | HTML Structure & Semantics |
| 2 | CSS Architecture & Animations |
| 3 | JavaScript Module Design |
| 4 | Performance & Web Vitals |
| 5 | SEO & Social Sharing |
| 6 | Accessibility & ARIA |
| 7 | UX & Visual Design |
| 8 | Existing Pattern Discovery |

### 2. Provide Context to Each Agent

Give each agent:
- The exact same problem description
- Their assigned strategy (explicitly state which one)
- Instruction to work independently

**Agent Prompt Template:**
```
STRATEGY: [Strategy Name]

Analyze this problem: $ARGUMENTS

Apply ONLY your assigned strategy. Provide:
1. Key findings from your perspective
2. Files that need to be created/modified
3. Patterns to follow (with file:line references)
4. Potential risks/challenges
5. Confidence score (0-100)
6. One-sentence solution summary

Use your assigned strategy exclusively.
```

### 3. Collect Results

Wait for all 8 analyses, then:
- Group solutions by similarity
- Count votes for each solution approach
- Weight by confidence scores

### 4. Majority Decision

- Identify the solution proposed by the most agents
- If tie, use highest average confidence
- Implement the winning solution

### 5. Synthesis Report

```
=== PARATHINKER ANALYSIS COMPLETE ===

PROBLEM: [Original problem]

AGENT RESULTS:
| Agent | Strategy | Solution | Confidence |
|-------|----------|----------|------------|
| 1 | HTML/Semantics | [summary] | X% |
| 2 | CSS/Animations | [summary] | X% |
| ... | ... | ... | ... |

CONSENSUS POINTS (agreed by 4+ agents):
- [Point 1]
- [Point 2]

DIVERGENT VIEWS:
- Agent X suggests [alternative] because [reason]

WINNING SOLUTION:
[Description of majority solution]

FILES TO MODIFY:
- [path] - [change needed]

IMPLEMENTATION PLAN:
1. [Step 1]
2. [Step 2]
...

RISKS TO MONITOR:
- [Risk from agent analysis]
```

### 6. Implementation

Based on the majority solution:
- Make the actual code changes
- Apply relevant PortFolio skills
- Test in browser
- Document which strategy led to success

## Skills Integration

| Situation | Skill |
|-----------|-------|
| Debugging | `debugging` |
| CSS work | `css-animations` |
| UX design | `ux-patterns` |
| Performance | `performance-web` |
| SEO | `seo-optimization` |
| Before done | `debugging/verification-before-completion` |

## When to Use ParaThinker

- **Complex bugs** with unclear root cause
- **Design decisions** with multiple valid approaches
- **Performance issues** requiring multi-angle analysis
- **New features** requiring architectural consideration
- **Refactoring** where multiple solutions exist
