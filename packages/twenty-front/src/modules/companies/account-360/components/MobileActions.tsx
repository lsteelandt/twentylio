import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconPencil, IconDotsVertical } from 'twenty-ui/display';

const StyledMobileActionsContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border-top: 1px solid ${themeCssVariables.border.color.light};
  z-index: 100;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    gap: ${themeCssVariables.spacing[3]};
  }
`;

const StyledActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  min-width: 44px;
  min-height: 44px;
  padding: ${themeCssVariables.spacing[3]};
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

  &:active {
    transform: scale(0.95);
  }
`;

const StyledMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.accent.quaternary};
  color: ${themeCssVariables.font.color.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${themeCssVariables.accent.tertiary};
  }
`;

type MobileActionsProps = {
  onEdit?: () => void;
  onMenu?: () => void;
  children: React.ReactNode;
};

export const MobileActions = ({
  onEdit,
  onMenu,
  children,
}: MobileActionsProps) => {
  return (
    <>
      {children}
      <StyledMobileActionsContainer>
        <StyledActionButton onClick={onEdit}>
          <IconPencil />
        </StyledActionButton>
        <StyledMenuButton onClick={onMenu}>
          <IconDotsVertical />
        </StyledMenuButton>
      </StyledMobileActionsContainer>
    </>
  );
};
