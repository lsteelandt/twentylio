/**
 * Suspect Score Custom Field Definition
 * This field stores the AI-assisted prospect maturity score (0-5)
 */

export const SUSPECT_SCORE_FIELD_NAME = 'suspectScore';

export const SUSPECT_SCORE_FIELD_LABEL = 'Suspect Score';

export const SUSPECT_SCORE_FIELD_DESCRIPTION =
  'AI-assisted prospect maturity score (0-5) from n8n enrichment';

// Field properties for the custom field definition
export const createSuspectScoreCustomFieldDefinition = () => {
  return {
    name: SUSPECT_SCORE_FIELD_NAME,
    label: SUSPECT_SCORE_FIELD_LABEL,
    description: SUSPECT_SCORE_FIELD_DESCRIPTION,
    type: 'NUMBER',
    isNullable: true,
    defaultValue: null,
  };
};
