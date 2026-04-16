import { emitSidePanelOpenEvent } from '@/ui/layout/side-panel/utils/emitSidePanelOpenEvent';

export type SidePanelTargetObject = {
  id: string;
  objectNameSingular: string;
};

/**
 * Hook to open the side panel for editing a Company record
 * from the Account 360 view
 */
export const useOpenCompanySidePanel = () => {
  const openSidePanel = (company: SidePanelTargetObject) => {
    // Store the target object in sessionStorage for the side panel to pick up
    sessionStorage.setItem('sidePanelTargetObject', JSON.stringify(company));

    // Emit the custom event to open the side panel
    emitSidePanelOpenEvent();
  };

  return {
    openSidePanel,
  };
};
