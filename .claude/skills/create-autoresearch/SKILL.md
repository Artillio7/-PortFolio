---
name: create-autoresearch
description: Use when the user wants to create a self-improving evaluation loop (autoresearch pattern) to guarantee a Claude Code skill works at 100% effectiveness. Guides step-by-step with bias detection for evaluation criteria.
---

# Create Autoresearch

Cree une boucle d'amelioration automatique (pattern autoresearch) pour un skill Claude Code.
Le skill genere un output -- on evalue l'output via assertions binaires -- si score < max, on mute le skill.md -- on recommence overnight.

Le mapping :
- `train.py` = le `skill.md` (le fichier qui se fait muter)
- `prepare.py` = les assertions binaires FROZEN (jamais mutees)
- `program.md` = le prompt qui lance la boucle

## Wizard Flow -- 7 etapes via AskUserQuestion

### Step 1: Quel skill QA ?

Ask: "Pour quel skill Claude Code veux-tu creer un autoresearch ? Decris ce qu'il fait et ce qui ne marche pas a 100%."

**Le skill existe-t-il ?**
Si non -- proposer de le creer d'abord, verifier qu'il fonctionne une fois, PUIS creer l'autoresearch.

**Collecter le chemin du SKILL.md** : demander ou detecter le chemin (ex: `.claude/skills/{nom}/SKILL.md`).

Exemples documentes :
- **Skill performance web** -- assertions : Lighthouse score >= 90, WCAG pas degrade, LCP < 2.5s
- **Skill css-animations** -- assertions : FPS > 30, pas de layout thrashing, transitions fluides
- **Skill seo-optimization** -- assertions : meta tags presents, OG valides, heading hierarchy ok

### Step 2: Methode de generation

Comment invoquer le skill pour generer des outputs a tester ?

- **Claude CLI** (RECOMMANDE) -- `claude -p` avec OAuth (~/.claude/). AUCUNE API key.
- **External command** -- Le skill declenche une commande (lighthouse, etc.)
- **File-based** -- Les outputs sont pre-generes.
- **Anthropic API** -- Requiert `ANTHROPIC_API_KEY`. Recommander Claude CLI d'abord.

### Step 3: Assertions binaires (CRITICAL -- Bias Detection)

Ask: "Quelles assertions binaires verifient que le skill fait son job ?"

**Types de checks** :
- **Programmatique** (keyword/regex) : `"keyword" in output`, `len(output.split()) < 300`
- **LLM binaire** : "Le texte ne contient pas de fautes" -- LLM repond true/false
- **Vision** : "Le rendu visuel est correct" -- Claude Vision true/false

**Detection de biais** -- Pour CHAQUE assertion :

| Subjectif | Alternatives binaires |
|---|---|
| professionnel | Pas de chevauchement, Espacement > 8px, Texte visible |
| clean/elegant | Complexite < 10, Fonctions < 30 lignes, Passe linter |
| engageant | Premiere ligne = question/constat, Contient >= 1 stat |
| bien ecrit | Pas de fautes, Sous 300 mots |

Warnings :
- >50% SUBJECTIVE -- "GOODHART'S LAW : optimise les quirks de l'evaluateur, pas la qualite."
- 0 OBJECTIVE -- "70% programmatique + 30% LLM = ratio ideal."

### Step 4: Scoring

**Binary PASS/FAIL** (85-90% fiabilite vs 50-65% pour echelles numeriques).

### Step 5: Scenarios de test

5-30 scenarios varies couvrant : cas normaux + edge cases + pieges.
Warn si < 10 : "Risque d'overfitting."

### Step 6: Parametres

- Cycle : 180s (CLI) / 120s (commande externe)
- Dashboard port : 8501
- Prompt max : 600-800 mots

### Step 7: Revue + Generation

Afficher resume complet. Sur confirmation, generer le package.

**Ce que le package genere doit contenir** :
- `autoresearch.py` -- la boucle. Le `skill_prompt.txt` = copie du skill.md reel.
- `dashboard.py` -- polling 5s, zero dependance.
- `SKILL.md` -- documentation du package.
- `data/skill_prompt.txt` -- copie du skill.md (mutable).
- `data/state.json` -- `{best_score, run_number}`.
- `data/results.jsonl` -- log de tous les runs.

## Principes

1. **skill_prompt.txt = le skill.md** -- C'est le fichier mutable.
2. **Eval FROZEN** -- Les assertions ne changent jamais. Seul le skill.md mute.
3. **Assertions sur l'OUTPUT** -- On teste ce que le skill produit.
4. **Binary > Numeric** -- 85-90% fiabilite.
5. **OAuth first** -- `claude -p` par defaut.
6. **Preserve le frontmatter YAML** -- La mutation ne doit jamais casser le `---\nname:...\n---`.
7. **Sync le vrai skill.md** -- Quand le score s'ameliore, copier vers le fichier reel.
