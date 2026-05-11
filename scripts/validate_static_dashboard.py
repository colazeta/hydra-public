#!/usr/bin/env python3
"""Validate the canonical Hydra Public static dashboard.

This script performs repository-side checks that can be run before browser QA.
It catches common regressions in the static dashboard and network map.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "index.html",
    "app.js",
    "styles.css",
    "network-enhancements.js",
    "network-focus-bridge.js",
    "data/exports/public/public_timeline.json",
    "data/exports/public/public_hearings.json",
    "data/exports/public/public_issues.json",
    "data/exports/public/public_sources.json",
    "data/exports/public/public_network.json",
    "data/exports/public/public_evidence.json",
]

REQUIRED_INDEX_SNIPPETS = [
    "styles.css",
    "app.js",
    "network-enhancements.js",
    "network-focus-bridge.js",
    "vis-network/standalone/umd/vis-network.min.js",
    "id=\"timeline\"",
    "id=\"themes-panel\"",
    "id=\"issues\"",
    "id=\"network\"",
    "id=\"network-graph\"",
    "id=\"network-detail-panel\"",
    "id=\"evidence\"",
]

FORBIDDEN_INDEX_SNIPPETS = [
    "process-canvas.js",
    "id=\"process-canvas\"",
    "id=\"process-canvas-map\"",
    "id=\"canvas-focus-panel\"",
    "data-canvas-layer=",
]

REQUIRED_APP_SNIPPETS = [
    "public_network.json",
    "renderInteractiveNetwork",
    "renderNetwork",
    "container.innerHTML=''",
    "const brokenEdges=rawEdges.length-edges.length",
    "HYDRA_NETWORK_INSTANCE.destroy",
    "HYDRA_NETWORK_BRIDGE?.filter",
]

REQUIRED_ENHANCEMENT_SNIPPETS = [
    "network-expanded",
    "network-expand-toggle",
    "network-center-view",
    "network-stabilize-view",
    "network-collapse-focus",
]

REQUIRED_BRIDGE_SNIPPETS = [
    "HYDRA_NETWORK_INSTANCE",
    "focusNode",
    "focusEdge",
    "HYDRA_NETWORK_BRIDGE",
    "public_network.json",
]

REQUIRED_CSS_SNIPPETS = [
    "body.network-expanded",
    "#network-graph",
    ".network-shell",
    ".network-detail-panel",
    ".network-toolbar",
]

FORBIDDEN_CSS_SNIPPETS = [
    ".process-canvas-map",
    ".canvas-transform",
    ".canvas-controls",
    ".canvas-node",
    ".canvas-focus-panel",
]


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def read_text(path: str, errors: list[str]) -> str:
    file_path = ROOT / path
    if not file_path.exists():
        fail(f"Missing required file: {path}", errors)
        return ""
    return file_path.read_text(encoding="utf-8")


def load_json(path: str, errors: list[str]):
    file_path = ROOT / path
    if not file_path.exists():
        fail(f"Missing JSON file: {path}", errors)
        return None
    try:
        return json.loads(file_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"Invalid JSON in {path}: {exc}", errors)
        return None


def check_snippets(label: str, content: str, snippets: list[str], errors: list[str]) -> None:
    for snippet in snippets:
        if snippet not in content:
            fail(f"{label} missing required snippet: {snippet}", errors)


def check_absent(label: str, content: str, snippets: list[str], errors: list[str]) -> None:
    for snippet in snippets:
        if snippet in content:
            fail(f"{label} contains obsolete snippet: {snippet}", errors)


def validate_network(errors: list[str]) -> None:
    network = load_json("data/exports/public/public_network.json", errors)
    if not isinstance(network, dict):
        fail("public_network.json must be an object", errors)
        return

    nodes = network.get("nodes")
    edges = network.get("edges")
    caveat = network.get("caveat")

    if not isinstance(nodes, list):
        fail("public_network.json: nodes must be a list", errors)
        nodes = []
    if not isinstance(edges, list):
        fail("public_network.json: edges must be a list", errors)
        edges = []
    if not caveat:
        fail("public_network.json: caveat is required", errors)

    node_ids = set()
    for node in nodes:
        node_id = node.get("id")
        if not node_id:
            fail("Network node missing id", errors)
            continue
        if node_id in node_ids:
            fail(f"Duplicate network node id: {node_id}", errors)
        node_ids.add(node_id)
        for key in ["type", "public_label", "quality_status"]:
            if not node.get(key):
                fail(f"Network node {node_id} missing {key}", errors)

    edge_ids = set()
    broken_edges = 0
    for edge in edges:
        edge_id = edge.get("id")
        if not edge_id:
            fail("Network edge missing id", errors)
            continue
        if edge_id in edge_ids:
            fail(f"Duplicate network edge id: {edge_id}", errors)
        edge_ids.add(edge_id)
        source = edge.get("source")
        target = edge.get("target")
        if source not in node_ids or target not in node_ids:
            broken_edges += 1
        for key in ["public_label", "quality_status"]:
            if not edge.get(key):
                fail(f"Network edge {edge_id} missing {key}", errors)

    if broken_edges:
        print(f"WARNING: {broken_edges} network edge(s) point to missing nodes and will be filtered in the frontend.")


def validate_public_exports(errors: list[str]) -> None:
    exports = {
        "data/exports/public/public_timeline.json": "items",
        "data/exports/public/public_hearings.json": "hearings",
        "data/exports/public/public_issues.json": "issues",
        "data/exports/public/public_sources.json": "sources",
        "data/exports/public/public_evidence.json": "items",
    }
    for path, required_key in exports.items():
        data = load_json(path, errors)
        if not isinstance(data, dict):
            fail(f"{path} must be a JSON object", errors)
            continue
        if required_key not in data:
            fail(f"{path} missing required key: {required_key}", errors)
        if required_key in data and not isinstance(data[required_key], list):
            fail(f"{path}: {required_key} must be a list", errors)


def main() -> int:
    errors: list[str] = []

    for required in REQUIRED_FILES:
        if not (ROOT / required).exists():
            fail(f"Missing required file: {required}", errors)

    index = read_text("index.html", errors)
    app = read_text("app.js", errors)
    enhancements = read_text("network-enhancements.js", errors)
    bridge = read_text("network-focus-bridge.js", errors)
    css = read_text("styles.css", errors)

    check_snippets("index.html", index, REQUIRED_INDEX_SNIPPETS, errors)
    check_absent("index.html", index, FORBIDDEN_INDEX_SNIPPETS, errors)
    check_snippets("app.js", app, REQUIRED_APP_SNIPPETS, errors)
    check_snippets("network-enhancements.js", enhancements, REQUIRED_ENHANCEMENT_SNIPPETS, errors)
    check_snippets("network-focus-bridge.js", bridge, REQUIRED_BRIDGE_SNIPPETS, errors)
    check_snippets("styles.css", css, REQUIRED_CSS_SNIPPETS, errors)
    check_absent("styles.css", css, FORBIDDEN_CSS_SNIPPETS, errors)

    validate_public_exports(errors)
    validate_network(errors)

    if errors:
        print("Hydra Public static dashboard validation FAILED:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Hydra Public static dashboard validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
