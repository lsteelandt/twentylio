import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconMap,
  IconBuildingSkyscraper,
  IconMail,
  IconCurrencyDollar,
  IconPencil,
} from 'twenty-ui/display';
import { useCustomFieldsFromCompany } from '../hooks/useCustomFieldsFromCompany';

const StyledContextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.transparent.light};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
`;

const StyledSectionHeader = styled.h3`
  margin: 0;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledFieldsGrid = styled.div`
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

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledEmptyStateIcon = styled.div`
  font-size: 48px;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledEmptyStateText = styled.p`
  margin: 0;
  font-size: ${themeCssVariables.font.size.md};
  max-width: 300px;
  text-align: center;
`;

const StyledEditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.accent.primary};
  color: ${themeCssVariables.font.color.inverted};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${themeCssVariables.accent.secondary};
  }
`;

const StyledEditActionsContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  align-items: center;
`;

type CompanyData = {
  name?: string | null;
  domainName?: string | null;
  employees?: number | null;
  annualRecurringRevenue?: number | null;
  linkedinUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

type ContextSectionProps = {
  companyData?: CompanyData;
  customFields?: Array<{
    id: string;
    label: string;
    value: unknown;
    type: string;
  }>;
  onEdit?: () => void;
};

export const ContextSection = ({
  companyData,
  customFields = [],
  onEdit,
}: ContextSectionProps) => {
  if (!companyData) {
    return (
      <StyledEmptyState>
        <StyledEmptyStateIcon>
          <IconBuildingSkyscraper />
        </StyledEmptyStateIcon>
        <StyledEmptyStateText>
          No company information available
        </StyledEmptyStateText>
        {onEdit && (
          <StyledEditButton onClick={onEdit}>Add Company Info</StyledEditButton>
        )}
      </StyledEmptyState>
    );
  }

  const fields = [
    {
      label: 'Domain',
      value: companyData.domainName || '—',
      icon: <IconBuildingSkyscraper />,
    },
    {
      label: 'Employees',
      value: companyData.employees?.toString() || '—',
      icon: <IconBuildingSkyscraper />,
    },
    {
      label: 'Revenue',
      value: companyData.annualRecurringRevenue
        ? `$${companyData.annualRecurringRevenue.toLocaleString()}`
        : '—',
      icon: <IconCurrencyDollar />,
    },
    {
      label: 'LinkedIn',
      value: companyData.linkedinUrl || '—',
      icon: <IconMail />,
    },
    {
      label: 'Location',
      value:
        [companyData.city, companyData.state, companyData.country]
          .filter(Boolean)
          .join(', ') || '—',
      icon: <IconMap />,
    },
  ];

  return (
    <StyledContextSection>
      <StyledSectionHeader>Company Information</StyledSectionHeader>
      <StyledFieldsGrid>
        {fields.map((field, index) => (
          <StyledField key={index}>
            <StyledFieldLabel>{field.label}</StyledFieldLabel>
            <StyledFieldValue>{field.value}</StyledFieldValue>
          </StyledField>
        ))}
        {/* Custom Fields from Page Layout configuration */}
        {customFields.map((field, index) => (
          <StyledField key={`custom-${index}`}>
            <StyledFieldLabel>{field.label}</StyledFieldLabel>
            <StyledFieldValue>
              {field.value !== null && field.value !== undefined
                ? String(field.value)
                : '—'}
            </StyledFieldValue>
          </StyledField>
        ))}
      </StyledFieldsGrid>
      {onEdit && (
        <StyledEditActionsContainer>
          <StyledEditButton onClick={onEdit}>
            <IconPencil />
            Edit Information
          </StyledEditButton>
        </StyledEditActionsContainer>
      )}
    </StyledContextSection>
  );
};
