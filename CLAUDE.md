# PortFolio - Artillio Yepmo

## Quick Start

```bash
npx serve . -p 3000
# Open http://localhost:3000
```

## Stack

- **HTML5** semantique (lang="fr", ARIA, accessibilite)
- **CSS3** avance (variables, keyframes, grid, flexbox, responsive)
- **JavaScript ES6+** modulaire (classes, Canvas API, Intersection Observer)
- **Bootstrap 4.3.1** (CDN)
- **jQuery 3.3.1** (CDN, usage minimal)
- **Font Awesome 5.15.4** (CDN)
- **Google Fonts** (Poppins, Space Grotesk)

## Deployment

- **Hosting**: Netlify (digitillio.netlify.app)
- **CI/CD**: GitHub Actions (push to main)
- **Static site**: No build step

## Architecture

```
index.html                    # Point d'entree unique (SPA-like)
styles/style.css              # Stylesheet principal (3600+ lignes, CSS variables)
modules/
├── app.js                    # Init, navigation, formulaire, accessibilite
├── stellar-engine.js         # Moteur particules Canvas (stars, shooting stars, nebulae)
├── advanced-animations.js    # Orchestration animations + stellar engine config
├── animator.js               # Fade-in, scroll animations (Intersection Observer)
├── navigation.js             # Navbar, scroll, active link tracking
├── performance.js            # Lazy loading, LCP monitoring
└── theme.js                  # Dark/light toggle (localStorage)
ressources/                   # Images, SVG, logo (~30MB)
```

## Sections HTML

1. **#accueil** - Hero: glitch text, typing animation, cyber-profile orbital, stellar engine
2. **#portfolio** - 9 project cards avec flip 3D animation
3. **#services** - 3 services (CI/CD, IaC, Observabilite)
4. **#about** - Vision + background (two-column)
5. **#contact** - Form (Formspree) + contact info

## Code Conventions

### CSS
- Variables dans `:root` (--primary-color, --bg-darker, etc.)
- Animations: @keyframes nommes descriptifs
- Mobile-first responsive (col-12 -> col-md-6 -> col-lg-4)

### JavaScript
- Classes ES6 par module
- `window.stellarEngine` = API publique
- IntersectionObserver pour scroll animations
- requestAnimationFrame pour Canvas

## Easter Eggs

- Double-click: declenche une etoile filante
- Constellations geek cachees (</, {}, 01)

## Workflow: PIV Loop

**Plan** -> **Implement** -> **Verify**

## Commands Claude

| Commande | Description |
|----------|-------------|
| `/parathinker <problem>` | Analyse multi-perspective (8 agents paralleles) |
| `/scout <question>` | Recon rapide du codebase (context isolation) |
| `/validate [scope]` | Validation qualite (HTML/CSS/JS/perf/SEO/a11y) |
| `/execute <plan>` | Execute un plan d'implementation |
| `/plan-template <feature>` | Cree un plan d'implementation detaille |

## Agents

| Agent | Role |
|-------|------|
| @deep-codebase-investigator | Investigation forensique |
| @planning-agent | Analyse + plan d'implementation |
| @strategy-analyzer | ParaThinker (8 strategies) |
| @portfolio-optimizer | Performance, SEO, accessibilite |
| @portfolio-animator | Animations CSS/JS/Canvas |
| @portfolio-ux-designer | UX/UI, responsive, a11y |

## Skills

| Skill | Description |
|-------|-------------|
| debugging | Systematic debugging frameworks |
| code-review | Review protocol + verification gates |
| brainstorming | Design-first collaborative ideation |
| css-animations | CSS keyframes + Canvas animation patterns |
| ux-patterns | UX layouts, navigation, responsive, a11y |
| performance-web | Core Web Vitals, image optim, lazy loading |
| seo-optimization | Meta tags, OG, Twitter Cards, structured data |
| security-review | CSP, XSS prevention, form security |
| create-autoresearch | Self-improving skill evaluation loops |
| youtube-search | YouTube search + transcript extraction |
| context7-research | Official docs research via Context7 MCP |
