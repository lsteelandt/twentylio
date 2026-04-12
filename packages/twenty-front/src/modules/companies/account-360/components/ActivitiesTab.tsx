import { useMemo } from 'react';
import { IconCalendar, IconMail, IconPhone, IconCheck, IconNotes } from 'twenty-ui/display';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { AppPath } from 'twenty-shared/types';

import {
  RelationTable,
  type ColumnDefinition,
} from './RelationTable';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type ActivityData = {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note';
  title?: string | null;
  date: Date;
  linkedRecordId?: string | null;
  linkedObjectName?: string | null;
  linkedObjectSingular?: string | null;
};

type ActivitiesTabProps = {
  activities?: ActivityData[];
};

const ACTIVITY_ICONS: Record<ActivityData['type'], React.ReactNode> = {
  email: <IconMail size="xs" />,
  call: <IconPhone size="xs" />,
  meeting: <IconCalendar size="xs" />,
  task: <IconCheck size="xs" />,
  note: <IconNotes size="xs" />,
};

const ACTIVITY_LABELS: Record<ActivityData['type'], string> = {
  email: 'Email',
  call: 'Appel',
  meeting: 'Réunion',
  task: 'Tâche',
  note: 'Note',
};

export const ActivitiesTab = ({ activities }: ActivitiesTabProps) => {
  const navigate = useNavigateApp();

  const getActivityTypeStyle = (type: ActivityData['type']) => {
    switch (type) {
      case 'email':
        return {
          backgroundColor: themeCssVariables.accent.quaternary,
          color: themeCssVariables.font.color.secondary,
        };
      case 'call':
        return {
          backgroundColor: themeCssVariables.background.transparent.primary,
          color: themeCssVariables.font.color.primary,
        };
      case 'meeting':
        return {
          backgroundColor: themeCssVariables.background.transparent.light,
          color: themeCssVariables.font.color.secondary,
        };
      case 'task':
        return {
          backgroundColor: themeCssVariables.background.transparent.success,
          color: themeCssVariables.font.color.primary,
        };
      case 'note':
        return {
          backgroundColor: themeCssVariables.accent.quaternary,
          color: themeCssVariables.font.color.secondary,
        };
      default:
        return {
          backgroundColor: themeCssVariables.accent.quaternary,
          color: themeCssVariables.font.color.secondary,
        };
    }
  };

  const formatActivityDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays === 1) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    }

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: ColumnDefinition<ActivityData>[] = useMemo(
    () => [
      {
        id: 'type',
        label: 'Type',
        width: '100px',
        renderCell: (activity) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ...getActivityTypeStyle(activity.type),
              padding: '4px 8px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {ACTIVITY_ICONS[activity.type]}
            {ACTIVITY_LABELS[activity.type]}
          </div>
        ),
      },
      {
        id: 'title',
        label: 'Sujet / Titre',
        renderCell: (activity) => activity.title ?? '-',
      },
      {
        id: 'date',
        label: 'Date',
        width: '180px',
        renderCell: (activity) => formatActivityDate(activity.date),
      },
      {
        id: 'linkedObject',
        label: 'Lié à',
        width: '150px',
        renderCell: (activity) => activity.linkedObjectName ?? '-',
      },
    ],
    [],
  );

  const handleRowClick = (activity: ActivityData) => {
    if (activity.linkedObjectSingular && activity.linkedRecordId) {
      navigate(AppPath.RecordShowPage, {
        objectNameSingular: activity.linkedObjectSingular,
        objectRecordId: activity.linkedRecordId,
      });
    }
  };

  return (
    <RelationTable<ActivityData>
      data={activities ?? []}
      columns={columns}
      onRowClick={handleRowClick}
      emptyMessage="Aucune activité trouvée"
    />
  );
};
