import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSectionHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledSectionTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledSectionCount = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

type RelationSectionProps = {
  title: string;
  count?: number;
  children: React.ReactNode;
};

export const RelationSection = ({ title, count, children }: RelationSectionProps) => {
  return (
    <StyledSectionContainer>
      <StyledSectionHeader>
        <StyledSectionTitle>{title}</StyledSectionTitle>
        {count !== undefined && (
          <StyledSectionCount>({count})</StyledSectionCount>
        )}
      </StyledSectionHeader>
      {children}
    </StyledSectionContainer>
  );
};
