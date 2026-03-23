---
name: seo-optimization
description: "SEO and social sharing optimization for PortFolio. Covers meta tags, Open Graph, Twitter Cards, structured data, and search engine best practices."
version: 1.0.0
---

# SEO Optimization - PortFolio

> **Purpose**: Maximize search visibility and social sharing quality.

## Activation

This skill activates when:
- Adding or modifying meta tags
- Improving search engine visibility
- Optimizing social sharing previews
- Working on heading structure
- Checking structured data

---

## 1. ESSENTIAL META TAGS

```html
<!-- Basic SEO -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Artillio Yepmo - Ingenieur Informatique | Portfolio</title>
<meta name="description" content="Portfolio d'Artillio Yepmo, ingenieur informatique specialise en Platform Engineering, CI/CD, et developpement Full-Stack.">
<meta name="keywords" content="ingenieur informatique, portfolio, DevOps, CI/CD, full-stack">
<meta name="author" content="Artillio Yepmo">
<meta name="robots" content="index, follow">

<!-- Canonical URL -->
<link rel="canonical" href="https://digitillio.netlify.app/">
```

---

## 2. OPEN GRAPH (Facebook/LinkedIn)

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://digitillio.netlify.app/">
<meta property="og:title" content="Artillio Yepmo - Portfolio">
<meta property="og:description" content="Ingenieur informatique, Platform Engineering & Full-Stack">
<meta property="og:image" content="https://digitillio.netlify.app/ressources/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Artillio Portfolio">
```

### OG Image Requirements
- Size: 1200x630px
- Format: PNG or JPG
- Max: 300KB
- Content: Name, title, professional photo

---

## 3. TWITTER CARDS

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Artillio Yepmo - Portfolio">
<meta name="twitter:description" content="Ingenieur informatique, Platform Engineering & Full-Stack">
<meta name="twitter:image" content="https://digitillio.netlify.app/ressources/og-image.png">
```

---

## 4. HEADING HIERARCHY

```
h1: Artillio (unique, dans hero)
  h2: Portfolio
    h3: Project titles
  h2: Services
    h3: Service names
  h2: A Propos
  h2: Contact
```

### Rules
- ONE h1 per page
- Headings in order (no h3 before h2)
- Headings describe content (not decorative)
- Keywords in h1 and h2 naturally

---

## 5. STRUCTURED DATA (JSON-LD)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Artillio Yepmo",
  "jobTitle": "Ingenieur Informatique",
  "url": "https://digitillio.netlify.app",
  "sameAs": [
    "https://www.linkedin.com/in/artillio-yepmo/"
  ],
  "knowsAbout": ["DevOps", "CI/CD", "Kubernetes", "Angular", "React"]
}
</script>
```

---

## 6. PERFORMANCE-SEO INTERSECTION

| Factor | SEO Impact | Fix |
|--------|-----------|-----|
| Slow LCP | Lower ranking | Optimize images, preload critical |
| CLS > 0.1 | Lower ranking | Set image dimensions, font-display |
| No HTTPS | Ranking penalty | Netlify handles this |
| Not mobile-friendly | Mobile ranking drop | Responsive design |
| Broken links | Crawl errors | Check all href/src attributes |

---

## 7. SEO CHECKLIST

### On-Page
- [ ] Title tag < 60 chars, contains keywords
- [ ] Meta description < 160 chars, compelling
- [ ] Single h1 with main keyword
- [ ] Heading hierarchy correct
- [ ] Alt text on all images
- [ ] Internal anchor links work (#portfolio, #contact)

### Technical
- [ ] Canonical URL set
- [ ] Robots meta = index, follow
- [ ] Viewport meta present
- [ ] Page loads < 3s
- [ ] Mobile responsive
- [ ] HTTPS (Netlify default)

### Social
- [ ] OG title, description, image
- [ ] Twitter card tags
- [ ] OG image 1200x630px
- [ ] Proper locale (fr_FR)
