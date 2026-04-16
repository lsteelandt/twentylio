import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { UPDATE_COMPANY_MUTATION } from '../graphql/mutations/updateCompany';
import { type UpdateCompanyInput } from 'twenty-shared/generated';

export const useUpdateCompany = () => {
  const [updateCompany, { loading, error }] = useMutation(UPDATE_COMPANY_MUTATION);

  const updateCompanyRecord = useCallback(
    async (input: UpdateCompanyInput) => {
      try {
        const result = await updateCompany({ variables: { input } });
        return result.data.updateCompany;
      } catch (err) {
        console.error('Failed to update company:', err);
        throw err;
      }
    },
    [updateCompany],
  );

  return { updateCompanyRecord, loading, error };
};