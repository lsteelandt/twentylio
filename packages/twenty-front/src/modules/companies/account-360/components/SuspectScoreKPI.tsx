import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconTrendingUp } from 'twenty-ui/display';

const StyledSuspectScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledScoreDisplay = styled.div<{ $score: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: ${themeCssVariables.border.radius.rounded};
  background: ${({ $score }) => {
    if ($score >= 4) return themeCssVariables.background.transparent.success;
    if ($score >= 3) return themeCssVariables.background.transparent.orange;
    if ($score >= 2) return themeCssVariables.accent.tertiary;
    return themeCssVariables.accent.quaternary;
  }};
  color: ${({ $score }) => {
    if ($score >= 4) return themeCssVariables.font.color.inverted;
    if ($score >= 3) return themeCssVariables.font.color.inverted;
    if ($score >= 2) return themeCssVariables.font.color.primary;
    return themeCssVariables.font.color.secondary;
  }};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledScoreBars = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  justify-content: center;
`;

const StyledScoreBar = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 4px;
  background: ${({ $active }) =>
    $active
      ? themeCssVariables.accent.primary
      : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.rounded};
`;

const StyledEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledTooltip = styled.div`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  text-align: center;
`;

type SuspectScoreKPIProps = {
  score: number | null;
};

export const SuspectScoreKPI = ({ score }: SuspectScoreKPIProps) => {
  if (score === null) {
    return (
      <StyledSuspectScoreContainer>
        <StyledEmptyState>N/A</StyledEmptyState>
        <StyledTooltip>AI enrichment required</StyledTooltip>
      </StyledSuspectScoreContainer>
    );
  }

  // Score range: 0-5, display as 5 bars
  const normalizedScore = Math.min(Math.max(score, 0), 5);

  return (
    <StyledSuspectScoreContainer>
      <StyledScoreDisplay $score={score}>{score}</StyledScoreDisplay>
      <StyledScoreBars>
        {[1, 2, 3, 4, 5].map((barLevel) => (
          <StyledScoreBar
            key={barLevel}
            $active={barLevel <= normalizedScore}
          />
        ))}
      </StyledScoreBars>
    </StyledSuspectScoreContainer>
  );
};
