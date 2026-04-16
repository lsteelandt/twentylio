import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import type { PageLayoutField } from '../hooks/useCompanyPageLayout';

const StyledPageLayoutFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledFieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledFieldLabel = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledFieldValue = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  word-break: break-word;
`;

type PageLayoutFieldsProps = {
  fields: PageLayoutField[];
  companyData: Record<string, unknown>;
};

export const PageLayoutFields = ({
  fields,
  companyData,
}: PageLayoutFieldsProps) => {
  if (!fields || fields.length === 0) {
    return null;
  }

  // Sort fields by position
  const sortedFields = [...fields].sort((a, b) => a.position - b.position);

  return (
    <StyledPageLayoutFields>
      <StyledFieldRow>
        {sortedFields.map((field) => {
          if (!field.isVisible) {
            return null;
          }

          const value = companyData[field.name];

          return (
            <StyledField key={field.id}>
              <StyledFieldLabel>{field.name}</StyledFieldLabel>
              <StyledFieldValue>
                {value !== null && value !== undefined ? String(value) : '—'}
              </StyledFieldValue>
            </StyledField>
          );
        })}
      </StyledFieldRow>
    </StyledPageLayoutFields>
  );
};
