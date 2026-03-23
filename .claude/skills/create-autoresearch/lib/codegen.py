#!/usr/bin/env python3
"""
Code Generator — Renders .tmpl templates into final Python files.

Uses a simple template engine with {{PLACEHOLDER}} syntax.
No external dependencies (no Jinja2).
"""

import json
import re
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


def _render_placeholder(template: str, data: dict) -> str:
    """Replace {{key}} placeholders with values from data dict."""
    def replacer(match):
        key = match.group(1).strip()
        # Support nested keys: {{generation.backend}}
        parts = key.split(".")
        val = data
        for part in parts:
            if isinstance(val, dict):
                val = val.get(part, f"{{{{MISSING:{key}}}}}")
            else:
                return f"{{{{MISSING:{key}}}}}"
        if isinstance(val, (list, dict)):
            return json.dumps(val, ensure_ascii=False, indent=4)
        return str(val)

    return re.sub(r'\{\{([^}]+)\}\}', replacer, template)


def _render_criteria_keys_list(criteria: list[dict]) -> str:
    """Generate Python list of criterion keys."""
    keys = [c["key"] for c in criteria]
    lines = ['CRITERIA_KEYS = [']
    for k in keys:
        lines.append(f'    "{k}",')
    lines.append(']')
    return "\n".join(lines)


def _render_criteria_labels(criteria: list[dict]) -> str:
    """Generate Python dict mapping keys to labels."""
    lines = ['CRITERIA_LABELS = {']
    for c in criteria:
        lines.append(f'    "{c["key"]}": "{c["label"]}",')
    lines.append('}')
    return "\n".join(lines)


def _render_eval_prompt(criteria: list[dict], output_description: str) -> str:
    """Generate the frozen evaluation prompt."""
    lines = [
        f'EVAL_PROMPT = """Tu évalues {output_description} contre {len(criteria)} critères stricts.',
        '',
        'Critères :',
    ]
    for i, c in enumerate(criteria, 1):
        lines.append(f'{i}. {c["key"].upper()} : {c["description"]}')

    lines.append('')
    lines.append('Note chaque critère PASS (true) ou FAIL (false). Sois strict.')
    lines.append('')
    lines.append('Réponds dans ce format JSON exact :')

    json_template = ", ".join(f'"{c["key"]}": true' for c in criteria)
    lines.append('{' + json_template + ', "failures": []}')
    lines.append('')
    lines.append('Si un critère échoue, mets-le à false et ajoute une description courte dans failures.')
    lines.append('')
    lines.append('CONTENU À ÉVALUER :')
    lines.append('---')
    lines.append('{eval_content}')
    lines.append('---"""')
    return "\n".join(lines)


def _render_mutation_template(criteria: list[dict], max_score: int, prompt_max_words: int, output_description: str) -> str:
    """Generate the mutation template string."""
    lines = [
        f'MUTATION_TEMPLATE = """Tu optimises un prompt pour générer {output_description}.',
        f'Ton objectif : modifier le prompt pour que les outputs passent TOUS les {len(criteria)} critères.',
        '',
        'PROMPT ACTUEL :',
        '---',
        '{current_prompt}',
        '---',
        '',
        'RESULTATS DU DERNIER BATCH ({score}) :',
    ]

    for c in criteria:
        lines.append(f'- {c["label"]}: {{{c["key"]}_status}}')

    lines.extend([
        '',
        'ÉCHECS FRÉQUENTS :',
        '{failures}',
        '',
        'MEILLEUR SCORE : {best_score}',
        '',
        'RÈGLES DE MODIFICATION :',
        '- Pour tout critère sous 100%, ajoute des contraintes TRÈS explicites',
        '- Sois spécifique et impératif',
        f'- Garde le prompt sous {prompt_max_words} mots',
        '- Retourne UNIQUEMENT le nouveau prompt, pas d\'explication"""',
    ])
    return "\n".join(lines)


def _render_topics_list(topics: list[str]) -> str:
    """Generate Python list of topics."""
    lines = ['TOPICS = [']
    for t in topics:
        escaped = t.replace('"', '\\"')
        lines.append(f'    "{escaped}",')
    lines.append(']')
    return "\n".join(lines)


def _render_generation_function(config: dict) -> str:
    """Generate the generate() function based on backend choice."""
    backend = config["generation"]["backend"]

    if backend == "claude_cli":
        return '''
def generate(prompt: str, topic: str, run_dir: Path) -> str | None:
    """Generate output via Claude Code CLI (OAuth)."""
    gen_prompt = f"""Tu es un assistant Claude Code qui a charge le skill suivant.
Lis attentivement les instructions du skill et reponds a la requete utilisateur en les suivant.

=== INSTRUCTIONS DU SKILL ===
{prompt}

=== REQUETE UTILISATEUR ===
{topic}

Reponds directement a l'utilisateur en suivant les instructions du skill ci-dessus.
NE CREE PAS de fichiers. Reponds dans ta reponse uniquement."""

    try:
        print("    CLI: Lancement de claude -p ...")
        process = subprocess.Popen(
            ["claude", "-p", "-", "--output-format", "text"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, encoding="utf-8", errors="replace",
        )
        process.stdin.write(gen_prompt)
        process.stdin.close()

        full_text = ""
        for line in process.stdout:
            full_text += line
        process.wait()
        print(f"    CLI: Done ({len(full_text)} chars, exit={process.returncode})")

        if process.returncode != 0:
            stderr = process.stderr.read()
            print(f"    CLI ERROR: {stderr[:300]}")
            return None

        if not full_text.strip():
            print("    CLI: Empty response")
            return None

        # Take the full response as content
        content = full_text.strip()
        (run_dir / "output.txt").write_text(content, encoding="utf-8")
        return content

    except FileNotFoundError:
        print("    CLI ERROR: 'claude' not found. Install Claude Code.")
        return None
    except Exception as e:
        print(f"    CLI ERROR: {e}")
        traceback.print_exc()
        return None
'''

    elif backend == "external_command":
        cmd = config["generation"].get("command_template", "echo No command configured")
        cmd_repr = repr(cmd)
        return (
            '\nCOMMAND_TEMPLATE = ' + cmd_repr + '\n'
            '\n'
            'def generate(prompt: str, topic: str, run_dir: Path) -> str | None:\n'
            '    """Generate output via external command."""\n'
            '    output_path = run_dir / "output.txt"\n'
            '    cmd = COMMAND_TEMPLATE.format(topic=topic, output_path=str(output_path), prompt=prompt)\n'
            '\n'
            '    try:\n'
            '        print(f"    CMD: {cmd[:80]}...")\n'
            '        result = subprocess.run(\n'
            '            cmd, shell=True, capture_output=True, text=True,\n'
            '            encoding="utf-8", errors="replace", timeout=120,\n'
            '        )\n'
            '        if result.returncode != 0:\n'
            '            print(f"    CMD ERROR: {result.stderr[:300]}")\n'
            '            return None\n'
            '\n'
            '        if output_path.exists():\n'
            '            return output_path.read_text(encoding="utf-8").strip()\n'
            '\n'
            '        if result.stdout.strip():\n'
            '            output_path.write_text(result.stdout.strip(), encoding="utf-8")\n'
            '            return result.stdout.strip()\n'
            '\n'
            '        print("    CMD: No output produced")\n'
            '        return None\n'
            '    except subprocess.TimeoutExpired:\n'
            '        print("    CMD: Timeout after 120s")\n'
            '        return None\n'
            '    except Exception as e:\n'
            '        print(f"    CMD ERROR: {e}")\n'
            '        return None\n'
        )

    elif backend == "file_based":
        return '''
def generate(prompt: str, topic: str, run_dir: Path) -> str | None:
    """File-based: read existing output from run directory."""
    output_path = run_dir / "output.txt"
    if output_path.exists():
        content = output_path.read_text(encoding="utf-8").strip()
        if content:
            return content
    print(f"    FILE: No output.txt found in {run_dir}")
    print(f"    FILE: Place your output in {output_path}")
    return None
'''

    elif backend == "anthropic_api":
        model = config["generation"].get("model", "claude-sonnet-4-6")
        return f'''
def generate(prompt: str, topic: str, run_dir: Path) -> str | None:
    """Generate output via Anthropic API."""
    import anthropic

    gen_prompt = f"""{{prompt}}

=== SUJET ===
{{topic}}

Retourne uniquement le contenu demandé, sans explication."""

    try:
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="{model}",
            max_tokens=4096,
            messages=[{{"role": "user", "content": gen_prompt}}],
        )
        content = response.content[0].text.strip()
        if content:
            (run_dir / "output.txt").write_text(content, encoding="utf-8")
            return content
        return None
    except Exception as e:
        print(f"    API ERROR: {{e}}")
        return None
'''

    return '# ERROR: Unknown backend\ndef generate(prompt, topic, run_dir): return None\n'


def _render_criteria_triggers(criteria: list[dict]) -> str:
    """Generate CRITERIA_TRIGGERS dict mapping keys to trigger keyword lists."""
    lines = ['CRITERIA_TRIGGERS = {']
    for c in criteria:
        triggers = c.get("trigger_keywords") or []
        lines.append(f'    "{c["key"]}": {triggers!r},')
    lines.append('}')
    return "\n".join(lines)


def _render_evaluate_function(config: dict) -> str:
    """Generate the evaluate() function based on criteria check types."""
    criteria = config["criteria"]

    parts = ['''
def is_applicable(key, topic):
    """Check if a criterion applies to the given topic."""
    triggers = CRITERIA_TRIGGERS.get(key, [])
    if not triggers:
        return True
    return any(t in topic.lower() for t in triggers)


def evaluate(content: str, topic: str, run_dir: Path) -> dict | None:
    """Evaluate output against applicable criteria."""
    result = {}
    passed = 0
    applicable = 0
    failures = []
''']

    # Programmatic checks
    prog_criteria = [c for c in criteria if c["check_type"] == "programmatic"]
    if prog_criteria:
        parts.append('    # -- Programmatic checks --')
        for c in prog_criteria:
            check = c.get("programmatic_check", "True")
            parts.append(f'    if not is_applicable("{c["key"]}", topic):')
            parts.append(f'        result["{c["key"]}"] = None')
            parts.append(f'    else:')
            parts.append(f'        applicable += 1')
            parts.append(f'        try:')
            parts.append(f'            val = bool({check})')
            parts.append(f'            result["{c["key"]}"] = val')
            parts.append(f'            if val:')
            parts.append(f'                passed += 1')
            parts.append(f'            else:')
            parts.append(f'                failures.append("{c["key"]}: FAIL")')
            parts.append(f'        except Exception:')
            parts.append(f'            result["{c["key"]}"] = False')
            parts.append(f'            failures.append("{c["key"]}: FAIL (exception)")')
        parts.append('')

    # LLM checks (text or vision)
    llm_criteria = [c for c in criteria if c["check_type"] in ("llm_text", "llm_vision", "hybrid")]
    if llm_criteria:
        parts.append('    # -- LLM evaluation --')
        parts.append('    eval_prompt = EVAL_PROMPT.replace("{eval_content}", content)')
        parts.append('    text = _claude_cli(eval_prompt, timeout=90)')
        parts.append('    if text:')
        parts.append('        llm_result = _extract_json(text)')
        parts.append('        if llm_result:')
        parts.append('            llm_failures = llm_result.pop("failures", [])')
        parts.append('            for k, v in llm_result.items():')
        parts.append('                if k not in CRITERIA_KEYS:')
        parts.append('                    continue')
        parts.append('                if not is_applicable(k, topic):')
        parts.append('                    result[k] = None')
        parts.append('                    continue')
        parts.append('                applicable += 1')
        parts.append('                result[k] = bool(v)')
        parts.append('                if bool(v):')
        parts.append('                    passed += 1')
        parts.append('                else:')
        parts.append('                    failures.append(f"{k}: FAIL")')
        parts.append('            failures.extend(llm_failures)')
        parts.append('')

    parts.append('    score_pct = (passed / applicable * 100) if applicable > 0 else 0')
    parts.append('    return {"criteria": result, "passed": passed, "applicable": applicable, "score_pct": round(score_pct, 1), "failures": failures} if result else None')
    return "\n".join(parts)


def render_autoresearch(config: dict) -> str:
    """Render the complete autoresearch.py from config."""
    template_path = TEMPLATES_DIR / "autoresearch.py.tmpl"
    template = template_path.read_text(encoding="utf-8")

    # Generate all dynamic sections
    criteria = config["criteria"]
    max_score = config["scoring"]["max_score"]

    sections = {
        "CRITERIA_KEYS_LIST": _render_criteria_keys_list(criteria),
        "CRITERIA_LABELS": _render_criteria_labels(criteria),
        "CRITERIA_TRIGGERS": _render_criteria_triggers(criteria),
        "EVAL_PROMPT": _render_eval_prompt(criteria, config.get("output_description", "le contenu")),
        "MUTATION_TEMPLATE": _render_mutation_template(
            criteria, max_score, config.get("prompt_max_words", 600),
            config.get("output_description", "le contenu"),
        ),
        "TOPICS_LIST": _render_topics_list(config["topics"]),
        "GENERATION_FUNCTION": _render_generation_function(config),
        "EVALUATE_FUNCTION": _render_evaluate_function(config),
        "EVAL_MODEL": config.get("eval_model", "claude-sonnet-4-6"),
        "MUTATE_MODEL": config.get("mutate_model", "claude-sonnet-4-6"),
        "GEN_MODEL": config["generation"].get("model", "claude-sonnet-4-6"),
        "BATCH_SIZE": str(config["run_params"]["batch_size"]),
        "CYCLE_SECONDS": str(config["run_params"]["cycle_seconds"]),
        "MAX_SCORE": str(max_score),
        "NAME": config["name"],
        "NAME_SLUG": config.get("name_slug", config["name"]),
        "DESCRIPTION": config["description"],
        "PORT": str(config["run_params"]["dashboard_port"]),
        "SKILL_MD_PATH": config.get("skill_md_path", ""),
    }

    result = template
    for key, value in sections.items():
        result = result.replace(f"{{{{${key}}}}}", value)

    return result


def render_dashboard(config: dict) -> str:
    """Render the complete dashboard.py from config."""
    template_path = TEMPLATES_DIR / "dashboard.py.tmpl"
    template = template_path.read_text(encoding="utf-8")

    criteria = config["criteria"]
    max_score = config["scoring"]["max_score"]
    port = config["run_params"]["dashboard_port"]

    sections = {
        "NAME": config["name"],
        "MAX_SCORE": str(max_score),
        "PORT": str(port),
        "CRITERIA_KEYS_JS": json.dumps([c["key"] for c in criteria], ensure_ascii=True),
        "CRITERIA_LABELS_JS": json.dumps(
            {c["key"]: c["label"] for c in criteria}, ensure_ascii=True
        ),
        "NUM_CRITERIA": str(len(criteria)),
    }

    result = template
    for key, value in sections.items():
        result = result.replace(f"{{{{${key}}}}}", value)

    return result


def render_skill_prompt(config: dict) -> str:
    """Render the initial skill_prompt.txt."""
    template_path = TEMPLATES_DIR / "skill_prompt.txt.tmpl"
    template = template_path.read_text(encoding="utf-8")

    criteria_rules = "\n".join(
        f"- {c['label']} : {c['description']}" for c in config["criteria"]
    )

    sections = {
        "OUTPUT_DESCRIPTION": config.get("output_description", "le contenu demandé"),
        "CRITERIA_RULES": criteria_rules,
        "ADDITIONAL_INSTRUCTIONS": config.get("additional_instructions", ""),
    }

    result = template
    for key, value in sections.items():
        result = result.replace(f"{{{{${key}}}}}", value)

    return result


def render_skill_md(config: dict) -> str:
    """Render the SKILL.md for the generated autoresearch."""
    name = config.get("name_slug", config["name"])
    description = config["description"]
    criteria = config["criteria"]
    max_score = config["scoring"]["max_score"]

    criteria_list = "\n".join(
        f"{i}. **{c['label']}** ({c['classification']}) : {c['description']}"
        for i, c in enumerate(criteria, 1)
    )

    return f"""---
name: autoresearch-{name}
description: Self-improving {description} using the autoresearch pattern. Generates, evaluates against {len(criteria)} criteria, mutates prompt, keeps winners.
---

# Autoresearch: {config['name']}

{description}

## Eval Criteria ({len(criteria)} criteria, max {max_score} points)

{criteria_list}

## Quick Start

```bash
# Single cycle
python autoresearch.py --once

# Run N cycles
python autoresearch.py --cycles 10

# Continuous (infinite)
python autoresearch.py

# Dashboard
python dashboard.py --port {config['run_params']['dashboard_port']}
```

## File Structure

```
data/
  skill_prompt.txt    # Current prompt (mutated each cycle)
  best_prompt.txt     # Best prompt found so far
  state.json          # {{best_score, run_number}}
  results.jsonl       # Append-only log of all runs
  runs/
    run_001/          # Per-run outputs
```

## Models

- Generation: {config['generation']['model']}
- Evaluation: {config.get('eval_model', 'claude-sonnet-4-6')} (FROZEN — never mutated)
- Mutation: {config.get('mutate_model', 'claude-sonnet-4-6')}
"""


def generate_package(config: dict, output_dir: Path):
    """Generate the complete autoresearch package into output_dir."""
    output_dir.mkdir(parents=True, exist_ok=True)
    data_dir = output_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    # autoresearch.py
    (output_dir / "autoresearch.py").write_text(
        render_autoresearch(config), encoding="utf-8"
    )

    # dashboard.py
    (output_dir / "dashboard.py").write_text(
        render_dashboard(config), encoding="utf-8"
    )

    # SKILL.md
    (output_dir / "SKILL.md").write_text(
        render_skill_md(config), encoding="utf-8"
    )

    # skill_prompt.txt
    skill_md_path = config.get("skill_md_path", "")
    if skill_md_path and Path(skill_md_path).exists():
        # Copy the real SKILL.md as the initial prompt
        initial_prompt = Path(skill_md_path).read_text(encoding="utf-8")
    else:
        initial_prompt = render_skill_prompt(config)
    (data_dir / "skill_prompt.txt").write_text(initial_prompt, encoding="utf-8")

    # best_prompt.txt (copy of initial prompt)
    (data_dir / "best_prompt.txt").write_text(initial_prompt, encoding="utf-8")

    # state.json
    (data_dir / "state.json").write_text(
        json.dumps({"best_score": -1.0, "run_number": 0}, indent=2),
        encoding="utf-8",
    )

    # results.jsonl (empty)
    (data_dir / "results.jsonl").write_text("", encoding="utf-8")

    return output_dir
