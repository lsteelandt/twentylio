import { Account360ViewButton } from '@/companies/account-360/components/Account360ViewButton';

type RecordIndexPageHeaderAccount360ButtonProps = {
  objectRecordId: string;
};

/**
 * Thin wrapper around Account360ViewButton placed here to avoid importing
 * UI-heavy dependencies (Button, @react-spring/web) directly into
 * RecordIndexPageHeader.tsx, which is evaluated by wyw-in-js at build time.
 */
export const RecordIndexPageHeaderAccount360Button = ({
  objectRecordId,
}: RecordIndexPageHeaderAccount360ButtonProps) => {
  return <Account360ViewButton objectRecordId={objectRecordId} />;
};
