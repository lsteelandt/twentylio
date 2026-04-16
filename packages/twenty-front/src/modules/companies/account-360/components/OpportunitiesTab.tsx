import { useMemo } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { isLabelIdentifierField } from '@/object-metadata/utils/isLabelIdentifierField';

import {
  RelationTable,
  type ColumnDefinition,
} from './RelationTable';
import { useViewFieldsByViewName } from '../hooks/useViewFieldsByViewName';
import { renderFieldValue } from '../utils/renderFieldValue';

type OpportunityData = ObjectRecord & {
  id: string;
  [key: string]: any;
};

type OpportunitiesTabProps = {
  opportunities?: OpportunityData[];
};

export const OpportunitiesTab = ({ opportunities }: OpportunitiesTabProps) => {
  const { visibleViewFields, objectMetadataItem } = useViewFieldsByViewName(CoreObjectNameSingular.Opportunity);

  const columns: ColumnDefinition<OpportunityData>[] = useMemo(() => {
    if (objectMetadataItem === undefined || objectMetadataItem === null || visibleViewFields.length === 0) {
      return [
        {
          id: 'name',
          label: 'Nom',
          width: '200px',
          renderCell: (opp) => opp.name ?? '-',
        },
      ];
    }

    return visibleViewFields.map(({ viewField, fieldMetadataItem, objectMetadataItem: fieldObjectMetadataItem }) => {
      const fieldName = fieldMetadataItem.name;
      const label = fieldMetadataItem.label;
      const isLabelIdentifier = isLabelIdentifierField({ fieldMetadataItem, objectMetadataItem: fieldObjectMetadataItem });

      return {
        id: fieldName,
        label,
        width: `${viewField.size}px`,
        renderCell: (opp: OpportunityData) => {
          if (isLabelIdentifier) {
            const name = renderFieldValue(opp[fieldName], fieldMetadataItem.type);
            return name ?? '-';
          }
          const rendered = renderFieldValue(opp[fieldName], fieldMetadataItem.type);
          return rendered ?? '-';
        },
      };
    });
  }, [visibleViewFields, objectMetadataItem]);

  return (
    <RelationTable<OpportunityData>
      data={opportunities ?? []}
      columns={columns}
      emptyMessage="Aucune opportunité trouvée"
    />
  );
};
