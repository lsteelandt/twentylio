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

type PersonData = ObjectRecord & {
  id: string;
  [key: string]: any;
};

type PeopleTabProps = {
  people?: PersonData[];
};

export const PeopleTab = ({ people }: PeopleTabProps) => {
  const { visibleViewFields, objectMetadataItem } = useViewFieldsByViewName(CoreObjectNameSingular.Person);

  const columns: ColumnDefinition<PersonData>[] = useMemo(() => {
    if (objectMetadataItem === undefined || objectMetadataItem === null || visibleViewFields.length === 0) {
      return [
        {
          id: 'name',
          label: 'Nom',
          width: '200px',
          renderCell: (person) => {
            const firstName = person.name?.firstName ?? person.firstName;
            const lastName = person.name?.lastName ?? person.lastName;
            return `${firstName ?? ''} ${lastName ?? ''}`.trim() || '-';
          },
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
        renderCell: (person: PersonData) => {
          if (isLabelIdentifier) {
            const name = renderFieldValue(person[fieldName], fieldMetadataItem.type);
            return name ?? '-';
          }
          const rendered = renderFieldValue(person[fieldName], fieldMetadataItem.type);
          return rendered ?? '-';
        },
      };
    });
  }, [visibleViewFields, objectMetadataItem]);

  return (
    <RelationTable<PersonData>
      data={people ?? []}
      columns={columns}
      emptyMessage="Aucun contact trouvé"
    />
  );
};
