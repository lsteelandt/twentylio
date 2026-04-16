import { useMemo } from 'react';

import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import {
  type RecordGqlOperationGqlRecordFields,
  CoreObjectNameSingular,
} from 'twenty-shared/types';
import { useGenerateDepthRecordGqlFieldsFromObject } from '@/object-record/graphql/record-gql-fields/hooks/useGenerateDepthRecordGqlFieldsFromObject';

// Company record type — only scalar fields, no nested relations
type CompanyRecord = ObjectRecord & {
  id: string;
  name: string | null;
  domainName: {
    primaryLinkUrl: string | null;
    primaryLinkLabel: string | null;
  } | null;
  employees: number | null;
  annualRecurringRevenue?: {
    amountMicros: number | null;
    currencyCode: string | null;
  } | null;
  linkedinLink?: {
    primaryLinkUrl: string | null;
    primaryLinkLabel: string | null;
  } | null;
  address?: {
    addressStreet1?: string | null;
    addressCity?: string | null;
    addressState?: string | null;
    addressCountry?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

// Person record type - use ObjectRecord with dynamic fields
type PersonRecord = ObjectRecord & {
  id: string;
  [key: string]: any;
};

// Opportunity record type - use ObjectRecord with dynamic fields
type OpportunityRecord = ObjectRecord & {
  id: string;
  [key: string]: any;
};

// Timeline activity record type
type TimelineActivityRecord = ObjectRecord & {
  id: string;
  name: string | null;
  happensAt: string;
  linkedRecordCachedName: string | null;
  linkedObjectMetadataId: string | null;
  createdAt: string;
  updatedAt: string;
  targetCompanyId: string | null;
};

// Task record type - use ObjectRecord with dynamic fields
type TaskRecord = ObjectRecord & {
  id: string;
  [key: string]: any;
};

// TaskTarget record type - junction table between Task and Company
type TaskTargetRecord = ObjectRecord & {
  id: string;
  taskId: string | null;
  targetCompanyId: string | null;
  task: TaskRecord | null;
  [key: string]: any;
};

export type Account360Data = CompanyRecord | null;

/**
 * Hook to fetch all Account 360 data for a given company.
 * Uses separate queries for company info, people, opportunities, tasks, and timeline activities.
 */
export const useAccount360Data = (companyId: string) => {

  // --- Company scalar fields ---
  const companyGqlFields: RecordGqlOperationGqlRecordFields = useMemo(
    () => ({
      name: true,
      domainName: {
        primaryLinkUrl: true,
        primaryLinkLabel: true,
      },
      employees: true,
      annualRecurringRevenue: {
        amountMicros: true,
        currencyCode: true,
      },
      linkedinLink: {
        primaryLinkUrl: true,
        primaryLinkLabel: true,
      },
      address: {
        addressStreet1: true,
        addressCity: true,
        addressState: true,
        addressCountry: true,
      },
      createdAt: true,
      updatedAt: true,
    }),
    [],
  );

  const { record: companyRecord, loading: companyLoading } =
    useFindOneRecord<CompanyRecord>({
      objectNameSingular: 'company',
      objectRecordId: companyId,
      recordGqlFields: companyGqlFields,
    });

  // --- People ---
  const { recordGqlFields: peopleGqlFields } =
    useGenerateDepthRecordGqlFieldsFromObject({
      objectNameSingular: CoreObjectNameSingular.Person,
      depth: 1,
    });

  const { records: people, loading: peopleLoading } =
    useFindManyRecords<PersonRecord>({
      objectNameSingular: CoreObjectNameSingular.Person,
      filter: {
        companyId: { eq: companyId },
      },
      recordGqlFields: peopleGqlFields,
    });

  // --- Opportunities ---
  const { recordGqlFields: opportunitiesGqlFields } =
    useGenerateDepthRecordGqlFieldsFromObject({
      objectNameSingular: CoreObjectNameSingular.Opportunity,
      depth: 1,
    });

  const { records: opportunities, loading: opportunitiesLoading } =
    useFindManyRecords<OpportunityRecord>({
      objectNameSingular: CoreObjectNameSingular.Opportunity,
      filter: {
        companyId: { eq: companyId },
      },
      recordGqlFields: opportunitiesGqlFields,
    });

  // --- Tasks (via TaskTarget junction table) ---
  const { recordGqlFields: taskTargetGqlFields } =
    useGenerateDepthRecordGqlFieldsFromObject({
      objectNameSingular: CoreObjectNameSingular.TaskTarget,
      depth: 1,
    });

  const { records: taskTargets, loading: tasksLoading } =
    useFindManyRecords<TaskTargetRecord>({
      objectNameSingular: CoreObjectNameSingular.TaskTarget,
      filter: {
        targetCompanyId: { eq: companyId },
      },
      recordGqlFields: taskTargetGqlFields,
    });

  // Extract unique tasks from taskTargets
  const tasks = useMemo(() => {
    const seen = new Set<string>();
    const result: TaskRecord[] = [];
    for (const tt of taskTargets) {
      if (tt.task && tt.taskId && !seen.has(tt.taskId)) {
        seen.add(tt.taskId);
        result.push(tt.task);
      }
    }
    return result;
  }, [taskTargets]);

  // --- Timeline Activities (for KPIs) ---
  const { recordGqlFields: timelineGqlFields } =
    useGenerateDepthRecordGqlFieldsFromObject({
      objectNameSingular: CoreObjectNameSingular.TimelineActivity,
      depth: 1,
    });

  const { records: timelineActivities, loading: timelineLoading } =
    useFindManyRecords<TimelineActivityRecord>({
      objectNameSingular: CoreObjectNameSingular.TimelineActivity,
      filter: {
        targetCompanyId: { eq: companyId },
      },
      orderBy: [{ createdAt: 'DescNullsFirst' }],
      recordGqlFields: timelineGqlFields,
    });

  return {
    data: companyRecord ?? null,
    loading:
      companyLoading ||
      peopleLoading ||
      opportunitiesLoading ||
      tasksLoading ||
      timelineLoading,
    people: people ?? [],
    opportunities: opportunities ?? [],
    tasks,
    timelineActivities: timelineActivities.map((a) => ({
      id: a.id,
      name: a.name,
      happensAt: new Date(a.happensAt),
      linkedRecordCachedName: a.linkedRecordCachedName,
      createdAt: new Date(a.createdAt),
    })),
  };
};
