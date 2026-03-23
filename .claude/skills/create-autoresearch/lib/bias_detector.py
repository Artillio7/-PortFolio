#!/usr/bin/env python3
"""
Bias Detector — Classifies evaluation criteria as OBJECTIVE, SEMI-OBJECTIVE, or SUBJECTIVE.

Detects vague/subjective patterns that introduce LLM-as-judge bias and suggests
concrete, measurable alternatives.

Usage:
    from lib.bias_detector import classify_criterion, detect_biases

    result = classify_criterion("Looks professional")
    # => {"classification": "SUBJECTIVE", "warnings": [...], "suggestions": [...]}
"""

import re
from dataclasses import dataclass, field

# ─── Vague/subjective word patterns ─────────────────────────────────────────

# Category 1: Quality weasel words
QUALITY_WEASELS = {
    "good", "better", "best", "great", "excellent", "nice", "clean", "elegant",
    "beautiful", "professional", "polished", "high-quality", "well-designed",
    "attractive", "modern", "sleek", "stunning", "impressive", "compelling",
    "engaging", "appropriate", "suitable", "proper", "reasonable", "decent",
    "fine", "adequate", "satisfactory", "solid", "strong", "weak", "poor",
    "pretty", "ugly", "ugly", "neat", "tidy", "messy", "sloppy",
    # French equivalents
    "bon", "bonne", "meilleur", "excellent", "beau", "belle", "joli", "jolie",
    "propre", "soigné", "élégant", "professionnel", "moderne", "impressionnant",
    "convaincant", "engageant", "approprié", "convenable", "correct",
    "satisfaisant", "solide", "fort", "faible", "mauvais",
}

# Words that look subjective but are OK in technical contexts
EXEMPT_WHEN_NEAR = {
    "correct": {"accent", "accents", "grammar", "grammaire", "orthograph", "spelling",
                "syntax", "syntaxe", "format", "punctuation", "ponctuation"},
}

# Category 2: Unmeasurable comparatives
UNMEASURABLE_COMPARATIVES = [
    r"more\s+readable", r"easier\s+to\s+understand", r"clearer", r"simpler",
    r"more\s+intuitive", r"feels?\s+right", r"looks?\s+right", r"sounds?\s+right",
    r"flows?\s+well", r"reads?\s+well", r"works?\s+well", r"better\s+than",
    r"worse\s+than", r"more\s+natural", r"less\s+confusing",
    # French
    r"plus\s+lisible", r"plus\s+facile", r"plus\s+clair", r"plus\s+simple",
    r"plus\s+intuitif", r"semble\s+bien", r"a\s+l'air\s+bien", r"se\s+lit\s+bien",
    r"coule\s+bien", r"mieux\s+que", r"pire\s+que", r"plus\s+naturel",
]

# Category 3: Audience-dependent judgments
AUDIENCE_DEPENDENT = {
    "user-friendly", "accessible", "innovative", "creative", "original",
    "unique", "interesting", "thought-provoking", "inspiring", "motivating",
    "catchy", "memorable", "impactful", "powerful", "effective",
    # French
    "convivial", "accessible", "innovant", "créatif", "original",
    "unique", "intéressant", "inspirant", "motivant", "accrocheur",
    "mémorable", "percutant", "puissant", "efficace",
}

# ─── Objective signal patterns ───────────────────────────────────────────────

OBJECTIVE_SIGNALS = [
    r"count\s*(is|under|over|between|equals?|<|>|<=|>=)",
    r"(word|char|character|line|token)\s*(count|length|limit)",
    r"(under|over|less\s+than|more\s+than|between|exactly|at\s+most|at\s+least)\s+\d+",
    r"(contains?|includes?|has|starts?\s+with|ends?\s+with)\s+",
    r"(no|zero|aucun|pas\s+de)\s+(error|bug|warning|faute|erreur)",
    r"(valid|invalid|parse|compile|syntax)\s*(json|html|xml|css|python|sql)?",
    r"(pass|fail|true|false|yes|no)\s*$",
    r"(regex|pattern|format)\s*(match|check|valid)",
    r"(file\s*size|execution\s*time|response\s*time|latency|throughput)",
    r"(test|spec|assertion)\s*(pass|fail|run|suite)",
    r"\d+\s*(px|em|rem|pt|%|ms|s|kb|mb|gb)",
    r"(must|should|shall)\s+(not\s+)?(contain|include|have|start|end|match|be)",
    # French
    r"(nombre|compteur|longueur|taille)\s*(de|est|sous|sur|entre)",
    r"(moins\s+de|plus\s+de|entre|exactement|au\s+plus|au\s+moins)\s+\d+",
    r"(contient|inclut|commence\s+par|finit\s+par|termine\s+par)",
    r"(valide|invalide|syntaxe|format)\s*(json|html)?",
]

# ─── Semi-objective signal patterns ──────────────────────────────────────────

SEMI_OBJECTIVE_SIGNALS = [
    r"(grammati|spelling|orthograph|grammaire|faute)",
    r"(accent|diacritic|é|è|ê|à|ô|ç)",
    r"(color|colour|couleur)\s*(pastel|semantic|sémantique|cohérent)",
    r"(layout|mise\s+en\s+page)\s*(linear|linéaire|left.to.right|top.to.bottom)",
    r"(overlap|chevauche|superpos)",
    r"(truncat|tronqu|coupé|cut\s+off)",
    r"(margin|marge|spacing|espacement|padding)",
    r"(readable|lisible)\s*(text|texte)?",
    r"(arrow|flèche)\s*(point|orient|direction)",
    r"(jargon|technical\s+term|terme\s+technique)",
    r"(hierarchy|hiérarchie)\s*(visual|visuel)",
    r"(balanced|équilibr|symmetr|symétri)",
]

# ─── Suggestion table ────────────────────────────────────────────────────────

SUGGESTIONS = {
    "professional": [
        "No overlapping elements / Pas d'éléments qui se chevauchent",
        "Consistent spacing > 8px between elements / Espacement cohérent > 8px",
        "All text fully visible (not truncated) / Tout le texte entièrement visible",
    ],
    "professionnel": [
        "Pas d'éléments qui se chevauchent",
        "Espacement cohérent > 8px entre les éléments",
        "Tout le texte entièrement visible (pas tronqué)",
    ],
    "clean": [
        "No unused/orphan elements / Pas d'éléments orphelins",
        "Consistent indentation / Indentation cohérente",
        "All variables named descriptively / Nommage descriptif des variables",
    ],
    "propre": [
        "Pas d'éléments orphelins ou inutilisés",
        "Indentation cohérente",
        "Nommage descriptif des variables",
    ],
    "engaging": [
        "First line is a question or bold statement / Première ligne = question ou affirmation forte",
        "Contains at least 1 statistic or concrete example / Contient ≥1 statistique",
        "Ends with a call-to-action / Se termine par un appel à l'action",
    ],
    "engageant": [
        "Première ligne = question ou affirmation forte",
        "Contient au moins 1 statistique ou exemple concret",
        "Se termine par un appel à l'action",
    ],
    "well-written": [
        "No grammatical errors / Pas de fautes de grammaire",
        "Flesch-Kincaid readability score 60-70",
        "Under 300 words / Moins de 300 mots",
    ],
    "bien écrit": [
        "Pas de fautes de grammaire",
        "Score de lisibilité Flesch-Kincaid 60-70",
        "Moins de 300 mots",
    ],
    "good design": [
        "WCAG AA contrast ratio on all text / Contraste WCAG AA",
        "Maximum 3 colors used / Maximum 3 couleurs",
        "Grid alignment with 8px base unit / Grille 8px",
    ],
    "bon design": [
        "Contraste WCAG AA sur tout le texte",
        "Maximum 3 couleurs utilisées",
        "Alignement sur grille de 8px",
    ],
    "beautiful": [
        "Consistent color palette (max 4 colors) / Palette cohérente (max 4 couleurs)",
        "Whitespace ratio > 30% / Ratio d'espace blanc > 30%",
        "No visual clutter / Pas de surcharge visuelle",
    ],
    "elegant": [
        "Cyclomatic complexity < 10 per function",
        "No function longer than 30 lines / Aucune fonction > 30 lignes",
        "Single responsibility per function / Responsabilité unique par fonction",
    ],
    "user-friendly": [
        "All interactive elements have visible labels / Labels visibles",
        "Error messages explain how to fix the issue / Messages d'erreur explicatifs",
        "Task completion in < 3 clicks / Completion en < 3 clics",
    ],
    "convivial": [
        "Tous les éléments interactifs ont des labels visibles",
        "Les messages d'erreur expliquent comment corriger",
        "Complétion de tâche en < 3 clics",
    ],
    "innovative": [
        "Uses at least 1 technique not in the baseline / Utilise ≥1 technique hors baseline",
        "Produces output different from template / Output différent du template",
        "Addresses the problem from a non-obvious angle / Angle non-évident",
    ],
    "creative": [
        "Output differs from 3+ reference examples / Diffère de 3+ exemples de référence",
        "Combines concepts from 2+ domains / Combine concepts de 2+ domaines",
        "Avoids the 5 most common patterns for this task / Évite les 5 patterns courants",
    ],
    "interesting": [
        "Contains at least 1 surprising fact or statistic",
        "Presents a counterintuitive perspective",
        "Includes a concrete real-world example",
    ],
    "catchy": [
        "First sentence < 10 words / Première phrase < 10 mots",
        "Opens with a number, question, or contradiction",
        "No generic opener (In today's world..., etc.)",
    ],
    "accrocheur": [
        "Première phrase < 10 mots",
        "Ouvre avec un chiffre, une question ou une contradiction",
        "Pas d'ouverture générique (Dans le monde d'aujourd'hui...)",
    ],
}


@dataclass
class CriterionAnalysis:
    """Result of analyzing a single evaluation criterion."""
    criterion: str
    classification: str = "SEMI_OBJECTIVE"  # "OBJECTIVE", "SEMI_OBJECTIVE", "SUBJECTIVE"
    warnings: list[str] = field(default_factory=list)
    suggestions: list[str] = field(default_factory=list)
    detected_patterns: list[str] = field(default_factory=list)
    recommended_check_type: str = "llm_text"  # "programmatic", "llm_text", "llm_vision", "hybrid"


def _has_pattern(text: str, patterns: list[str]) -> list[str]:
    """Check if text matches any regex patterns, return matched patterns."""
    text_lower = text.lower()
    matches = []
    for pattern in patterns:
        if re.search(pattern, text_lower, re.IGNORECASE):
            matches.append(pattern)
    return matches


def _has_words(text: str, word_set: set) -> list[str]:
    """Check if text contains any words from the set."""
    text_lower = text.lower()
    found = []
    for word in word_set:
        # Match whole words or hyphenated compounds
        if re.search(r'\b' + re.escape(word) + r'\b', text_lower):
            # Check exemptions: word is OK if near certain technical terms
            if word in EXEMPT_WHEN_NEAR:
                near_words = EXEMPT_WHEN_NEAR[word]
                if any(nw in text_lower for nw in near_words):
                    continue  # Exempt — not subjective in this context
            found.append(word)
    return found


def classify_criterion(criterion: str) -> CriterionAnalysis:
    """Classify a single evaluation criterion and detect potential biases."""
    result = CriterionAnalysis(criterion=criterion)
    text = criterion.strip()

    # Check for objective signals first (strongest signal)
    obj_matches = _has_pattern(text, OBJECTIVE_SIGNALS)
    semi_matches = _has_pattern(text, SEMI_OBJECTIVE_SIGNALS)
    subj_weasels = _has_words(text, QUALITY_WEASELS)
    subj_comparatives = _has_pattern(text, UNMEASURABLE_COMPARATIVES)
    subj_audience = _has_words(text, AUDIENCE_DEPENDENT)

    # Scoring: objective signals push toward OBJECTIVE,
    # subjective patterns push toward SUBJECTIVE
    obj_score = len(obj_matches) * 2
    semi_score = len(semi_matches) * 1.5
    subj_score = (len(subj_weasels) + len(subj_comparatives) + len(subj_audience)) * 2

    # Classification logic
    if obj_score > 0 and subj_score == 0:
        result.classification = "OBJECTIVE"
        result.recommended_check_type = "programmatic"
        result.detected_patterns = [f"objective: {p}" for p in obj_matches]

    elif semi_score > 0 and subj_score == 0:
        result.classification = "SEMI_OBJECTIVE"
        result.recommended_check_type = "llm_text"
        result.detected_patterns = [f"semi-objective: {p}" for p in semi_matches]

    elif obj_score > 0 and subj_score > 0:
        # Mixed signals — warn but classify as SEMI_OBJECTIVE
        result.classification = "SEMI_OBJECTIVE"
        result.recommended_check_type = "hybrid"
        result.warnings.append(
            f"Criterion mixes objective and subjective elements. "
            f"Consider splitting into separate criteria."
        )
        result.detected_patterns = (
            [f"objective: {p}" for p in obj_matches] +
            [f"subjective: {w}" for w in subj_weasels]
        )

    elif subj_score > 0:
        result.classification = "SUBJECTIVE"
        result.recommended_check_type = "llm_text"

        # Build warnings
        if subj_weasels:
            result.warnings.append(
                f"Vague quality words detected: {', '.join(subj_weasels)}. "
                f"LLM judges show 10-25% self-enhancement bias on subjective criteria."
            )
        if subj_comparatives:
            result.warnings.append(
                f"Unmeasurable comparative detected. "
                f"LLM judges show ~70% verbosity bias on comparative judgments."
            )
        if subj_audience:
            result.warnings.append(
                f"Audience-dependent judgment: {', '.join(subj_audience)}. "
                f"Different evaluators will disagree >30% of the time."
            )

        # Build suggestions
        for word in subj_weasels + subj_audience:
            if word.lower() in SUGGESTIONS:
                result.suggestions.extend(SUGGESTIONS[word.lower()])

        result.detected_patterns = (
            [f"weasel: {w}" for w in subj_weasels] +
            [f"comparative: {p}" for p in subj_comparatives] +
            [f"audience: {w}" for w in subj_audience]
        )

    elif semi_score > 0:
        result.classification = "SEMI_OBJECTIVE"
        result.recommended_check_type = "llm_text"
        result.detected_patterns = [f"semi-objective: {p}" for p in semi_matches]

    else:
        # No clear signals — default to SEMI_OBJECTIVE with a note
        result.classification = "SEMI_OBJECTIVE"
        result.recommended_check_type = "llm_text"
        result.warnings.append(
            "No strong objective or subjective signals detected. "
            "Defaulting to SEMI_OBJECTIVE. Consider adding concrete pass/fail conditions."
        )

    # Deduplicate suggestions
    result.suggestions = list(dict.fromkeys(result.suggestions))

    return result


def detect_biases(criteria: list[str]) -> dict:
    """Analyze a full list of criteria and return bias report."""
    analyses = [classify_criterion(c) for c in criteria]

    counts = {"OBJECTIVE": 0, "SEMI_OBJECTIVE": 0, "SUBJECTIVE": 0}
    for a in analyses:
        counts[a.classification] += 1

    total = len(criteria)
    warnings = []

    # Global warnings
    if total > 0 and counts["SUBJECTIVE"] / total > 0.5:
        warnings.append(
            f"GOODHART'S LAW WARNING: {counts['SUBJECTIVE']}/{total} criteria are SUBJECTIVE. "
            f"When >50% of criteria are subjective, the system will optimize for evaluator quirks "
            f"rather than real quality. Replace subjective criteria with measurable alternatives."
        )

    if counts["OBJECTIVE"] == 0:
        warnings.append(
            "No OBJECTIVE (programmatic) criteria found. "
            "Adding at least 1-2 code-checkable criteria significantly improves evaluation reliability. "
            "Research shows: 70% deterministic + 30% LLM checks is the ideal ratio."
        )

    if total > 12:
        warnings.append(
            f"High criterion count ({total}). "
            f"Consider splitting into evaluation groups (e.g., 'visual' and 'content') "
            f"to reduce cognitive load on the LLM judge."
        )

    if total < 2:
        warnings.append(
            "Too few criteria. Minimum 2 recommended for meaningful evaluation."
        )

    return {
        "analyses": analyses,
        "counts": counts,
        "total": total,
        "warnings": warnings,
        "subjective_ratio": counts["SUBJECTIVE"] / total if total > 0 else 0,
    }


# ─── Self-test ───────────────────────────────────────────────────────────────

def _run_tests():
    """Run built-in bias detector tests."""
    print("Bias Detector Self-Test")
    print("=" * 50)

    passed = 0
    failed = 0

    def check(description, criterion, expected_class):
        nonlocal passed, failed
        result = classify_criterion(criterion)
        status = "PASS" if result.classification == expected_class else "FAIL"
        if status == "PASS":
            passed += 1
        else:
            failed += 1
            print(f"  [{status}] {description}")
            print(f"         Input: '{criterion}'")
            print(f"         Expected: {expected_class}, Got: {result.classification}")
            print(f"         Patterns: {result.detected_patterns}")
            return
        print(f"  [{status}] {description}")

    # OBJECTIVE criteria
    check("Word count constraint", "Word count is under 300", "OBJECTIVE")
    check("No dashes", "Contains no em-dashes", "OBJECTIVE")
    check("File size", "File size under 1MB", "OBJECTIVE")
    check("Tests pass", "All tests pass", "OBJECTIVE")
    check("Response time", "Response time under 200ms", "OBJECTIVE")
    check("Character limit", "Text must be under 500 characters", "OBJECTIVE")
    check("Ends with CTA", "Must end with a call-to-action", "OBJECTIVE")
    check("Contains keyword", "Contains the word 'conclusion'", "OBJECTIVE")
    check("Valid JSON", "Output is valid JSON", "OBJECTIVE")
    check("Line count", "Less than 50 lines of code", "OBJECTIVE")

    # SEMI-OBJECTIVE criteria
    check("No overlap", "No overlapping elements in the diagram", "SEMI_OBJECTIVE")
    check("Readable text", "All text is readable and not truncated", "SEMI_OBJECTIVE")
    check("French accents", "Accents français corrects sur tous les mots", "SEMI_OBJECTIVE")
    check("Pastel colors", "Uses only pastel colors", "SEMI_OBJECTIVE")
    check("Linear layout", "Layout is linear left-to-right", "SEMI_OBJECTIVE")
    check("No jargon", "No unexplained technical jargon", "SEMI_OBJECTIVE")
    check("Proper margins", "Margins are sufficient around content", "SEMI_OBJECTIVE")
    check("Arrows oriented", "Arrows point to correct targets", "SEMI_OBJECTIVE")
    check("Visual hierarchy", "Clear visual hierarchy in the layout", "SEMI_OBJECTIVE")
    check("Balanced spacing", "Content is spatially balanced", "SEMI_OBJECTIVE")

    # SUBJECTIVE criteria
    check("Looks professional", "Looks professional", "SUBJECTIVE")
    check("Good quality", "Good quality output", "SUBJECTIVE")
    check("Clean code", "Clean and elegant code", "SUBJECTIVE")
    check("Nice design", "Nice design overall", "SUBJECTIVE")
    check("Engaging content", "Content is engaging and compelling", "SUBJECTIVE")
    check("User-friendly", "Interface is user-friendly", "SUBJECTIVE")
    check("Innovative approach", "Uses an innovative approach", "SUBJECTIVE")
    check("Bon résultat (FR)", "Bon résultat global", "SUBJECTIVE")
    check("More readable", "Code is more readable than before", "SUBJECTIVE")
    check("Interesting content", "Content is interesting and creative", "SUBJECTIVE")

    # Global bias detection
    print("\n  --- Global Bias Detection ---")
    subjective_criteria = [
        "Looks professional", "Good quality output", "Clean and elegant code",
        "Nice design overall", "Content is engaging",
    ]
    report = detect_biases(subjective_criteria)
    if report["subjective_ratio"] > 0.5:
        print(f"  [PASS] Goodhart warning triggered (ratio={report['subjective_ratio']:.0%})")
        passed += 1
    else:
        print(f"  [FAIL] Goodhart warning NOT triggered")
        failed += 1

    objective_only = ["Word count under 300", "All tests pass", "File size under 1MB"]
    report2 = detect_biases(objective_only)
    if report2["counts"]["SUBJECTIVE"] == 0:
        print(f"  [PASS] All-objective correctly detected")
        passed += 1
    else:
        print(f"  [FAIL] False subjective in objective-only set")
        failed += 1

    print(f"\n{'=' * 50}")
    print(f"{passed}/{passed + failed} tests passed")
    return failed == 0


if __name__ == "__main__":
    import sys
    success = _run_tests()
    sys.exit(0 if success else 1)
