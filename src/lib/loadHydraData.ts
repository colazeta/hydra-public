import type {
  Hearing,
  HydraEdge,
  HydraNode,
  LegalIssue,
  QualityLegendItem,
  TimelineSegment,
} from './hydraTypes';

export async function loadHearings(): Promise<Hearing[]> {
  const response = await fetch('/data/hearings/hearings.json');
  return response.json();
}

export async function loadNodes(): Promise<HydraNode[]> {
  const response = await fetch('/data/network/nodes.json');
  return response.json();
}

export async function loadEdges(): Promise<HydraEdge[]> {
  const response = await fetch('/data/network/edges.json');
  return response.json();
}

export async function loadLegalIssues(): Promise<LegalIssue[]> {
  const response = await fetch('/data/legal_issues/legal_issues.json');
  return response.json();
}

export async function loadQualityLegend(): Promise<QualityLegendItem[]> {
  const response = await fetch('/data/meta/quality_legend.json');
  return response.json();
}

export async function loadTimeline(
  fileName: string,
): Promise<TimelineSegment[]> {
  const response = await fetch(`/data/timeline/${fileName}`);
  return response.json();
}

export function validateEdges(
  nodes: HydraNode[],
  edges: HydraEdge[],
): string[] {
  const nodeIds = new Set(nodes.map((node) => node.id));

  const warnings: string[] = [];

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      warnings.push(`Missing source node: ${edge.source}`);
    }

    if (!nodeIds.has(edge.target)) {
      warnings.push(`Missing target node: ${edge.target}`);
    }
  }

  return warnings;
}
