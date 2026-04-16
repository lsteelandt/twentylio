import { useCallback } from 'react';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

/**
 * Hook to handle success notifications and refresh after Company updates
 * from the side panel
 */
export const useCompanyUpdateNotification = () => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const showSuccessNotification = useCallback(() => {
    enqueueSuccessSnackBar({
      message: 'Company information updated successfully',
    });
  }, [enqueueSuccessSnackBar]);

  // In a full implementation, this would also trigger a refresh of the
  // Account 360 view data by invalidating the Apollo cache
  const refreshAccount360Data = useCallback(() => {
    // TODO: Invalidate Apollo cache for Company data
    // This will be implemented when the full GraphQL integration is done
    console.log('Refreshing Account 360 data...');
  }, []);

  return {
    showSuccessNotification,
    refreshAccount360Data,
  };
};
