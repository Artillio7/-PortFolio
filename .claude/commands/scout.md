---
description: Quick codebase reconnaissance without polluting main context. Returns a focused summary.
argument-hint: <question-about-the-codebase>
---

# Scout -- Lightweight Codebase Reconnaissance

**Question:** $ARGUMENTS

---

## Protocol

You MUST use the Agent tool with `subagent_type: "Explore"` to answer this question. Do NOT search the codebase yourself -- the entire point of `/scout` is context isolation.

### Step 1: Launch Scout Agent

Launch ONE Explore agent with this prompt:

```
Investigate the following question about the PortFolio codebase:

"$ARGUMENTS"

Project: Vanilla HTML/CSS/JS portfolio site. Single page (index.html), modular JS (modules/), CSS (styles/style.css), assets (ressources/).

Rules:
1. Search thoroughly -- check multiple naming conventions, file patterns, and locations.
2. Read relevant files completely (don't stop at the first match).
3. Your answer must include exact file paths with line numbers (file:line format).
4. If the answer involves code patterns, show the ACTUAL code (not paraphrased).
5. If you find nothing, say so clearly -- do NOT guess or hallucinate.
6. Keep your response under 500 tokens. Lead with the answer, then evidence.
```

### Step 2: Report Back

When the agent returns, relay its findings to the user in this format:

```
## Scout Report: [one-line summary]

[Agent's findings -- file paths, code snippets, answer]

**Files touched:** [list of files the scout read]
**Confidence:** [high/medium/low based on evidence quality]
```

### Rules

- **ONE agent only** -- this is a quick recon, not a deep investigation. If the question needs more depth, suggest `/parathinker` or `@deep-codebase-investigator` instead.
- **Do NOT read files yourself** after the scout returns -- trust the agent's output.
- **Do NOT add the scout's findings to memory** -- this is ephemeral context.
- **If the question is vague**, ask the user to be more specific BEFORE launching the agent.
