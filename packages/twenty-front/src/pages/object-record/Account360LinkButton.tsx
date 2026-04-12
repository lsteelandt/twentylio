import { useNavigate } from 'react-router-dom';
import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconEye } from 'twenty-ui/display';

const StyledLinkButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-weight: ${themeCssVariables.font.weight.regular};
  gap: ${themeCssVariables.spacing[1]};
  height: auto;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: color ${themeCssVariables.animation.duration.instant}s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
    background: ${themeCssVariables.background.transparent.light};
  }

  &:active {
    background: ${themeCssVariables.background.transparent.medium};
  }
`;

type Account360LinkButtonProps = {
  objectNameSingular: string;
  objectRecordId: string;
};

export const Account360LinkButton = ({
  objectNameSingular,
  objectRecordId,
}: Account360LinkButtonProps) => {
  const navigate = useNavigate();

  // Only show for company objects
  if (objectNameSingular !== 'company') {
    return null;
  }

  const handleNavigateTo360 = () => {
    navigate(`/object/${objectNameSingular}/${objectRecordId}/360`);
  };

  return (
    <StyledLinkButton onClick={handleNavigateTo360} type="button">
      <IconEye />
      Vue 360
    </StyledLinkButton>
  );
};
