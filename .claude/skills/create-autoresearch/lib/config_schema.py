#!/usr/bin/env python3
"""
Config Schema — Validates and normalizes autoresearch configuration.

The configuration object is built step-by-step by the wizard (SKILL.md)
and validated before template rendering.
"""

import json
import re
from dataclasses import dataclass, field
from pathlib import Path


def slugify(text: str) -> str:
    """Convert text to a snake_case key."""
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '_', text)
    text = text.strip('_')
    return text


def name_slug(text: str) -> str:
    """Convert text to a kebab-case name."""
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


VALID_BACKENDS = {"claude_cli", "external_command", "file_based", "anthropic_api"}
VALID_OUTPUT_FORMATS = {"text", "json", "image"}
VALID_CLASSIFICATIONS = {"OBJECTIVE", "SEMI_OBJECTIVE", "SUBJECTIVE"}
VALID_CHECK_TYPES = {"programmatic", "llm_text", "llm_vision", "hybrid"}
VALID_SCORING_METHODS = {"binary", "weighted_binary"}


def normalize_classification(value: str) -> str:
    """Normalize classification values (handle SEMI-OBJECTIVE vs SEMI_OBJECTIVE etc)."""
    v = value.upper().replace("-", "_").replace(" ", "_")
    if v in VALID_CLASSIFICATIONS:
        return v
    aliases = {
        "SEMI_OBJ": "SEMI_OBJECTIVE",
        "SEMIOBJ": "SEMI_OBJECTIVE",
        "OBJ": "OBJECTIVE",
        "SUBJ": "SUBJECTIVE",
    }
    return aliases.get(v, value)


def normalize_check_type(value: str) -> str:
    """Normalize check_type values."""
    v = value.lower().replace("-", "_").replace(" ", "_")
    if v in VALID_CHECK_TYPES:
        return v
    aliases = {
        "programatic": "programmatic",
        "text": "llm_text",
        "vision": "llm_vision",
        "llm": "llm_text",
    }
    return aliases.get(v, v)


def normalize_backend(value: str) -> str:
    """Normalize backend values."""
    v = value.lower().replace("-", "_").replace(" ", "_")
    if v in VALID_BACKENDS:
        return v
    aliases = {
        "cli": "claude_cli",
        "claude": "claude_cli",
        "external": "external_command",
        "command": "external_command",
        "file": "file_based",
        "api": "anthropic_api",
        "anthropic": "anthropic_api",
    }
    return aliases.get(v, v)


@dataclass
class CriterionConfig:
    key: str
    label: str
    description: str
    classification: str = "SEMI_OBJECTIVE"
    check_type: str = "llm_text"
    programmatic_check: str | None = None
    weight: int = 1
    trigger_keywords: list[str] | None = None  # None = universal (always checked), list = conditional


@dataclass
class GenerationConfig:
    backend: str = "claude_cli"
    model: str = "claude-sonnet-4-6"
    command_template: str | None = None
    output_format: str = "text"


@dataclass
class ScoringConfig:
    method: str = "binary"
    max_score: int = 0  # Computed from criteria


@dataclass
class RunParamsConfig:
    batch_size: int = 1
    cycle_seconds: int = 180
    max_gen_workers: int = 1
    max_eval_workers: int = 1
    dashboard_port: int = 8501


@dataclass
class AutoresearchConfig:
    name: str = ""
    description: str = ""
    generation: GenerationConfig = field(default_factory=GenerationConfig)
    criteria: list[CriterionConfig] = field(default_factory=list)
    scoring: ScoringConfig = field(default_factory=ScoringConfig)
    topics: list[str] = field(default_factory=list)
    run_params: RunParamsConfig = field(default_factory=RunParamsConfig)
    eval_model: str = "claude-sonnet-4-6"
    mutate_model: str = "claude-sonnet-4-6"
    prompt_max_words: int = 600
    output_description: str = ""
    additional_instructions: str = ""
    skill_md_path: str = ""  # Path to the real SKILL.md to sync improvements back

    def compute_max_score(self):
        """Compute max_score from criteria weights."""
        self.scoring.max_score = sum(c.weight for c in self.criteria)

    def to_dict(self) -> dict:
        """Serialize to dict for template rendering."""
        self.compute_max_score()
        return {
            "name": self.name,
            "name_slug": name_slug(self.name),
            "description": self.description,
            "generation": {
                "backend": self.generation.backend,
                "model": self.generation.model,
                "command_template": self.generation.command_template,
                "output_format": self.generation.output_format,
            },
            "criteria": [
                {
                    "key": c.key,
                    "label": c.label,
                    "description": c.description,
                    "classification": c.classification,
                    "check_type": c.check_type,
                    "programmatic_check": c.programmatic_check,
                    "weight": c.weight,
                    "trigger_keywords": c.trigger_keywords,
                }
                for c in self.criteria
            ],
            "scoring": {
                "method": self.scoring.method,
                "max_score": self.scoring.max_score,
            },
            "topics": self.topics,
            "run_params": {
                "batch_size": self.run_params.batch_size,
                "cycle_seconds": self.run_params.cycle_seconds,
                "max_gen_workers": self.run_params.max_gen_workers,
                "max_eval_workers": self.run_params.max_eval_workers,
                "dashboard_port": self.run_params.dashboard_port,
            },
            "eval_model": self.eval_model,
            "mutate_model": self.mutate_model,
            "prompt_max_words": self.prompt_max_words,
            "output_description": self.output_description,
            "additional_instructions": self.additional_instructions,
            "skill_md_path": self.skill_md_path,
        }

    def to_json(self, path: Path):
        """Save config to JSON file."""
        path.write_text(
            json.dumps(self.to_dict(), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    @classmethod
    def from_dict(cls, data: dict) -> "AutoresearchConfig":
        """Load config from dict."""
        config = cls()
        config.name = data.get("name", "")
        config.description = data.get("description", "")
        config.output_description = data.get("output_description", "")
        config.additional_instructions = data.get("additional_instructions", "")
        config.eval_model = data.get("eval_model", "claude-sonnet-4-6")
        config.mutate_model = data.get("mutate_model", "claude-sonnet-4-6")
        config.prompt_max_words = data.get("prompt_max_words", 600)
        config.skill_md_path = data.get("skill_md_path", "")

        gen = data.get("generation", {})
        config.generation = GenerationConfig(
            backend=normalize_backend(gen.get("backend", "claude_cli")),
            model=gen.get("model", "claude-sonnet-4-6"),
            command_template=gen.get("command_template"),
            output_format=gen.get("output_format", "text"),
        )

        for c in data.get("criteria", []):
            config.criteria.append(CriterionConfig(
                key=c.get("key", slugify(c.get("label", ""))),
                label=c.get("label", ""),
                description=c.get("description", ""),
                classification=normalize_classification(c.get("classification", "SEMI_OBJECTIVE")),
                check_type=normalize_check_type(c.get("check_type", "llm_text")),
                programmatic_check=c.get("programmatic_check"),
                weight=c.get("weight", 1),
                trigger_keywords=c.get("trigger_keywords"),
            ))

        scoring = data.get("scoring", {})
        config.scoring = ScoringConfig(
            method=scoring.get("method", "binary"),
            max_score=scoring.get("max_score", 0),
        )

        config.topics = data.get("topics", [])

        rp = data.get("run_params", {})
        config.run_params = RunParamsConfig(
            batch_size=rp.get("batch_size", 1),
            cycle_seconds=rp.get("cycle_seconds", 180),
            max_gen_workers=rp.get("max_gen_workers", 1),
            max_eval_workers=rp.get("max_eval_workers", 1),
            dashboard_port=rp.get("dashboard_port", 8501),
        )

        config.compute_max_score()
        return config

    @classmethod
    def from_json(cls, path: Path) -> "AutoresearchConfig":
        """Load config from JSON file."""
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls.from_dict(data)


def validate_config(config: AutoresearchConfig) -> list[str]:
    """Validate a config and return list of errors (empty = valid)."""
    errors = []

    if not config.name:
        errors.append("name is required")

    if not config.description:
        errors.append("description is required")

    # Generation
    if config.generation.backend not in VALID_BACKENDS:
        errors.append(f"Invalid backend: {config.generation.backend}. Valid: {VALID_BACKENDS}")

    if config.generation.backend == "external_command" and not config.generation.command_template:
        errors.append("command_template is required for external_command backend")

    if config.generation.output_format not in VALID_OUTPUT_FORMATS:
        errors.append(f"Invalid output_format: {config.generation.output_format}")

    # Criteria
    if len(config.criteria) < 2:
        errors.append(f"At least 2 criteria required (got {len(config.criteria)})")

    non_subjective = sum(
        1 for c in config.criteria if c.classification != "SUBJECTIVE"
    )
    if config.criteria and non_subjective == 0:
        errors.append("At least 1 criterion must be OBJECTIVE or SEMI_OBJECTIVE")

    keys_seen = set()
    for c in config.criteria:
        if not c.key:
            errors.append(f"Criterion '{c.label}' has no key")
        if c.key in keys_seen:
            errors.append(f"Duplicate criterion key: {c.key}")
        keys_seen.add(c.key)

        if c.classification not in VALID_CLASSIFICATIONS:
            errors.append(f"Invalid classification for '{c.key}': {c.classification}")
        if c.check_type not in VALID_CHECK_TYPES:
            errors.append(f"Invalid check_type for '{c.key}': {c.check_type}")
        if c.weight < 1:
            errors.append(f"Weight must be >= 1 for '{c.key}'")

    # Topics
    if len(config.topics) < 5:
        errors.append(f"At least 5 topics required (got {len(config.topics)})")

    # Run params
    if config.run_params.batch_size < 1:
        errors.append("batch_size must be >= 1")
    if config.run_params.cycle_seconds < 30:
        errors.append("cycle_seconds must be >= 30")
    if config.run_params.dashboard_port < 1024:
        errors.append("dashboard_port must be >= 1024")

    return errors


def validate_config_warnings(config: AutoresearchConfig) -> list[str]:
    """Return warnings (non-blocking) for a config."""
    warnings = []

    subjective_count = sum(
        1 for c in config.criteria if c.classification == "SUBJECTIVE"
    )
    total = len(config.criteria)

    if total > 0 and subjective_count / total > 0.5:
        warnings.append(
            f"GOODHART'S LAW: {subjective_count}/{total} criteria are SUBJECTIVE. "
            f"The system may optimize for evaluator quirks, not real quality."
        )

    objective_count = sum(
        1 for c in config.criteria if c.classification == "OBJECTIVE"
    )
    if objective_count == 0 and total > 0:
        warnings.append(
            "No OBJECTIVE (programmatic) criteria. Adding code-checkable criteria "
            "improves reliability. Ideal: 70% deterministic + 30% LLM."
        )

    if config.generation.backend == "claude_cli" and config.generation.model == config.eval_model:
        warnings.append(
            "SELF-EVALUATION BIAS: Same model for generation and evaluation. "
            "Research shows 10-25% score inflation. Consider using a different eval model."
        )

    if len(config.topics) < 10:
        warnings.append(
            f"Only {len(config.topics)} topics. 10+ recommended for better generalization."
        )

    if total > 12:
        warnings.append(
            f"High criterion count ({total}). Consider splitting into groups "
            f"to reduce cognitive load on the LLM judge."
        )

    return warnings
