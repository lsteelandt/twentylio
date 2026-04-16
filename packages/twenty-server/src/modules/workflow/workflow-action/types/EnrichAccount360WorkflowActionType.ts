/**
 * Workflow Action Type for Enriching Account 360 data via AI/n8n
 * Sends Company context to n8n endpoint and updates with enriched data
 */

export const ENRICH_ACCOUNT_360_WORKFLOW_ACTION_TYPE =
  'ENRICH_ACCOUNT_360' as const;

export const ENRICH_ACCOUNT_360_WORKFLOW_ACTION_LABEL =
  'Enrich Account 360 (AI)' as const;

export const ENRICH_ACCOUNT_360_WORKFLOW_ACTION_DESCRIPTION =
  'Enrich account 360 data using AI and OSINT via n8n integration' as const;

// Request structure sent to n8n
export type EnrichAccount360RequestPayload = {
  companyId: string;
  companyContext: {
    name: string;
    domainName?: string | null;
    employees?: number | null;
    annualRecurringRevenue?: number | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    suspectScore?: number | null;
  };
  metadata: {
    triggeredBy: 'manual' | 'workflow';
    timestamp: string;
  };
};

// Response structure received from n8n
export type EnrichAccount360ResponsePayload = {
  companyId: string;
  enrichedData: {
    suspectScore?: number;
    notes?: string;
    customFields?: Record<string, unknown>;
  };
  source: 'n8n';
};

// Action settings for the workflow action
export type EnrichAccount360WorkflowActionSettings = {
  n8nEndpoint?: string;
  timeout?: number; // milliseconds
  retryCount?: number;
  retryDelay?: number; // milliseconds
};
