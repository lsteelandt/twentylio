import { Injectable, Logger } from '@nestjs/common';
import {
  type WorkspaceEventBatch,
  WorkspaceEventEmitterService,
} from 'src/engine/workspace-event-emitter';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkflowCommonWorkspaceService } from 'src/modules/workflow/common/workspace-services/workflow-common.workspace-service';
import { WorkflowTriggerJob } from 'src/modules/workflow/workflow-trigger/jobs/workflow-trigger.job';
import { type WorkflowViewEventTriggerSettings } from '../types/view-event-trigger-settings.type';
import { AutomatedTriggerType } from 'src/modules/workflow/common/standard-objects/workflow-automated-trigger.workspace-entity';

@Injectable()
export class WorkflowViewEventTriggerListener {
  private readonly logger = new Logger(WorkflowViewEventTriggerListener.name);

  constructor(
    private readonly workspaceEventEmitter: WorkspaceEventEmitterService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly workflowCommonService: WorkflowCommonWorkspaceService,
  ) {}

  async handleCustomWorkspaceEvent(
    payload: WorkspaceEventBatch<unknown>,
  ): Promise<void> {
    // Vérifier si c'est bien notre événement de vue de compte 360
    if (payload.name !== 'ACCOUNT_360_VIEWED') {
      return;
    }

    this.logger.debug(
      `Received ACCOUNT_360_VIEWED event for company ${payload.payload.companyId}`,
    );

    const { companyId, userId, timestamp } = payload.payload as {
      companyId: string;
      userId: string;
      timestamp: string;
    };

    try {
      const workflowIds =
        await this.workflowCommonService.getWorkflowIdsForAutomatedTrigger(
          AutomatedTriggerType.VIEW_EVENT,
          {
            objectType: 'company', // Le type d'objet pour lequel on écoute les vues
          },
        );

      if (workflowIds.length === 0) {
        this.logger.debug(
          `No workflows found for VIEW_EVENT trigger on company object`,
        );
        return;
      }

      this.logger.log(
        `Found ${workflowIds.length} workflows for VIEW_EVENT trigger on company object`,
      );

      // Déclencher chaque workflow trouvé
      for (const workflowId of workflowIds) {
        await this.workspaceEventEmitter.add(
          WorkflowTriggerJob.name,
          {
            workspaceId: payload.workspaceId,
            workflowId,
            payload: {
              ...payload.payload,
              // Ajouter les métadonnées spécifiques au déclencheur de vue
              triggerType: 'VIEW_EVENT',
              triggerTimestamp: new Date().toISOString(),
            },
          },
          { retryLimit: 3 },
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing ACCOUNT_360_VIEWED event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}