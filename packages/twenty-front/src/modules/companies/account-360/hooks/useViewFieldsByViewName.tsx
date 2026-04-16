import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { objectMetadataItemsBySingularNameSelector } from '@/object-metadata/states/objectMetadataItemsBySingularNameSelector';
import { viewsFromObjectMetadataItemFamilySelector } from '@/views/states/selectors/viewsFromObjectMetadataItemFamilySelector';
import { useGetFieldMetadataItemByIdOrThrow } from '@/object-metadata/hooks/useGetFieldMetadataItemById';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useCallback, useMemo } from 'react';

/**
 * Hook to retrieve view fields for a specific view name.
 * Implements the SQL queries:
 *
 * SELECT fm.name AS column_name, fm.type AS column_type, vf.position
 * FROM core."viewField" vf
 * JOIN core."fieldMetadata" fm ON vf."fieldMetadataId" = fm.id
 * JOIN core."view" v ON vf."viewId" = v.id
 * JOIN core."objectMetadata" om ON v."objectMetadataId" = om.id
 * WHERE om."nameSingular" = '{objectNameSingular}'
 * AND v.name = 'All {objectLabelPlural}'
 * AND vf."isVisible" = true
 * AND vf."isActive" = true
 * ORDER BY vf.position ASC;
 */
export const useViewFieldsByViewName = (
  objectNameSingular: CoreObjectNameSingular.Person | CoreObjectNameSingular.Opportunity | CoreObjectNameSingular.Task,
) => {
  // Get object metadata by name to access labelPlural
  const objectMetadataItems = useAtomFamilySelectorValue(
    objectMetadataItemsBySingularNameSelector,
    [objectNameSingular],
  );

  const objectMetadataItem = objectMetadataItems?.[0];

  // Get all views for this object
  const views = useAtomFamilySelectorValue(
    viewsFromObjectMetadataItemFamilySelector,
    { objectMetadataItemId: objectMetadataItem?.id ?? '' },
  );

  // Get field metadata by ID
  const { getFieldMetadataItemByIdOrThrow } =
    useGetFieldMetadataItemByIdOrThrow();

  // Map view field to include field metadata
  const mapViewFieldWithFieldMetadata = useCallback(
    (viewField: { id: string; fieldMetadataId: string; isVisible: boolean; position: number; size: number }) => {
      try {
        const result = getFieldMetadataItemByIdOrThrow(
          viewField.fieldMetadataId,
        );
        return {
          viewField,
          fieldMetadataItem: result.fieldMetadataItem,
          objectMetadataItem: result.objectMetadataItem,
        };
      } catch {
        return null;
      }
    },
    [getFieldMetadataItemByIdOrThrow],
  );

  // Find the view named "All {objectLabelPlural}" and extract its visible fields
  const visibleViewFields = useMemo(() => {
    if (!objectMetadataItem || !views) {
      return [];
    }

    // Construct the view name as "All {objectLabelPlural}"
    const targetViewName = `All ${objectMetadataItem.labelPlural}`;

    // Find the view with the exact name
    const targetView = views.find((view) => view.name === targetViewName);

    if (!targetView) {
      return [];
    }

    // Filter viewFields: isVisible=true
    // Note: ViewField doesn't have isActive and isSystem properties in the type definition
    // Sort by position ASC
    return targetView.viewFields
      .filter((viewField) => viewField.isVisible)
      .map(mapViewFieldWithFieldMetadata)
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.viewField.position - b.viewField.position);
  }, [objectMetadataItem, views, mapViewFieldWithFieldMetadata]);

  return {
    objectMetadataItem,
    visibleViewFields,
  };
};
