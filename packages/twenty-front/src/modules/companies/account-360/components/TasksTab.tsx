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

type TaskData = ObjectRecord & {
  id: string;
  [key: string]: any;
};

type TasksTabProps = {
  tasks?: TaskData[];
};

export const TasksTab = ({ tasks }: TasksTabProps) => {
  const { visibleViewFields, objectMetadataItem } = useViewFieldsByViewName(CoreObjectNameSingular.Task);

  const columns: ColumnDefinition<TaskData>[] = useMemo(() => {
    if (objectMetadataItem === undefined || objectMetadataItem === null || visibleViewFields.length === 0) {
      return [
        {
          id: 'title',
          label: 'Titre',
          width: '250px',
          renderCell: (task) => task.title ?? '-',
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
        renderCell: (task: TaskData) => {
          if (isLabelIdentifier) {
            const title = renderFieldValue(task[fieldName], fieldMetadataItem.type);
            return title ?? '-';
          }
          const rendered = renderFieldValue(task[fieldName], fieldMetadataItem.type);
          return rendered ?? '-';
        },
      };
    });
  }, [visibleViewFields, objectMetadataItem]);

  return (
    <RelationTable<TaskData>
      data={tasks ?? []}
      columns={columns}
      emptyMessage="Aucune tâche trouvée"
    />
  );
};
