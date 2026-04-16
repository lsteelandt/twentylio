import { useEffect, useState } from 'react';
import { RelationTabType } from '../components/RelationTabs';

const STORAGE_KEY_PREFIX = 'account-360-active-tab';

export const useRelationTabState = (companyId: string) => {
  const [activeTab, setActiveTab] = useState<RelationTabType>('people');

  // Load saved tab from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${companyId}`);
    if (saved && ['people', 'opportunities', 'activities'].includes(saved)) {
      setActiveTab(saved as RelationTabType);
    }
  }, [companyId]);

  // Save tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-${companyId}`, activeTab);
  }, [companyId, activeTab]);

  const handleTabChange = (tab: RelationTabType) => {
    setActiveTab(tab);
  };

  // Return mock data for tabs
  const mockTabData = {
    people: [] as any[],
    opportunities: [] as any[],
    activities: [] as any[],
  };

  return {
    activeTab,
    onTabChange: handleTabChange,
    ...mockTabData,
  };
};
