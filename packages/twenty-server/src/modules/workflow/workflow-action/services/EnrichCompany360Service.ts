import { Injectable } from '@nestjs/common';

import type { EnrichAccount360ResponsePayload } from '../types/EnrichAccount360WorkflowActionType';

/**
 * Service to handle Account 360 enrichment from n8n
 * TODO: Implement full company update logic when GraphQL mutation is ready
 */
@Injectable()
export class EnrichCompany360Service {
  /**
   * Update Company with enriched data from n8n response
   */
  async updateCompanyWithEnrichedData(
    responsePayload: EnrichAccount360ResponsePayload,
  ): Promise<void> {
    const { companyId, enrichedData } = responsePayload;

    const updateData: Record<string, unknown> = {};

    if (enrichedData.suspectScore !== undefined) {
      updateData['suspectScore'] = enrichedData.suspectScore;
    }

    if (Object.keys(updateData).length === 0) {
      console.warn('No enriched data to update for company:', companyId);
      return;
    }

    // TODO: Execute update via UpdateRecordService once field mapping is confirmed
    console.log('Updating company with enriched data:', {
      companyId,
      updateData,
    });
  }
}
