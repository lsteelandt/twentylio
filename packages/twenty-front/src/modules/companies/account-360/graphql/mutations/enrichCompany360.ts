import { gql } from '@apollo/client';

export const ENRICH_COMPANY_360 = gql`
  mutation EnrichCompany360($companyId: ID!) {
    enrichCompany360(companyId: $companyId) {
      success
      suspectScore
      notes
      error
    }
  }
`;

export type EnrichCompany360MutationVariables = {
  companyId: string;
};

export type EnrichCompany360MutationResult = {
  enrichCompany360: {
    success: boolean;
    suspectScore: number | null;
    notes: string | null;
    error: string | null;
  } | null;
};
