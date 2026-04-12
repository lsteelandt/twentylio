import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UpdateRecordService } from 'src/engine/core-modules/record-crud/services/update-record.service';

import {
  callN8NEnrichmentAPIWithRetry,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY_COUNT,
} from '../utils/n8nApiClient';
import type {
  EnrichAccount360RequestPayload,
  EnrichAccount360ResponsePayload,
} from '../types/EnrichAccount360WorkflowActionType';

type EnrichCompany360Result = {
  success: boolean;
  suspectScore?: number | null;
  notes?: string | null;
  error?: string | null;
};

@MetadataResolver()
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class EnrichCompany360Resolver {
  constructor(private readonly updateRecordService: UpdateRecordService) {}

  @Mutation(() => String, { nullable: true })
  @UseGuards(NoPermissionGuard)
  async enrichCompany360(
    @Args('companyId', { type: () => UUIDScalarType }) companyId: string,
  ): Promise<EnrichCompany360Result | null> {
    const authContext = getWorkspaceAuthContext();

    try {
      // Prepare request payload for n8n
      const requestPayload: EnrichAccount360RequestPayload = {
        companyId,
        companyContext: await this.getCompanyContext(
          companyId,
          authContext.workspace.id,
        ),
        metadata: {
          triggeredBy: 'manual',
          timestamp: new Date().toISOString(),
        },
      };

      // Call n8n API with retry logic
      const responsePayload: EnrichAccount360ResponsePayload =
        await callN8NEnrichmentAPIWithRetry(
          requestPayload,
          DEFAULT_RETRY_COUNT,
        );

      // Build update object with enriched data
      const objectRecord: Record<string, unknown> = {
        suspectScore: responsePayload.enrichedData?.suspectScore ?? undefined,
      };

      // Update Company with enriched data using UpdateRecordService
      await this.updateRecordService.execute({
        objectName: 'company',
        objectRecordId: companyId,
        objectRecord,
        fieldsToUpdate: Object.keys(objectRecord),
        authContext,
      });

      return {
        success: true,
        suspectScore: responsePayload.enrichedData?.suspectScore ?? null,
        notes: responsePayload.enrichedData?.notes ?? null,
      };
    } catch (error) {
      console.error('Failed to enrich company 360:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async getCompanyContext(
    _companyId: string,
    _workspaceId: string,
  ): Promise<{
    name: string;
    domainName?: string | null;
    employees?: number | null;
    suspectScore?: number | null;
  }> {
    // TODO: Implement company context fetch from database
    // For now, return minimal context to avoid errors
    return {
      name: '',
      domainName: null,
      employees: null,
      suspectScore: null,
    };
  }
}
