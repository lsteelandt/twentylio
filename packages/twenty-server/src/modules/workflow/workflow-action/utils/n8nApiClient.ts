import type { EnrichAccount360RequestPayload, EnrichAccount360ResponsePayload } from '../types/EnrichAccount360WorkflowActionType';

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export class N8NApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'N8NApiError';
  }
}

/**
 * Call n8n API endpoint for account enrichment
 */
export const callN8NEnrichmentAPI = async (
  payload: EnrichAccount360RequestPayload,
  timeout = DEFAULT_TIMEOUT,
): Promise<EnrichAccount360ResponsePayload> => {
  if (!N8N_API_URL) {
    throw new N8NApiError('N8N_API_URL environment variable is not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (N8N_API_KEY) {
    headers['Authorization'] = `Bearer ${N8N_API_KEY}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new N8NApiError(`Request timeout after ${timeout}ms`);
  }, timeout);

  try {
    const response = await fetch(N8N_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new N8NApiError(
        `N8N API request failed: ${errorText}`,
        response.status,
      );
    }

    const data = (await response.json()) as EnrichAccount360ResponsePayload;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof N8NApiError) {
      throw error;
    }

    throw new N8NApiError(
      `Failed to call n8n API: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Call n8n API with retry logic
 */
export const callN8NEnrichmentAPIWithRetry = async (
  payload: EnrichAccount360RequestPayload,
  maxRetries = DEFAULT_RETRY_COUNT,
  retryDelay = DEFAULT_RETRY_DELAY,
): Promise<EnrichAccount360ResponsePayload> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await callN8NEnrichmentAPI(payload);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
      }
    }
  }

  throw lastError || new Error('Max retries reached without success');
};

export { DEFAULT_TIMEOUT, DEFAULT_RETRY_COUNT, DEFAULT_RETRY_DELAY };
