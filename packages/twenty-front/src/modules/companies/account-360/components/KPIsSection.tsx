import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconHistory, IconTrendingUp, IconClock } from 'twenty-ui/display';

const StyledKPIsSection = styled.div`
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

const StyledKPIsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledKPICard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
`;

const StyledKPIIconContainer = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ $highlighted }) =>
    $highlighted
      ? themeCssVariables.accent.primary
      : themeCssVariables.accent.quaternary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ $highlighted }) =>
    $highlighted
      ? themeCssVariables.font.color.inverted
      : themeCssVariables.font.color.secondary};
`;

const StyledKPIValue = styled.span<{ $highlighted?: boolean }>`
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${({ $highlighted }) =>
    $highlighted
      ? themeCssVariables.accent.primary
      : themeCssVariables.font.color.primary};
`;

const StyledKPILabel = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

type KPIData = {
  activityCount?: number | null;
  suspectScore?: number | null;
  lastActivityDate?: Date | null;
};

type KPIsSectionProps = {
  kpiData?: KPIData;
};

export const KPIsSection = ({ kpiData }: KPIsSectionProps) => {
  if (!kpiData) {
    return (
      <StyledKPIsSection>
        <StyledSectionHeader>Key Metrics</StyledSectionHeader>
        <StyledEmptyState>Loading metrics...</StyledEmptyState>
      </StyledKPIsSection>
    );
  }

  const { activityCount, suspectScore, lastActivityDate } = kpiData;

  const formatRelativeTime = (date: Date): string => {
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffMinutes = Math.floor(diffMs / 60_000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (Math.abs(diffDays) >= 1) return rtf.format(-diffDays, 'day');
    if (Math.abs(diffHours) >= 1) return rtf.format(-diffHours, 'hour');
    return rtf.format(-diffMinutes, 'minute');
  };

  const kpis = [
    {
      icon: <IconHistory />,
      label: 'Activities',
      value: activityCount?.toString() ?? '0',
      tooltip: 'Total activities on this account',
    },
    {
      icon: <IconTrendingUp />,
      label: 'Suspect Score',
      value: suspectScore != null ? suspectScore.toString() : 'N/A',
      tooltip:
        suspectScore != null
          ? 'AI-assisted prospect maturity score (0-5)'
          : 'Score requires AI enrichment',
      highlighted: suspectScore != null,
    },
    {
      icon: <IconClock />,
      label: 'Last Activity',
      value: lastActivityDate ? formatRelativeTime(lastActivityDate) : 'Never',
      tooltip: 'Most recent activity on this account',
    },
  ];

  return (
    <StyledKPIsSection>
      <StyledSectionHeader>Key Metrics</StyledSectionHeader>
      <StyledKPIsGrid>
        {kpis.map((kpi, index) => (
          <StyledKPICard key={index} title={kpi.tooltip}>
            <StyledKPIIconContainer $highlighted={kpi.highlighted}>
              {kpi.icon}
            </StyledKPIIconContainer>
            <StyledKPIValue $highlighted={kpi.highlighted}>
              {kpi.value}
            </StyledKPIValue>
            <StyledKPILabel>{kpi.label}</StyledKPILabel>
          </StyledKPICard>
        ))}
      </StyledKPIsGrid>
    </StyledKPIsSection>
  );
};
