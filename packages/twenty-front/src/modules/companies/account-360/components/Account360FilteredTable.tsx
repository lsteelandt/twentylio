import { CommandMenuComponentInstanceContext } from '@/command-menu/states/contexts/CommandMenuComponentInstanceContext';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { PageLayoutEditModeProviderContext } from '@/page-layout/contexts/PageLayoutEditModeContext';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordTableWidget } from '@/object-record/record-table-widget/components/RecordTableWidget';
import { RecordTableWidgetProvider } from '@/object-record/record-table-widget/components/RecordTableWidgetProvider';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useViewOrDefaultView } from '@/views/hooks/useViewOrDefaultView';
import { hasInitializedCurrentRecordFiltersComponentFamilyState } from '@/views/states/hasInitializedCurrentRecordFiltersComponentFamilyState';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { getFilterTypeFromFieldType } from 'twenty-shared/utils';
import { ViewFilterOperand } from '~/generated-metadata/graphql';

type Account360FilteredTableProps = {
  objectNameSingular: string;
  companyId: string;
  /** Field name to filter on (e.g. 'companyId'). If omitted, no filter is applied. */
  filterFieldName?: string;
};

/**
 * Effect that injects a company filter into the record table after the view loads.
 * Uses useAtom for reactive subscription to the initialization state.
 */
const CompanyFilterEffect = ({
  companyId,
  filterFieldName,
  viewId,
}: {
  companyId: string;
  filterFieldName: string;
  viewId: string;
}) => {
  const { recordIndexId, objectMetadataItem } = useRecordIndexContextOrThrow();
  const filterApplied = useRef(false);

  // Reactively subscribe to filter initialization state via useAtom
  const initAtom = useMemo(
    () =>
      hasInitializedCurrentRecordFiltersComponentFamilyState.atomFamily({
        instanceId: recordIndexId,
        familyKey: { viewId },
      }),
    [recordIndexId, viewId],
  );
  const [hasInitialized] = useAtom(initAtom);

  // Also subscribe to current filters to apply after init
  const filtersAtom = useMemo(
    () =>
      currentRecordFiltersComponentState.atomFamily({
        instanceId: recordIndexId,
      }),
    [recordIndexId],
  );
  const [currentFilters, setCurrentFilters] = useAtom(filtersAtom);

  useEffect(() => {
    if (!hasInitialized || filterApplied.current || !companyId || !filterFieldName) return;

    // Search for the field — try exact match first, then relation field name
    let companyField = objectMetadataItem.fields.find(
      (f) => f.name === filterFieldName,
    );
    if (!companyField) {
      // In Twenty, relation foreign keys like 'companyId' may not be in metadata.
      // The corresponding relation field is 'company' (type RELATION).
      const relationFieldName = filterFieldName.replace(/Id$/, '');
      companyField = objectMetadataItem.fields.find(
        (f) => f.name === relationFieldName,
      );
    }
    if (!companyField) return;

    const alreadyHasFilter = (currentFilters ?? []).some(
      (f) => f.id === 'account-360-company-filter',
    );

    if (!alreadyHasFilter) {
      setCurrentFilters([
        ...(currentFilters ?? []),
        {
          id: 'account-360-company-filter',
          fieldMetadataId: companyField.id,
          // RELATION filter value must be a JSON string of UUID array
          value: JSON.stringify([companyId]),
          displayValue: '',
          type: getFilterTypeFromFieldType(companyField.type),
          operand: ViewFilterOperand.IS,
          positionInRecordFilterGroup: 0,
          label: companyField.label,
        },
      ]);
    }

    filterApplied.current = true;
  }, [hasInitialized, currentFilters, companyId, filterFieldName, objectMetadataItem, setCurrentFilters]);

  return null;
};

/**
 * Embeds a RecordTableWidget for a given object type, optionally filtered by company.
 * Uses the default index view for the object.
 */
export const Account360FilteredTable = ({
  objectNameSingular,
  companyId,
  filterFieldName,
}: Account360FilteredTableProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { view } = useViewOrDefaultView({
    objectMetadataItemId: objectMetadataItem.id,
  });

  if (!view) return null;

  const widgetId = `account-360-${objectNameSingular}`;

  return (
    <PageLayoutEditModeProviderContext value={{ isInEditMode: false }}>
      <CommandMenuComponentInstanceContext.Provider
        value={{ instanceId: `account-360-command-menu-${objectNameSingular}` }}
      >
        <RecordTableWidgetProvider
          objectNameSingular={objectNameSingular}
          viewId={view.id}
          widgetId={widgetId}
        >
          {filterFieldName && (
            <CompanyFilterEffect
              companyId={companyId}
              filterFieldName={filterFieldName}
              viewId={view.id}
            />
          )}
          <RecordTableWidget />
        </RecordTableWidgetProvider>
      </CommandMenuComponentInstanceContext.Provider>
    </PageLayoutEditModeProviderContext>
  );
};
