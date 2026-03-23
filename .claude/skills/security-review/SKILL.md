---
name: security-review
description: "Security review for static portfolio site. Covers CSP, XSS prevention, form security, dependency safety, and client-side best practices."
version: 1.0.0
---

# Security Review - PortFolio

> **Purpose**: Security audit for client-side static site.

## Activation

This skill activates when:
- Reviewing form handling (contact form)
- Adding third-party scripts
- Working with user input
- Checking external resource loading

---

## 1. CONTENT SECURITY POLICY

### Recommended CSP Headers (via Netlify)
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://stackpath.bootstrapcdn.com https://apps.elfsight.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://formspree.io;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 2. FORM SECURITY (Contact Form)

### Formspree Integration
```html
<!-- GOOD - Formspree handles server-side validation -->
<form action="https://formspree.io/f/FORM_ID" method="POST">
  <input type="text" name="name" required maxlength="100">
  <input type="email" name="email" required>
  <textarea name="message" required maxlength="1000"></textarea>
  <!-- Honeypot for spam -->
  <input type="text" name="_gotcha" style="display:none">
  <button type="submit">Envoyer</button>
</form>
```

### Rules
- Always use HTTPS form action
- Add honeypot field for spam prevention
- Client-side validation (HTML5 required, maxlength)
- Don't expose email in HTML (use Formspree)

---

## 3. THIRD-PARTY SCRIPTS

### Current External Scripts
| Script | Source | Risk |
|--------|--------|------|
| jQuery 3.3.1 | CDN | Low (widely audited) |
| Bootstrap 4.3.1 | CDN | Low |
| Font Awesome 5.15.4 | CDN | Low |
| Elfsight Widget | apps.elfsight.com | Medium (third-party tracking) |
| Google Fonts | fonts.googleapis.com | Low (tracking potential) |

### Rules
- Use `integrity` attribute (SRI) on CDN scripts
- Use `crossorigin="anonymous"` on CDN resources
- Minimize third-party scripts
- Audit Elfsight for tracking/privacy

### SRI Example
```html
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
  integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
  crossorigin="anonymous"></script>
```

---

## 4. CLIENT-SIDE XSS PREVENTION

### Rules
- Never use `innerHTML` with user input
- Use `textContent` instead of `innerHTML` where possible
- Sanitize any dynamic content inserted into DOM
- Avoid `eval()` and `new Function()`

```javascript
// BAD
element.innerHTML = userInput;

// GOOD
element.textContent = userInput;
```

---

## 5. SECURITY CHECKLIST

- [ ] HTTPS enforced (Netlify default)
- [ ] No secrets in source code (API keys, tokens)
- [ ] Form uses Formspree (no server-side exposure)
- [ ] Honeypot field for spam prevention
- [ ] SRI on CDN scripts
- [ ] No innerHTML with user input
- [ ] No eval() or new Function()
- [ ] X-Frame-Options set (prevent clickjacking)
- [ ] CSP headers configured
- [ ] Third-party scripts audited
