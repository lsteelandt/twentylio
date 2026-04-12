import { FieldMetadataType } from 'twenty-shared/types';

import { type WorkspaceMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration.type';

/**
 * Migration to add suspectScore custom field to Company object
 * This field stores the AI-assisted prospect maturity score (0-5)
 */
export const ADD_SUSPECT_SCORE_FIELD_TO_COMPANY_1771420702242 = {
  applicationUniversalIdentifier: '20202020-64aa-4b6f-b003-9c74b97cee20',
  actions: [
    {
      type: 'create',
      metadataName: 'fieldMetadata',
      flatEntity: {
        universalIdentifier: 'suspect-score-custom-field-uuid-0001',
        type: FieldMetadataType.NUMBER,
        name: 'suspectScore',
        label: 'Suspect Score',
        description: 'AI-assisted prospect maturity score (0-5) from n8n enrichment',
        icon: 'IconSparkles',
        isCustom: true,
        isActive: true,
        isSystem: false,
        isNullable: true,
        isUnique: false,
        isUIReadOnly: false,
        isLabelSyncedWithName: false,
        standardOverrides: null,
        defaultValue: null,
        options: null,
        morphId: null,
        createdAt: '2026-04-06T00:00:00.000Z',
        updatedAt: '2026-04-06T00:00:00.000Z',
        applicationUniversalIdentifier: '20202020-64aa-4b6f-b003-9c74b97cee20',
        objectMetadataUniversalIdentifier:
          '20202020-bd3d-4c60-8dca-571c71d4447a',
        relationTargetObjectMetadataUniversalIdentifier: null,
        relationTargetFieldMetadataUniversalIdentifier: null,
        universalSettings: null,
      },
    },
  ],
} satisfies WorkspaceMigration;
