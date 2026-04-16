import { useState } from 'react';

type EnrichCompany360Result = {
  success: boolean;
  suspectScore?: number | null;
  notes?: string | null;
  error?: string | null;
};

export const useEnrichCompany360 = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate enrichCompany360 API call
  const enrichCompany360 = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // TODO: Call actual enrichCompany360 mutation when available
      // For now, simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(() => resolve({
        success: true,
        suspectScore: 42, // Mock suspect score
        notes: 'Enrichissement simulé via API N8n',
      }), 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enrichissement');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    success,
    error,
    enrichCompany360,
    suspectScore: null,
    notes: null,
  };
};
