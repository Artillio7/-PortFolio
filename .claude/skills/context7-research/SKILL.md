---
name: context7-research
description: Research official documentation for frameworks and libraries using Context7 MCP. Use when needing up-to-date docs for CSS, JavaScript, Bootstrap, or any web library.
context: fork
agent: Explore
disable-model-invocation: true
argument-hint: [library] [topic]
---

# Context7 Documentation Research

Research official, up-to-date documentation for: $ARGUMENTS

## Research Protocol

1. **Identify the library/framework** from the input
2. **Use Context7 MCP** to fetch current documentation
3. **Extract relevant patterns** and code examples
4. **Compare with PortFolio codebase** implementation if applicable
5. **Document findings** with official references

## PortFolio Stack Libraries

| Library | Context7 Command | Use Case |
|---------|------------------|----------|
| Bootstrap 4 | `mcp__context7__query-docs /twbs/bootstrap` | UI framework |
| CSS (MDN) | `mcp__context7__query-docs /mdn/content` | CSS properties, animations |
| JavaScript | `mcp__context7__query-docs /mdn/content` | DOM API, Canvas, ES6+ |
| jQuery | `mcp__context7__query-docs /jquery/jquery` | DOM manipulation |
| Font Awesome | `mcp__context7__query-docs /FortAwesome/Font-Awesome` | Icons |

## How to Use

### Step 1: Resolve Library ID
```
Use: mcp__context7__resolve-library-id
Input: { libraryName: "bootstrap", query: "grid system responsive" }
```

### Step 2: Query Documentation
```
Use: mcp__context7__query-docs
Input: { libraryId: "/twbs/bootstrap", query: "grid system responsive" }
```

## Expected Output

Return a structured documentation summary with:
- Official patterns and best practices
- Code examples from official docs
- Comparison with current PortFolio code (if requested)

## Usage Examples

### CSS/HTML Queries
```
/context7-research css grid layout
/context7-research css custom properties
/context7-research css animations keyframes
/context7-research html semantic elements
/context7-research html meta tags seo
```

### JavaScript Queries
```
/context7-research javascript intersection observer
/context7-research javascript canvas api
/context7-research javascript es6 modules
/context7-research javascript requestanimationframe
```

### Bootstrap Queries
```
/context7-research bootstrap grid responsive
/context7-research bootstrap navbar
/context7-research bootstrap cards
```
