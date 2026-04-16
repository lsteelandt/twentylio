import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { BREAKPOINTS } from '../utils/responsiveLayout';

const StyledMobileLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};

  @media (min-width: ${BREAKPOINTS.mobile + 1}px) {
    display: none;
  }
`;

const StyledMobileSection = styled.section<{ $order: number }>`
  padding: ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
`;

const StyledMobileSectionHeader = styled.h3`
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.secondary};
`;

type Account360MobileLayoutProps = {
  contextSection: React.ReactNode;
  relationsSection: React.ReactNode;
};

export const Account360MobileLayout = ({
  contextSection,
  relationsSection,
}: Account360MobileLayoutProps) => {
  return (
    <StyledMobileLayout>
      <StyledMobileSection $order={1}>
        <StyledMobileSectionHeader>Company Information</StyledMobileSectionHeader>
        {contextSection}
      </StyledMobileSection>
      <StyledMobileSection $order={2}>
        <StyledMobileSectionHeader>Relations</StyledMobileSectionHeader>
        {relationsSection}
      </StyledMobileSection>
    </StyledMobileLayout>
  );
};
