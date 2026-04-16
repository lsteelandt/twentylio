import { useParams } from 'react-router-dom';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { styled } from '@linaria/react';

import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { RecordShowPageHeader } from '~/pages/object-record/RecordShowPageHeader';
import { RecordShowPageTitle } from '~/pages/object-record/RecordShowPageTitle';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconSparkles } from 'twenty-ui/display';

import { useEnrichCompany360 } from './hooks/useEnrichCompany360';
import { useAccount360Data } from './hooks/useAccount360Data';
import { getScreenSize, type ScreenSize } from './utils/responsiveLayout';
import { ContextSection } from './components/ContextSection';
import { KPIsSection } from './components/KPIsSection';
import { Account360FilteredTable } from './components/Account360FilteredTable';
import { Account360MobileLayout } from './components/Account360MobileLayout';
import { MobileActions } from './components/MobileActions';
import { Account360ViewButton } from './components/Account360ViewButton';

// Simple error boundary to isolate section crashes
class SectionErrorBoundary extends Component<{
  name: string;
  children: ReactNode;
}> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, color: 'red', fontSize: 13, background: '#fff0f0', borderRadius: 8, marginBottom: 16 }}>
          <strong>Erreur [{this.props.name}] :</strong> {this.state.error.message}
          <pre style={{ marginTop: 8, fontSize: 11, whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const StyledSectionTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
  padding: ${themeCssVariables.spacing[3]} 0 ${themeCssVariables.spacing[2]} 0;
`;

const StyledSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  padding-top: ${themeCssVariables.spacing[3]};
  max-height: 360px;
  overflow: hidden;
`;

const StyledEnrichButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.accent.primary};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: all 0.2s;

  &:hover {
    background: ${themeCssVariables.accent.secondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledFeedbackSuccess = styled.span`
  color: ${themeCssVariables.color.green};
  font-size: ${themeCssVariables.font.size.sm};
  margin-left: ${themeCssVariables.spacing[2]};
`;

const StyledFeedbackError = styled.span`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin-left: ${themeCssVariables.spacing[2]};
`;

export const Account360View = () => {
  const parameters = useParams<{
    objectRecordId: string;
  }>();

  const objectNameSingular = 'company';
  const objectRecordId = parameters.objectRecordId ?? '';
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');

  const { enrichCompany360, loading, success, error } = useEnrichCompany360();
  const { data: account360Data, timelineActivities } =
    useAccount360Data(objectRecordId);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [objectRecordId]);

  const handleEnrichCompany = async () => {
    try {
      await enrichCompany360();
    } catch (err) {
      console.error('Failed to enrich company:', err);
    }
  };

  const contextSection = (
    <ContextSection
      companyData={
        account360Data
          ? {
              name: account360Data.name ?? undefined,
              domainName:
                account360Data.domainName?.primaryLinkUrl ?? undefined,
              employees: account360Data.employees,
              annualRecurringRevenue: account360Data.annualRecurringRevenue
                ?.amountMicros
                ? account360Data.annualRecurringRevenue.amountMicros / 1_000_000
                : null,
              linkedinUrl:
                account360Data.linkedinLink?.primaryLinkUrl ?? undefined,
              city: account360Data.address?.addressCity ?? undefined,
              state: account360Data.address?.addressState ?? undefined,
              country: account360Data.address?.addressCountry ?? undefined,
            }
          : undefined
      }
    />
  );

  const kpisSection = (
    <KPIsSection
      kpiData={
        account360Data
          ? {
              activityCount: timelineActivities.length,
              suspectScore: null,
              lastActivityDate:
                timelineActivities.length > 0
                  ? timelineActivities.reduce(
                      (latest, a) =>
                        a.happensAt > latest ? a.happensAt : latest,
                      timelineActivities[0].happensAt,
                    )
                  : null,
            }
          : undefined
      }
    />
  );

  // Embedded table sections using Twenty's native RecordTableWidget
  const tableSections = (
    <>
      <SectionErrorBoundary name="Contacts">
        <StyledSectionContainer>
          <StyledSectionTitle>Contacts</StyledSectionTitle>
          <Account360FilteredTable
            objectNameSingular="person"
            companyId={objectRecordId}
            filterFieldName="companyId"
          />
        </StyledSectionContainer>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Opportunités">
        <StyledSectionContainer>
          <StyledSectionTitle>Opportunités</StyledSectionTitle>
          <Account360FilteredTable
            objectNameSingular="opportunity"
            companyId={objectRecordId}
            filterFieldName="companyId"
          />
        </StyledSectionContainer>
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Tâches">
        <StyledSectionContainer>
          <StyledSectionTitle>Tâches</StyledSectionTitle>
          <Account360FilteredTable
            objectNameSingular="task"
            companyId={objectRecordId}
            // Task has no direct companyId field — shows all tasks for now
            // TODO: implement company-scoped task filtering via TaskTarget
          />
        </StyledSectionContainer>
      </SectionErrorBoundary>
    </>
  );

  const isMobile = screenSize === 'mobile';

  if (isMobile) {
    return (
      <RecordComponentInstanceContextsWrapper
        componentInstanceId={objectRecordId}
      >
        <ContextStoreComponentInstanceContext.Provider
          value={{ instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID }}
        >
          <PageContainer>
            <RecordShowPageTitle
              objectNameSingular={objectNameSingular}
              objectRecordId={objectRecordId}
            />
            <MobileActions
              onEdit={() => {
                // TODO: Open company edit panel
              }}
              onMenu={() => {
                // TODO: Open context menu
              }}
            >
              <Account360MobileLayout
                contextSection={contextSection}
                relationsSection={tableSections}
              />
            </MobileActions>
          </PageContainer>
        </ContextStoreComponentInstanceContext.Provider>
      </RecordComponentInstanceContextsWrapper>
    );
  }

  return (
    <RecordComponentInstanceContextsWrapper
      componentInstanceId={objectRecordId}
    >
      <ContextStoreComponentInstanceContext.Provider
        value={{ instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID }}
      >
        <PageContainer>
          <RecordShowPageTitle
            objectNameSingular={objectNameSingular}
            objectRecordId={objectRecordId}
          />
          <RecordShowPageHeader
            objectNameSingular={objectNameSingular}
            objectRecordId={objectRecordId}
          >
            <StyledEnrichButton
              onClick={handleEnrichCompany}
              disabled={loading}
            >
              <IconSparkles />
              {loading ? 'Enrichissement...' : 'Enrichir avec IA'}
            </StyledEnrichButton>
            <Account360ViewButton objectRecordId={objectRecordId} />
            {success && (
              <StyledFeedbackSuccess>
                Enrichissement réussi
              </StyledFeedbackSuccess>
            )}
            {error && (
              <StyledFeedbackError>
                Échec : {error ?? 'Erreur inconnue'}
              </StyledFeedbackError>
            )}
          </RecordShowPageHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {contextSection}
            {kpisSection}
            {tableSections}
          </div>
        </PageContainer>
      </ContextStoreComponentInstanceContext.Provider>
    </RecordComponentInstanceContextsWrapper>
  );
};
