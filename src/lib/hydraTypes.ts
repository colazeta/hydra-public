export type QualityStatus = 'verified' | 'partial_review' | 'to_verify' | 'contested' | 'raw' | 'reviewed';

export interface HydraNode {
  id: string;
  type: string;
  type_public: string;
  label: string;
  public_label: string;
  quality_status: QualityStatus;
  notes?: string;
}

export interface HydraEdge {
  id: string;
  source: string;
  target: string;
  edge_type: string;
  edge_type_public: string;
  quality_status: QualityStatus;
}

export interface Hearing {
  id: string;
  public_title: string;
  technical_label: string;
  date: string | null;
  date_status: string;
  quality_status: QualityStatus;
  public_summary: string;
  method_note?: string;
}

export interface LegalIssue {
  id: string;
  slug: string;
  public_label: string;
  technical_label: string;
  summary: string;
  quality_status: QualityStatus;
}

export interface QualityLegendItem {
  status: QualityStatus;
  public_label: string;
  description: string;
}

export interface TimelineSegment {
  segment_id: string;
  hearing_id: string;
  sequence: number;
  public_title: string;
  summary: string;
  quality_status: QualityStatus;
}
