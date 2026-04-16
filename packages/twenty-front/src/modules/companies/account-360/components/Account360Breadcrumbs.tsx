import { styled } from '@linaria/react';
import { Link, useNavigate } from 'react-router-dom';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconChevronRight } from 'twenty-ui/display';

const StyledBreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]} 0;
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledBreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledBreadcrumbLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  color: ${themeCssVariables.font.color.tertiary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${themeCssVariables.accent.primary};
  }

  &.current {
    color: ${themeCssVariables.font.color.primary};
    font-weight: ${themeCssVariables.font.weight.semiBold};
    pointer-events: none;
    cursor: default;
  }
`;

const StyledBreadcrumbIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${themeCssVariables.font.color.light};
`;

type BreadcrumbItem = {
  label: string;
  path: string;
  isCurrent?: boolean;
};

type Account360BreadcrumbsProps = {
  companyName?: string | null;
  companyId?: string;
};

export const Account360Breadcrumbs = ({
  companyName,
  companyId,
}: Account360BreadcrumbsProps) => {
  const navigate = useNavigate();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Companies', path: '/objects/companies' },
  ];

  if (companyName) {
    breadcrumbs.push({
      label: companyName,
      path: `/object/companies/${companyId}`,
      isCurrent: true,
    });
  }

  return (
    <StyledBreadcrumbsContainer>
      {breadcrumbs.map((crumb, index) => (
        <StyledBreadcrumbItem key={index}>
          {!crumb.isCurrent && (
            <StyledBreadcrumbLink to={crumb.path}>
              {crumb.label}
            </StyledBreadcrumbLink>
          )}
          {crumb.isCurrent && (
            <StyledBreadcrumbLink to="#" className="current">
              {crumb.label}
            </StyledBreadcrumbLink>
          )}
          {index < breadcrumbs.length - 1 && (
            <StyledBreadcrumbIcon>
              <IconChevronRight />
            </StyledBreadcrumbIcon>
          )}
        </StyledBreadcrumbItem>
      ))}
    </StyledBreadcrumbsContainer>
  );
};
