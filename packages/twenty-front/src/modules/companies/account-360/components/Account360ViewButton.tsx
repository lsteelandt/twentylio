import { useNavigateApp } from '~/hooks/useNavigateApp';
import { t } from '@lingui/core/macro';
import { IconEye } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { AppPath } from 'twenty-shared/types';

type Account360ViewButtonProps = {
  objectRecordId: string;
};

export const Account360ViewButton = ({
  objectRecordId,
}: Account360ViewButtonProps) => {
  const navigate = useNavigateApp();

  const handleClick = () => {
    navigate(AppPath.Account360View, {
      objectNameSingular: 'company',
      objectRecordId,
    });
  };

  return (
    <Button
      Icon={IconEye}
      size="small"
      variant="secondary"
      accent="default"
      title={t`Vue 360`}
      ariaLabel={t`Open 360 view`}
      onClick={handleClick}
    />
  );
};
