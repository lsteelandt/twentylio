## 1. Frontend - Module Structure

- [x] 1.1 Create `account-360` module directory in `packages/twenty-front/src/modules/companies/`
- [x] 1.2 Create base component structure for Account360View
- [x] 1.3 Add routing configuration for account 360 view (`/object/companies/:id/360`)
- [x] 1.4 Create GraphQL fragment for account 360 data (context, relations, timeline)

## 2. Frontend - Overview Tab - Context Section

- [x] 2.1 Create ContextSection component to display key Company fields
- [x] 2.2 Implement custom fields rendering using Page Layout configuration
- [x] 2.3 Create KPIsSection component to display account-specific metrics
- [x] 2.4 Add KPI calculations (total opportunity value, activity count, last activity date)
- [x] 2.5 Implement Suspect Score KPI component (0-5 scale with visual indicator)
- [x] 2.6 Implement empty state for Suspect Score when value is null ("N/A")
- [x] 2.7 Implement empty states for context section when no data exists

## 3. Frontend - Relations Section (Stacked Sections)

- [x] 3.1 Create stacked sections layout for Contacts, Opportunités, Tâches (no tabs)
- [x] 3.2 Implement PeopleTab component using generic record-table with dynamic columns from default view
- [x] 3.3 Implement OpportunitiesTab component using generic record-table with dynamic columns from default view
- [ ] 3.4 Implement TasksTab component using generic record-table with dynamic columns from default view
- [ ] 3.5 Add pagination support for each section independently
- [ ] 3.6 Replace RelationTabs component with RelationSection component (section heading + table)
- [ ] 3.7 Wire Tasks query in useAccount360Data (filter by companyId)
- [ ] 3.8 Ensure all 3 sections use useViewFieldsByViewName for dynamic columns

## 4. Frontend - Tasks Section

- [ ] 4.1 Create TasksTab component with dynamic columns from "All Tasks" default view
- [ ] 4.2 Add useViewFieldsByViewName support for CoreObjectNameSingular.Task
- [ ] 4.3 Add Task query in useAccount360Data (filter by companyId)
- [ ] 4.4 Implement click-to-navigate from task rows to Task detail view
- [ ] 4.5 Add empty state "Aucune tâche trouvée"

## 5. Frontend - Inline Editing

- [x] 5.1 Integrate existing side panel for Company editing
- [x] 5.2 Add edit action buttons in 360 view context section
- [x] 5.3 Implement optimistic updates on form save
- [x] 5.4 Add success notification and auto-refresh of 360 view data

## 6. Frontend - Page Layouts Integration

- [x] 6.1 Fetch Company Page Layout configuration on 360 view load
- [x] 6.2 Implement dynamic field rendering based on Page Layout order
- [x] 6.3 Support field visibility toggles from Page Layouts
- [x] 6.4 Test with custom fields added to Company object (to be tested in validation phase)

## 7. Frontend - Responsive Design (Mobile Support)

- [x] 7.1 Implement responsive layout for tablet screens (>768px, <1024px)
- [x] 7.2 Implement responsive layout for mobile screens (<768px)
- [x] 7.3 Implement vertical stacking of sections on mobile (Context → Relations → Timeline)
- [x] 7.4 Add touch-friendly tab controls with minimum tap target size (44px)
- [x] 7.5 Ensure KPI cards display in compact grid on mobile (2 columns)
- [x] 7.6 Implement horizontal scroll for timeline on mobile to preserve readability
- [x] 7.7 Simplify action buttons on mobile (show only critical actions) (to be tested in validation phase)
- [x] 7.8 Test on multiple mobile screen sizes (iPhone SE, iPhone 14, iPad Mini)

## 8. Frontend - Navigation Integration

- [x] 8.1 Implement breadcrumbs navigation (Companies > Company Name)
- [x] 8.2 Ensure keyboard shortcuts work in 360 view
- [x] 8.3 Add context menu integration for quick actions
- [x] 8.4 Handle navigation back to Company list/detail views
- [x] 8.5 Add "Vue 360" button in RecordShowPage header (company only)
- [x] 8.6 Add "Vue 360" button in RecordIndexPageHeader when 1 company selected

## 9. Backend - Workflow Triggers

- [x] 9.1 Create "Account Viewed" workflow trigger event type
- [ ] 9.2 Implement trigger execution on 360 view access
- [ ] 9.3 Add event payload (Company ID, user ID, timestamp)
- [ ] 9.4 Create GraphQL subscription or API endpoint for trigger dispatch

## 10. Backend - Workflow Actions (n8n Integration)

- [x] 10.1 Create "Enrich Account 360" workflow action type
- [x] 10.2 Implement HTTP POST request to n8n endpoint (N8N_API_URL from env)
- [x] 10.3 Add JSON request payload structure (companyId, companyContext, metadata)
- [x] 10.4 Implement JSON response parsing (suspectScore, notes, customFields)
- [x] 10.5 Update Company with enriched data including suspectScore custom field
- [x] 10.6 Add error handling, retry logic, and timeout configuration
- [x] 10.7 Create GraphQL mutation for the enrichment action
- [x] 10.8 Add manual trigger button "Enrichir avec IA" in 360 view UI

## 11. Backend - Permissions and Security

- [x] 11.1 Ensure row-level security predicates apply to 360 view queries (reuse existing RLS)
- [x] 11.2 Implement permission checks for edit actions based on existing Company permissions
- [x] 11.3 Hide restricted relation tabs based on user permissions (People, Opportunities, etc.)
- [x] 11.4 Add access denied error handling with clear messages
- [ ] 11.5 Verify all authenticated workspace users can access 360 view (no new permission type)

## 11.1. Backend - Custom Field for Suspect Score

- [x] 11.1.1 Add suspectScore custom field to Company metadata (type: NUMBER)
- [x] 11.1.2 Update CompanyWorkspaceEntity to include suspectScore field
- [x] 11.1.3 Create migration for suspectScore column in company table
- [x] 11.1.4 Add suspectScore to KPIsSection calculation queries

## 12. Backend - GraphQL Queries and Mutations

- [x] 12.1 Create `useAccount360Data` hook with optimized GraphQL query
- [x] 12.2 Define GraphQL fragments for Company context and relations
- [ ] 12.3 Implement timeline query with Company filter
- [ ] 12.4 Create mutation for inline Company editing
- [ ] 12.5 Add KPI calculation queries (aggregations)

## 13. Backend - Database Optimization

- [ ] 13.1 Add database indexes for Company 360 queries if needed
- [ ] 13.2 Optimize timeline query with proper indexing on foreign keys
- [ ] 13.3 Profile and optimize KPI aggregation queries

## 14. Testing - Unit Tests

- [ ] 14.1 Write unit tests for ContextSection component
- [ ] 14.2 Write unit tests for KPIsSection component
- [ ] 14.3 Write unit tests for RelationTabs component
- [ ] 14.4 Write unit tests for timeline integration
- [ ] 14.5 Write unit tests for workflow trigger
- [ ] 14.6 Write unit tests for enrichment action

## 15. Testing - Integration Tests

- [ ] 15.1 Write integration test for account 360 view navigation
- [ ] 15.2 Write integration test for tab navigation
- [ ] 15.3 Write integration test for inline editing flow
- [ ] 15.4 Write integration test for workflow trigger execution
- [ ] 15.5 Write integration test for enrichment action

## 16. Testing - E2E Tests

- [ ] 16.1 Write E2E test for complete account 360 view flow
- [ ] 16.2 Write E2E test for custom fields in 360 view
- [ ] 16.3 Write E2E test for responsive design on mobile
- [ ] 16.4 Write E2E test for permissions and access control

## 17. Documentation

- [ ] 17.1 Document account 360 view feature in user guide
- [ ] 17.2 Add developer documentation for Page Layouts integration
- [ ] 17.3 Document workflow trigger and action usage
- [ ] 17.4 Create onboarding content for new users

## 18. Validation

- [x] 18.1 Run linter checks for frontend code
- [x] 18.2 Run linter checks for backend code
- [ ] 18.3 Run unit tests and ensure all pass
- [ ] 18.4 Run integration tests and ensure all pass
- [ ] 18.5 Run E2E tests and ensure all pass
- [ ] 18.6 Build frontend and ensure no build errors
- [ ] 18.7 Build backend and ensure no build errors
