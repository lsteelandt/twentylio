import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableRow } from '@/ui/layout/table/components/TableRow';

const StyledTableContainer = styled.div`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  overflow: hidden;
`;

const StyledTableHeader = styled.div`
  display: flex;
  background: ${themeCssVariables.background.tertiary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

export type ColumnDefinition<T> = {
  id: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  renderCell: (data: T) => React.ReactNode;
};

export type RelationTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
};

export const RelationTable = <T,>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'Aucun résultat',
}: RelationTableProps<T>) => {
  if (!data || data.length === 0) {
    return <StyledEmptyState>{emptyMessage}</StyledEmptyState>;
  }

  const gridTemplateColumns = columns
    .map((col) => col.width ?? '1fr')
    .join(' ');

  return (
    <StyledTableContainer>
      <StyledTableHeader style={{ gridTemplateColumns }}>
        {columns.map((col) => (
          <TableHeader
            key={col.id}
            align={col.align}
            padding={`0 ${themeCssVariables.spacing[2]}`}
          >
            {col.label}
          </TableHeader>
        ))}
      </StyledTableHeader>
      {data.map((item, index) => (
        <TableRow
          key={String((item as any).id ?? index)}
          onClick={() => onRowClick?.(item)}
          isClickable={!!onRowClick}
          gridTemplateColumns={gridTemplateColumns}
          height={themeCssVariables.spacing[10]}
        >
          {columns.map((col) => (
            <TableCell
              key={col.id}
              align={col.align}
              padding={`0 ${themeCssVariables.spacing[2]}`}
            >
              {col.renderCell(item)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </StyledTableContainer>
  );
};
