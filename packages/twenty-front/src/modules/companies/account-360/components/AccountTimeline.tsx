import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { EventList } from '@/activities/timeline-activities/components/EventList';

const StyledTimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.transparent.light};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const StyledTimelineHeader = styled.h3`
  margin: 0;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledTimelineContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const StyledEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledLoadMore = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${themeCssVariables.spacing[2]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${themeCssVariables.background.transparent.light};
    border-color: ${themeCssVariables.accent.primary};
  }
`;

type ActivityData = {
  id: string;
  type: string;
  body?: string | null;
  title?: string | null;
  createdAt: Date;
  author?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
};

type AccountTimelineProps = {
  activities?: ActivityData[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onActivityClick?: (activityId: string, activityType: string) => void;
};

export const AccountTimeline = ({
  activities,
  loading,
  hasMore,
  onLoadMore,
  onActivityClick,
}: AccountTimelineProps) => {
  if (loading) {
    return (
      <StyledTimelineContainer>
        <StyledTimelineHeader>Timeline</StyledTimelineHeader>
        <StyledEmptyState>Loading activities...</StyledEmptyState>
      </StyledTimelineContainer>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <StyledTimelineContainer>
        <StyledTimelineHeader>Timeline</StyledTimelineHeader>
        <StyledEmptyState>No activity found</StyledEmptyState>
      </StyledTimelineContainer>
    );
  }

  return (
    <StyledTimelineContainer>
      <StyledTimelineHeader>Timeline</StyledTimelineHeader>
      <StyledTimelineContent>
        {/* For now, we'll use a simple list layout.
           In a full implementation, we would integrate with the existing
           timeline component from Twenty */}
        {activities.map((activity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
            onClick={() => onActivityClick?.(activity.id, activity.type)}
          />
        ))}
        {hasMore && onLoadMore && (
          <StyledLoadMore onClick={onLoadMore}>
            Load more activities
          </StyledLoadMore>
        )}
      </StyledTimelineContent>
    </StyledTimelineContainer>
  );
};

// Simple timeline item component (to be replaced with Twenty's timeline component)
const ActivityListItem = ({
  activity,
  onClick,
}: {
  activity: ActivityData;
  onClick?: () => void;
}) => {
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'note':
        return '📝';
      case 'task':
        return '✅';
      case 'opportunity':
        return '💰';
      case 'email':
        return '📧';
      case 'call':
        return '📞';
      default:
        return '📌';
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: '24px' }}>
        {getActivityIcon(activity.type)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>
          {activity.title || activity.type}
        </div>
        {activity.body && (
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {activity.body}
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {formatTime(new Date(activity.createdAt))}
          {activity.author && (
            <>
              {' • '}
              {activity.author.firstName} {activity.author.lastName}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
