import { useState } from 'react';
import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconUsers, IconBriefcase, IconHistory } from 'twenty-ui/display';

const StyledRelationTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTabsHeader = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const StyledTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  cursor: pointer;
  transition: all 0.2s;

  &[data-active='true'] {
    border-bottom-color: ${themeCssVariables.accent.primary};
    color: ${themeCssVariables.accent.primary};
    font-weight: ${themeCssVariables.font.weight.semiBold};
  }

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledTabContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const StyledTabIcon = styled.span`
  display: flex;
  align-items: center;
`;

export type RelationTabType = 'people' | 'opportunities' | 'activities';

export type RelationTab = {
  id: RelationTabType;
  label: string;
  icon: React.ReactNode;
  count?: number;
};

type RelationTabsProps = {
  tabs: RelationTab[];
  activeTab: RelationTabType;
  onTabChange: (tab: RelationTabType) => void;
  children: React.ReactNode;
};

export const RelationTabs = ({
  tabs,
  activeTab,
  onTabChange,
  children,
}: RelationTabsProps) => {
  return (
    <StyledRelationTabsContainer>
      <StyledTabsHeader>
        {tabs.map((tab) => (
          <StyledTab
            key={tab.id}
            $active={tab.id === activeTab}
            data-active={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.count === 0}
          >
            <StyledTabIcon>{tab.icon}</StyledTabIcon>
            {tab.label}
            {tab.count !== undefined && ` (${tab.count})`}
          </StyledTab>
        ))}
      </StyledTabsHeader>
      <StyledTabContent>{children}</StyledTabContent>
    </StyledRelationTabsContainer>
  );
};
