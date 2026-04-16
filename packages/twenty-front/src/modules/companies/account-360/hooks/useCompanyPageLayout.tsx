import { useMemo } from 'react';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';

export type PageLayoutField = {
  id: string;
  name: string;
  type: string;
  position: number;
  isVisible: boolean;
};

export const useCompanyPageLayout = () => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: 'company',
  });

  return useMemo(() => {
    if (!objectMetadataItem) {
      return {
        fields: [] as PageLayoutField[],
        isLoading: true,
      };
    }

    // Extract fields from the object metadata
    // In a full implementation, this would fetch from the Page Layout configuration
    const fields: PageLayoutField[] = objectMetadataItem.fields.map(
      (field, index) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        position: index, // Use index as fallback since position is not on FieldMetadataItem
        isVisible: true, // Will be determined from Page Layout config
      }),
    );

    return {
      fields,
      isLoading: false,
    };
  }, [objectMetadataItem]);
};
