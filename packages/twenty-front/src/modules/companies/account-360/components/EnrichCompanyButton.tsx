import { IconLoader, IconSparkles } from 'twenty-ui/display';

export const EnrichCompanyButton = ({
  onClick,
  isEnriching,
  lastEnrichmentDate,
  lastEnrichmentStatus,
}: {
  onClick?: () => void;
  isEnriching?: boolean;
  lastEnrichmentDate?: Date | null;
  lastEnrichmentStatus?: 'success' | 'failed' | null;
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={isEnriching}
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
      >
        {isEnriching ? (
          <>
            <IconLoader className="animate-spin" />
            Enrichissement en cours...
          </>
        ) : (
          <>
            <IconSparkles />
            Enrichir avec l'IA
            {lastEnrichmentDate && (
              <span className="ml-2 text-sm opacity-80">
                ({lastEnrichmentDate.toLocaleDateString()})
              </span>
            )}
            {lastEnrichmentStatus === 'success' && (
              <span className="ml-2 text-sm text-green-200">(✔)</span>
            )}
            {lastEnrichmentStatus === 'failed' && (
              <span className="ml-2 text-sm text-red-200">(✖)</span>
            )}
          </>
        )}
      </button>
    </div>
  );
};
