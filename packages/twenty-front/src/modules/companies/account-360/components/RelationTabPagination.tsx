import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconChevronLeft, IconChevronRight } from 'twenty-ui/display';

const StyledPaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const StyledPaginationButton = styled.button<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ $disabled }) =>
    $disabled
      ? themeCssVariables.font.color.tertiary
      : themeCssVariables.font.color.primary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${themeCssVariables.background.transparent.light};
    border-color: ${themeCssVariables.accent.primary};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const StyledPaginationInfo = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

export type RelationTabPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export const RelationTabPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: RelationTabPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <StyledPaginationContainer>
      <StyledPaginationButton
        $disabled={currentPage === 1}
        onClick={handlePrevious}
        aria-label="Previous page"
      >
        <IconChevronLeft />
      </StyledPaginationButton>
      <StyledPaginationInfo>
        {currentPage} / {totalPages} ({totalItems} items)
      </StyledPaginationInfo>
      <StyledPaginationButton
        $disabled={currentPage === totalPages}
        onClick={handleNext}
        aria-label="Next page"
      >
        <IconChevronRight />
      </StyledPaginationButton>
    </StyledPaginationContainer>
  );
};
