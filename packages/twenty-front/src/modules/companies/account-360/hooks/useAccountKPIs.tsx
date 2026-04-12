import { useMemo } from 'react';

type CompanyActivity = {
  id: string;
  createdAt: Date;
  type: string;
};

type CompanyOpportunity = {
  id: string;
  amount?: number | null;
  amountInCents?: number | null;
};

type CompanyData = {
  activities?: CompanyActivity[];
  opportunities?: CompanyOpportunity[];
  suspectScore?: number | null;
};

export const useAccountKPIs = (companyData?: CompanyData) => {
  return useMemo(() => {
    if (!companyData) {
      return undefined;
    }

    const { activities, opportunities, suspectScore } = companyData;

    // Calculate activity count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = activities?.filter(
      (activity) => new Date(activity.createdAt) >= thirtyDaysAgo,
    );

    const activityCount = recentActivities?.length ?? 0;

    // Calculate total opportunity value
    const totalOpportunityValue =
      opportunities?.reduce((sum, opp) => {
        const amount = opp.amount ?? opp.amountInCents ?? 0;
        return sum + amount;
      }, 0) ?? 0;

    // Find last activity date
    const lastActivityDate = activities?.length
      ? activities.reduce((latest, activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate > latest ? activityDate : latest;
        }, new Date(activities[0].createdAt))
      : null;

    return {
      activityCount,
      totalOpportunityValue,
      lastActivityDate,
      suspectScore,
    };
  }, [companyData]);
};
