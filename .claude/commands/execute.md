---
description: Execute implementation plan with skills-powered workflow
argument-hint: [path-to-plan]
---

# Execute - PortFolio Skills-Powered Implementation

**Plan to Execute:** $ARGUMENTS

---

## SESSION FINGERPRINT (CRITICAL - DO FIRST)

**BEFORE ANY TASK OPERATION**, generate your unique session fingerprint:

```
SESSION_FINGERPRINT = "claude-{YYYYMMDD-HHMMSS}"
Example: "claude-20260323-143052"
```

---

## SKILL CHAIN FOR EXECUTION

```
+-------------------------------------------------------------+
|                    EXECUTION WORKFLOW                         |
+-------------------------------------------------------------+
|  1. LOAD PLAN                                                |
|     - Read plan file                                         |
|     - Identify skills chain                                  |
|     - Create task list                                       |
|                                                              |
|  2. FOR EACH TASK:                                           |
|     +- IF HTML task:                                         |
|     |   - Apply `seo-optimization` patterns                  |
|     |   - Apply `ux-patterns` rules                          |
|     |                                                        |
|     +- IF CSS task:                                          |
|     |   - Apply `css-animations` skill                       |
|     |   - Apply `ux-patterns` design rules                   |
|     |                                                        |
|     +- IF JS task:                                           |
|     |   - Apply `performance-web` best practices             |
|     |   - Follow ES6 module patterns                         |
|     |                                                        |
|     +- IF debugging needed:                                  |
|     |   - Apply `debugging/systematic-debugging`             |
|     |   - Root cause -> Fix -> Verify                        |
|     |                                                        |
|     +- ALWAYS:                                               |
|         - Run verification (browser test)                    |
|         - Apply `verification-before-completion`             |
|                                                              |
|  3. BATCH CHECKPOINT (every 3 tasks)                         |
|     - Report progress                                        |
|     - Wait for feedback                                      |
|                                                              |
|  4. COMPLETION                                               |
|     - Full validation suite (/validate all)                  |
|     - Browser test (npx serve . -p 3000)                     |
+-------------------------------------------------------------+
```

---

## PHASE 1: PLAN LOADING

### 1.1 Read Plan
```
Read: $ARGUMENTS
Extract:
  - Goal
  - Architecture
  - Task list
  - Skills chain
```

### 1.2 Critical Review

**BEFORE executing, verify:**
- [ ] Plan has exact file paths
- [ ] Plan has verification steps
- [ ] Skills chain is clear

**If concerns:** STOP and raise with user.

---

## PHASE 2: TASK EXECUTION

### For Each Task:

**Step A: Claim Task**
```
TaskUpdate: taskId, status: "in_progress"
```

**Step B: Implement Following Plan Exactly**

**Step C: Verification (MANDATORY)**
```
BEFORE claiming task complete:
1. IDENTIFY: What proves this works?
2. RUN: Browser test or node --check
3. READ: Verify output
4. VERIFY: Does it confirm success?
```

**Step D: Mark Complete + Commit**
```bash
git add [specific files]
git commit -m "feat/fix: [description]"
```

---

## PHASE 3: BATCH CHECKPOINTS

**Every 3 tasks:**

```
=== BATCH CHECKPOINT ===

Tasks Completed: [N] / [Total]

### Completed:
- Task X: [description] - DONE
- Task Y: [description] - DONE

### Files Changed:
- modified: [path]
- created: [path]

### Verification:
[evidence of tests/checks]

### Next Batch:
- Task A: [description]

Ready for feedback.
```

---

## PHASE 4: COMPLETION

### Final Validation
```bash
# JS syntax check
for f in modules/*.js; do node --check "$f"; done

# Serve and test
npx serve . -p 3000
```

### Final Report
```
=== EXECUTION COMPLETE ===

## Summary
- Total Tasks: [N]
- All Completed: YES/NO
- Skills Applied: [list]

## Files Modified:
[list with paths]

## Verification Evidence:
[paste outputs]

## Ready for:
- [ ] Browser testing
- [ ] Git commit
- [ ] Deployment
```

---

## ERROR HANDLING

### If Something Breaks
```
STOP
Apply systematic-debugging:
1. Read error carefully
2. Trace to root cause
3. Fix at source
4. Re-verify
```

### If Stuck (3+ attempts)
```
STOP
1. Is the plan correct?
2. Ask user for guidance
DO NOT continue without resolution
```
