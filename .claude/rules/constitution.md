# Constitution - PortFolio Project Rules

> Ce fichier complement la constitution globale (~/.claude/CLAUDE.md) avec les regles specifiques au projet PortFolio.

## Stack Technique

- **HTML5** semantique (lang="fr", ARIA, accessibilite)
- **CSS3** avance (variables, animations, keyframes, grid, flexbox, media queries)
- **JavaScript ES6+** modulaire (classes, modules, Intersection Observer, Canvas API)
- **Bootstrap 4.3.1** + custom overrides
- **Deploiement**: Netlify via GitHub Actions CI/CD

## Conventions de Code

### HTML
- Balises semantiques (nav, section, header, footer, main)
- Attributs ARIA sur tous les elements interactifs
- `loading="lazy"` sur toutes les images
- Pas de styles inline

### CSS
- Variables CSS dans `:root` pour le theming
- Nommage: kebab-case pour classes
- Animations: keyframes nommes descriptifs (`fade-in-up`, `glitch`, `orbit-ring`)
- Media queries mobile-first
- Max 500 lignes par section logique

### JavaScript
- Classes ES6 pour chaque module
- Un fichier = une responsabilite
- `window.*` pour API publiques (ex: `window.stellarEngine`)
- Intersection Observer pour animations au scroll
- Pas de dependances npm (CDN uniquement)

## Limites Strictes

- Max 500 lignes par fichier JS (sauf stellar-engine.js)
- Max 50 lignes par methode
- Max 3 niveaux d'imbrication
- Pas de code mort
- Pas de console.log en production

## Workflow

Plan -> Implement -> Verify (PIV Loop)

## Repertoires

```
modules/         → JS modules (ES6 classes)
ressources/      → Images, SVG, logo
styles/          → CSS (style.css principal)
index.html       → Point d'entree unique (SPA-like)
```
