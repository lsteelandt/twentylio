import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { objectMetadataItemsBySingularNameSelector } from '@/object-metadata/states/objectMetadataItemsBySingularNameSelector';
import { indexViewIdFromObjectMetadataItemFamilySelector } from '@/views/states/selectors/indexViewIdFromObjectMetadataItemFamilySelector';
import { useRecordTableWidgetViewFieldItems } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetViewFieldItems';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useMemo } from 'react';

export const useDefaultViewFields = (
  objectNameSingular: CoreObjectNameSingular.Person | CoreObjectNameSingular.Opportunity | CoreObjectNameSingular.Task,
) => {
  // Get object metadata by name
  const objectMetadataItems = useAtomFamilySelectorValue(
    objectMetadataItemsBySingularNameSelector,
    [objectNameSingular],
  );

  const objectMetadataItem = objectMetadataItems?.[0];

  // Get default view ID for this object
  const indexViewId = useAtomFamilySelectorValue(
    indexViewIdFromObjectMetadataItemFamilySelector,
    { objectMetadataItemId: objectMetadataItem?.id ?? '' },
  );

  // Get view fields for the default view
  const { recordTableWidgetViewFieldItems } = useRecordTableWidgetViewFieldItems(
    indexViewId ?? '',
  );

  // Filter only visible fields and sort by position
  const visibleViewFields = useMemo(() => {
    if (!recordTableWidgetViewFieldItems) {
      return [];
    }

    return recordTableWidgetViewFieldItems
      .filter((item) => item.viewField.isVisible)
      .sort((a, b) => a.viewField.position - b.viewField.position);
  }, [recordTableWidgetViewFieldItems]);

  return {
    objectMetadataItem,
    visibleViewFields,
  };
};
