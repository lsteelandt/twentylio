import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';

export type CustomFieldDisplay = {
  id: string;
  label: string;
  value: unknown;
  type: string;
};

export const useCustomFieldsFromCompany = () => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: 'company',
  });

  if (!objectMetadataItem) {
    return { customFields: [], isLoading: true };
  }

  // Filter out standard fields to get only custom fields
  const standardFields = new Set([
    'id',
    'name',
    'domainName',
    'employees',
    'annualRecurringRevenue',
    'linkedinUrl',
    'address',
    'city',
    'state',
    'country',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]);

  const customFields = objectMetadataItem.fields
    .filter((field) => !standardFields.has(field.name))
    .map((field) => ({
      id: field.id,
      label: field.label,
      value: null, // Will be populated from Company data
      type: field.type,
    }));

  return { customFields, isLoading: false };
};
