#!/usr/bin/env python3
"""
CLI entry point for generating autoresearch packages from a JSON config.

Usage:
    python generate_cli.py config.json [output_dir]

If output_dir is not specified, generates to .claude/skills/autoresearch-{name_slug}/
"""

import json
import sys
from pathlib import Path

# Add lib to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.config_schema import AutoresearchConfig, validate_config, validate_config_warnings
from lib.codegen import generate_package


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_cli.py config.json [output_dir]")
        sys.exit(1)

    config_path = Path(sys.argv[1])
    if not config_path.exists():
        print(f"ERROR: Config file not found: {config_path}")
        sys.exit(1)

    config = AutoresearchConfig.from_json(config_path)
    config.compute_max_score()

    # Validate
    errors = validate_config(config)
    if errors:
        print("ERRORS:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    warnings = validate_config_warnings(config)
    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(f"  - {w}")

    config_dict = config.to_dict()

    # Output dir
    if len(sys.argv) >= 3:
        output_dir = Path(sys.argv[2])
    else:
        output_dir = Path(f".claude/skills/autoresearch-{config_dict['name_slug']}")

    generate_package(config_dict, output_dir)

    # Verify
    for f in ["autoresearch.py", "dashboard.py", "SKILL.md",
              "data/skill_prompt.txt", "data/state.json", "data/results.jsonl"]:
        p = output_dir / f
        status = "OK" if p.exists() else "MISSING"
        print(f"  {status} {f}")

    # Compile check
    code = (output_dir / "autoresearch.py").read_text(encoding="utf-8")
    compile(code, "autoresearch.py", "exec")
    print("  OK autoresearch.py compiles")

    dash = (output_dir / "dashboard.py").read_text(encoding="utf-8")
    compile(dash, "dashboard.py", "exec")
    print("  OK dashboard.py compiles")

    print(f"\nPackage generated at: {output_dir}")
    print(f"Criteria: {len(config_dict['criteria'])}")
    print(f"Topics: {len(config_dict['topics'])}")


if __name__ == "__main__":
    main()
