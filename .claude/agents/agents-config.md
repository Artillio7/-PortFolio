# PortFolio - Agents Configuration

> Configuration des agents specialises pour le workflow du PortFolio.

## Prerequisites (Before Launching Any Agent)
- Read this file to identify the correct agent for your task
- Have the target file path or scope ready
- Know whether the task is HTML, CSS, or JS

---

## AGENTS DISPONIBLES

### 1. @portfolio-optimizer
**Role**: Optimise performance, SEO, et accessibilite

| Propriete | Valeur |
|-----------|--------|
| **Skills** | `performance-web`, `seo-optimization`, `security-review` |
| **Commandes** | `/optimize <scope>` |
| **Trigger** | Lighthouse score < 90, meta tags manquants |

**Workflow**:
1. Audit Lighthouse (Performance, SEO, A11y, Best Practices)
2. Identifie les points faibles
3. Propose plan d'optimisation
4. Implemente les corrections
5. Valide avec re-audit

---

### 2. @portfolio-animator
**Role**: Cree et ameliore les animations CSS/JS/Canvas

| Propriete | Valeur |
|-----------|--------|
| **Skills** | `css-animations`, `ux-patterns`, `performance-web` |
| **Commandes** | `/animate <element>`, `/improve-animation <path>` |
| **Trigger** | Fichiers `.css` avec @keyframes, stellar-engine.js, Canvas API |

**Workflow**:
1. Analyse animation existante
2. Propose ameliorations (fluidite, timing, easing)
3. Verifie impact performance (FPS, repaints)
4. Implemente avec fallbacks
5. Teste sur mobile et desktop

---

### 3. @portfolio-ux-designer
**Role**: Ameliore UX/UI, responsive, accessibilite

| Propriete | Valeur |
|-----------|--------|
| **Skills** | `ux-patterns`, `css-animations`, `brainstorming` |
| **Commandes** | `/ux-audit`, `/redesign <section>` |
| **Trigger** | Sections UI, responsive, a11y |

**Workflow**:
1. Audit UX de la section ciblee
2. Verifie accessibilite (ARIA, contrastes, clavier)
3. Propose ameliorations visuelles
4. Implemente en respectant le design system
5. Teste responsive (mobile, tablet, desktop)

---

### 4. @strategy-analyzer
**Role**: Analyse multi-perspective pour problemes complexes (ParaThinker)

| Propriete | Valeur |
|-----------|--------|
| **Skills** | Tous selon la strategie assignee |
| **Commandes** | `/parathinker <problem>` |
| **Trigger** | Problemes complexes, decisions architecturales |

**Strategies disponibles**:
1. HTML Structure & Semantics
2. CSS Architecture & Animations
3. JavaScript Module Design
4. Performance & Web Vitals
5. SEO & Social Sharing
6. Accessibility & ARIA
7. UX & Visual Design
8. Existing Pattern Discovery

---

### 5. @deep-codebase-investigator
**Role**: Investigation forensique du codebase

| Propriete | Valeur |
|-----------|--------|
| **Skills** | `debugging`, `code-review`, tous selon le contexte |
| **Commandes** | Utilise via `/parathinker`, `/debug`, `/rca` |
| **Trigger** | Bugs complexes, analyses architecturales |

**Workflow**:
1. Scope Definition - Clarifier l'objectif
2. Evidence Gathering - Rechercher et lire les fichiers
3. Pattern Analysis - Comparer avec exemples fonctionnels
4. Root Cause Identification - Tracer backward
5. Solution Formulation - Proposer fix au root cause

---

## MATRICE AGENT-COMMANDE

| Commande | Agent | Skills |
|----------|-------|--------|
| `/optimize <scope>` | @portfolio-optimizer | performance-web, seo-optimization |
| `/animate <element>` | @portfolio-animator | css-animations, ux-patterns |
| `/ux-audit` | @portfolio-ux-designer | ux-patterns, css-animations |
| `/redesign <section>` | @portfolio-ux-designer | ux-patterns, brainstorming |
| `/parathinker <problem>` | @strategy-analyzer | Tous selon strategie |
| `/execute <plan>` | @deep-codebase-investigator | executing-plans |
| `/validate [scope]` | @portfolio-optimizer | verification-before-completion |
| `/plan <feature>` | @deep-codebase-investigator | brainstorming, code-review |
| `/scout <question>` | Explore subagent | - |

---

## BINDING AUTOMATIQUE PAR DOMAINE

### HTML
```yaml
patterns: ["index.html"]
agents: [@portfolio-optimizer, @portfolio-ux-designer]
skills: [seo-optimization, ux-patterns]
```

### CSS
```yaml
patterns: ["styles/**/*.css"]
agents: [@portfolio-animator, @portfolio-ux-designer]
skills: [css-animations, ux-patterns, performance-web]
```

### JavaScript
```yaml
patterns: ["modules/**/*.js"]
agents: [@portfolio-animator, @deep-codebase-investigator]
skills: [css-animations, performance-web, debugging]
```

### Full-Stack
```yaml
patterns: ["**/*"]
agents: [Tous les agents disponibles]
skills: [Tous les skills charges]
```
