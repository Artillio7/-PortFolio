#!/usr/bin/env python3
"""
Autoresearch loop for PortFolio performance-web skill.
Iterates over configurations and evaluates assertions to find optimal setup.

Usage:
    python autoresearch.py                    # Run one iteration
    python autoresearch.py --loop             # Run continuously
    python autoresearch.py --evaluate-current # Evaluate current state only
"""

import json
import subprocess
import os
import sys
import re
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
AUTORESEARCH_DIR = Path(__file__).resolve().parent
CONFIG_PATH = AUTORESEARCH_DIR / "config.json"
STATE_PATH = AUTORESEARCH_DIR / "data" / "state.json"
RESULTS_PATH = AUTORESEARCH_DIR / "data" / "results.jsonl"


def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)


def load_state():
    with open(STATE_PATH) as f:
        return json.load(f)


def save_state(state):
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)


def append_result(result):
    with open(RESULTS_PATH, "a") as f:
        f.write(json.dumps(result) + "\n")


def run_check(check_cmd):
    """Run a programmatic assertion check. Returns True/False.
    Uses Python-native file operations instead of bash/grep for Windows compat."""
    try:
        # Parse the check command into a Python operation
        if "grep -c" in check_cmd:
            # Extract pattern and file from: grep -c 'pattern' file
            import re as regex_mod
            m = regex_mod.search(r"grep\s+-[rc]*c?\s+'([^']+)'\s+(\S+)", check_cmd)
            if not m:
                m = regex_mod.search(r'grep\s+-[rc]*c?\s+"([^"]+)"\s+(\S+)', check_cmd)
            if m:
                pattern, filepath = m.group(1), m.group(2)
                target = PROJECT_ROOT / filepath

                count = 0
                if target.is_file():
                    content = target.read_text(encoding="utf-8", errors="ignore")
                    count = content.count(pattern)
                elif target.is_dir():
                    for f in target.rglob("*"):
                        if f.is_file() and f.suffix in (".js", ".html", ".css", ".toml"):
                            content = f.read_text(encoding="utf-8", errors="ignore")
                            count += content.count(pattern)

                # Check operator
                if ">=" in check_cmd:
                    threshold = int(check_cmd.split(">=")[-1].strip())
                    return count >= threshold
                elif "==" in check_cmd:
                    expected = int(check_cmd.split("==")[-1].strip())
                    return count == expected

                return count > 0

        # Handle grep -rc (recursive count)
        if "grep -rc" in check_cmd:
            return run_check(check_cmd.replace("-rc", "-c"))

        # Handle test -f with &&
        if "test -f" in check_cmd:
            parts = check_cmd.split("&&")
            for part in parts:
                part = part.strip()
                if part.startswith("test -f"):
                    filepath = part.replace("test -f", "").strip()
                    if not (PROJECT_ROOT / filepath).is_file():
                        return False
                else:
                    return run_check(part)
            return True

        # Handle for loop (js syntax check)
        if "node --check" in check_cmd:
            modules_dir = PROJECT_ROOT / "modules"
            for f in modules_dir.glob("*.js"):
                result = subprocess.run(
                    ["node", "--check", str(f)],
                    capture_output=True, text=True, timeout=10
                )
                if result.returncode != 0:
                    return False
            return True

        # Default: run as subprocess
        result = subprocess.run(
            check_cmd, shell=True, capture_output=True, text=True,
            timeout=10, cwd=str(PROJECT_ROOT)
        )
        return result.returncode == 0

    except (subprocess.TimeoutExpired, ValueError, Exception) as e:
        print(f"  Check error: {e}")
        return False


def evaluate_assertions(config):
    """Run all assertions and return score."""
    assertions = config["assertions"]
    results = []

    for assertion in assertions:
        if assertion["type"] == "programmatic":
            passed = run_check(assertion["check"])
        elif assertion["type"] == "llm_binary":
            # LLM checks require manual evaluation or claude -p
            passed = None  # Skip for automated runs
        else:
            passed = None

        results.append({
            "id": assertion["id"],
            "description": assertion["description"],
            "passed": passed,
            "type": assertion["type"]
        })

        status = "PASS" if passed else ("SKIP" if passed is None else "FAIL")
        print(f"  [{status}] {assertion['id']}: {assertion['description']}")

    # Score = passed / applicable (excluding None/skipped)
    applicable = [r for r in results if r["passed"] is not None]
    passed_count = sum(1 for r in applicable if r["passed"])
    total = len(applicable)
    score = (passed_count / total * 100) if total > 0 else 0

    return score, results


def run_iteration():
    """Run one evaluation iteration."""
    config = load_config()
    state = load_state()

    run_number = state["run_number"] + 1
    print(f"\n{'='*60}")
    print(f"  AUTORESEARCH RUN #{run_number}")
    print(f"  Skill: {config['skill_name']}")
    print(f"  Time: {datetime.now().isoformat()}")
    print(f"{'='*60}\n")

    print("Evaluating assertions...\n")
    score, results = evaluate_assertions(config)

    print(f"\n{'-'*40}")
    print(f"  Score: {score:.1f}%")
    print(f"  Previous best: {state['best_score']:.1f}%")

    # Update state
    state["run_number"] = run_number
    if score > state["best_score"]:
        state["best_score"] = score
        print(f"  NEW BEST SCORE!")

    state["history"].append({
        "run": run_number,
        "score": score,
        "timestamp": datetime.now().isoformat()
    })

    save_state(state)

    # Append to results log
    append_result({
        "run": run_number,
        "score": score,
        "timestamp": datetime.now().isoformat(),
        "assertions": results
    })

    print(f"{'-'*40}\n")
    return score


def main():
    if "--evaluate-current" in sys.argv:
        score = run_iteration()
        sys.exit(0 if score >= 90 else 1)
    elif "--loop" in sys.argv:
        import time
        config = load_config()
        cycle = config.get("cycle_seconds", 180)
        print(f"Running autoresearch loop (cycle: {cycle}s)")
        while True:
            run_iteration()
            print(f"Sleeping {cycle}s before next iteration...\n")
            time.sleep(cycle)
    else:
        run_iteration()


if __name__ == "__main__":
    main()
