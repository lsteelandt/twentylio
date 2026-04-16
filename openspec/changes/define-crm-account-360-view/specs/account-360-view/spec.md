## ADDED Requirements

### Requirement: System shall provide a 360-degree view for CRM accounts

The system SHALL provide a consolidated 360-degree view for Company objects that displays contextual information, related records, activity timeline, and key performance indicators in a single interface.

#### Scenario: User navigates to account 360 view
- **WHEN** a user accesses 360 view for a Company
- **THEN** system displays account overview with context information, relations, and activity timeline
- **THEN** view uses existing Twenty UI patterns and design language
- **THEN** view is accessible from Company record list or detail view

#### Scenario: System loads account 360 data efficiently
- **WHEN** a user opens account 360 view
- **THEN** system loads data using GraphQL queries with optimized fragments
- **THEN** system displays key context information immediately
- **THEN** related data loads progressively using lazy loading where appropriate

### Requirement: Account 360 view shall display contextual information

The system SHALL display contextual information about Company including key fields, custom fields configured in Page Layouts, and summary statistics.

#### Scenario: Context information displays correctly
- **WHEN** a user views account 360 overview tab
- **THEN** system displays key Company fields (name, domain name, employees, annual recurring revenue, address)
- **THEN** system displays all custom fields configured in Company Page Layout in defined order
- **THEN** system shows ideal customer profile indicator if configured

#### Scenario: Context information shows empty state when no data
- **WHEN** a Company has no contextual information configured
- **THEN** system displays an empty state with guidance on how to add information
- **THEN** empty state provides a call-to-action to edit Company record

### Requirement: Account 360 view shall display related records in stacked sections

The system SHALL display related records (Contacts, Opportunities, Tasks) as vertically stacked sections on the same page, without tabs, allowing the user to scroll to see all records.

Each section SHALL display a heading with the object label and record count, followed by a table matching the default view columns of the corresponding object, as defined in the view named "All {objectLabelPlural}".

The three sections SHALL appear in this order:
1. **Contacts** (Person) — columns from default view of Person
2. **Opportunités** (Opportunity) — columns from default view of Opportunity
3. **Tâches** (Task) — columns from default view of Task

#### Scenario: Related records display in stacked sections
- **WHEN** a user views the account 360 page
- **THEN** system displays all three sections vertically: Contacts, Opportunités, Tâches
- **THEN** each section shows a heading with the object label and record count (e.g., "Contacts (5)")
- **THEN** each section displays a table with the same columns as the default view of that object
- **THEN** the user can scroll the page to see sections below the viewport

#### Scenario: Section columns match default view columns
- **WHEN** the system renders a relation section (Contacts, Opportunités, or Tâches)
- **THEN** columns are fetched from the view named "All {objectLabelPlural}" for the corresponding object
- **THEN** only columns where isVisible=true and isActive=true are displayed
- **THEN** columns are ordered by their position in the view definition
- **THEN** column labels match the field metadata labels

#### Scenario: Related records support pagination
- **WHEN** related records exceed the page limit for a section
- **THEN** system displays pagination controls within that section
- **THEN** system loads additional records when user requests next page
- **THEN** other sections remain visible and unaffected during pagination

### Requirement: Account 360 view shall display Tasks section

The system SHALL display a Tasks section showing all Task objects related to the Company, using the same table columns as the default Task view.

#### Scenario: Tasks section displays correctly
- **WHEN** a user views the account 360 page
- **THEN** the Tasks section appears after the Opportunities section
- **THEN** the section displays a heading "Tâches" with the task count
- **THEN** task records are displayed in a table with columns from the default Task view ("All Tasks")
- **THEN** columns match the SQL query: SELECT fm.name, fm.type, vf.position FROM core."viewField" vf JOIN core."fieldMetadata" fm ON vf."fieldMetadataId" = fm.id JOIN core."view" v ON vf."viewId" = v.id JOIN core."objectMetadata" om ON v."objectMetadataId" = om.id WHERE om."nameSingular" = 'task' AND v.name = 'All {objectLabelPlural}' AND vf."isVisible" = true AND vf."isActive" = true ORDER BY vf.position ASC
- **THEN** clicking a task row navigates to the Task detail view

#### Scenario: Tasks section shows empty state
- **WHEN** no tasks exist for the Company
- **THEN** the section displays "Aucune tâche trouvée"

### Requirement: Account 360 view shall display account-specific KPIs

The system SHALL display key performance indicators specific to account including activity count, suspect score, and last activity date.

#### Scenario: KPIs display with current values
- **WHEN** a user views the account 360 overview tab
- **THEN** the system displays KPI card showing activity count (total activities in defined period)
- **THEN** the system displays Suspect Score (0-5 scale) with visual indicator
- **THEN** the system displays last activity date with relative time (e.g., "2 days ago")
- **THEN** the Suspect Score shows "N/A" when value is null

#### Scenario: KPIs handle edge cases
- **WHEN** no activity data exists for the account
- **THEN** the system displays zero for activity count
- **WHEN** the Suspect Score is not calculated (value is null)
- **THEN** the system displays "N/A" for Suspect Score with tooltip explaining it requires AI enrichment

### Requirement: Account 360 view shall support inline editing

The system SHALL allow users to edit Company information directly from 360 view using an extended side panel.

#### Scenario: User edits company from 360 view
- **WHEN** a user clicks on an edit action in 360 view
- **THEN** system opens a side panel with Company form
- **THEN** side panel includes all standard fields and custom fields
- **THEN** saving the form updates the Company record and refreshes the 360 view

#### Scenario: Changes reflect in real-time
- **WHEN** a user saves changes to the Company from 360 view side panel
- **THEN** system updates the 360 view context information immediately
- **THEN** system updates KPIs that depend on modified fields
- **THEN** system closes the side panel and shows a success notification

### Requirement: Account 360 view shall be configurable via Page Layouts

The system SHALL allow workspace administrators to configure account 360 view layout including which fields display, their order, and which tabs are available.

#### Scenario: Admin configures 360 view layout
- **WHEN** a workspace administrator configures Company Page Layout
- **THEN** system allows selection of fields to display in 360 view context section
- **THEN** system allows ordering of fields in 360 view
- **THEN** system applies the layout changes to all users in the workspace

#### Scenario: Custom fields appear in 360 view
- **WHEN** a custom field is added to the Company object
- **THEN** system makes the custom field available for inclusion in Page Layouts
- **THEN** custom field displays in 360 view when included in Page Layout
- **THEN** custom field uses the appropriate field editor component based on its type

### Requirement: System shall provide workflow trigger for account 360 view access

The system SHALL trigger a workflow event when a user accesses account 360 view for a Company.

#### Scenario: Workflow triggers on account 360 view access
- **WHEN** a user navigates to 360 view for a Company
- **THEN** system triggers an "Account Viewed" workflow event
- **THEN** event includes the Company ID, viewing user ID, and timestamp
- **THEN** workflows listening to this event can execute actions based on the event data

#### Scenario: Workflow actions execute after 360 view access
- **WHEN** an "Account Viewed" event triggers a configured workflow
- **THEN** system executes the workflow actions
- **THEN** actions can include notifications, data enrichment, or external API calls
- **THEN** the workflow execution does not block the 360 view from loading

### Requirement: System shall provide workflow action for account 360 data enrichment (n8n JSON integration)

The system SHALL provide a workflow action that allows external enrichment of account 360 data via JSON HTTP requests to n8n endpoints.

#### Scenario: Workflow enriches account 360 data via n8n
- **WHEN** a workflow executes the "Enrich Account 360" action
- **THEN** system sends a JSON POST request to the configured n8n endpoint (using N8N_API_URL and N8N_API_KEY)
- **THEN** the request JSON includes companyId, companyContext (name, domain, employees, suspectScore), and metadata
- **THEN** the system processes the JSON enrichment response (suspectScore, notes, customFields) and updates the Company
- **THEN** the system updates the 360 view to reflect enriched data

#### Scenario: Enrichment handles errors gracefully
- **WHEN** the n8n endpoint is unavailable or returns an error
- **THEN** the system logs the error and does not corrupt existing Company data
- **THEN** the system displays an error notification to the user if enrichment was user-initiated
- **THEN** the system allows retry of the enrichment action

#### Scenario: Manual AI enrichment trigger available
- **WHEN** a user clicks the "Enrichir avec IA" button in the 360 view
- **THEN** the system triggers the "Enrich Account 360" workflow action
- **THEN** the system shows a loading state during enrichment
- **THEN** the system updates the Suspect Score KPI with the enriched value

### Requirement: All authenticated users can access account 360 view

The system SHALL allow all authenticated users in the workspace to access the 360 view for any Company they have permission to view.

#### Scenario: User can access 360 view with standard Company permissions
- **WHEN** a user with read access to Companies navigates to 360 view
- **THEN** the system displays the 360 view with context information
- **THEN** the system hides edit actions if the user lacks update permissions
- **THEN** the system respects all existing Company permissions

#### Scenario: No new permission type required
- **WHEN** a workspace administrator configures the 360 view feature
- **THEN** the system does not require a new "account-360-view" permission type
- **THEN** the system reuses existing Company view permissions
- **THEN** row-level security predicates continue to apply

### Requirement: Account 360 view shall integrate with existing Twenty navigation

The system SHALL integrate account 360 view with existing Twenty navigation patterns including breadcrumbs, keyboard shortcuts, and context menus.

#### Scenario: Navigation breadcrumbs work with 360 view
- **WHEN** a user navigates to the account 360 view
- **THEN** the system displays breadcrumbs showing navigation path (Companies > Company Name)
- **THEN** clicking breadcrumbs navigates back to the previous level
- **THEN** breadcrumbs update when navigating to related records from the 360 view

#### Scenario: Keyboard shortcuts work in 360 view
- **WHEN** a user uses standard Twenty keyboard shortcuts
- **THEN** the system responds appropriately (e.g., "C" to command menu, "/" to search)
- **THEN** keyboard navigation within tabs and lists functions correctly

### Requirement: Account 360 view shall support responsive design (mobile)

The system SHALL adapt account 360 view layout for different screen sizes while maintaining all core functionality, including mobile screens (< 768px).

#### Scenario: View adapts to tablet screens
- **WHEN** a user accesses the 360 view on a tablet-sized screen (> 768px, < 1024px)
- **THEN** the system stacks sections vertically
- **THEN** tabs remain accessible with touch-friendly controls
- **THEN** KPI cards scale appropriately

#### Scenario: View adapts to mobile screens
- **WHEN** a user accesses the 360 view on a mobile-sized screen (< 768px)
- **THEN** the system displays essential context information first
- **THEN** the system vertically stacks sections (Context > Relations > Timeline)
- **THEN** related records are accessible via scrollable sections or expanded details
- **THEN** timeline implements horizontal scroll to preserve readability
- **THEN** the system displays KPIs in a compact 2-column grid

#### Scenario: Touch-friendly controls on mobile
- **WHEN** a user interacts with the 360 view on a mobile device
- **THEN** the tab controls have a minimum tap target size (44px)
- **THEN** action buttons are simplified (only critical actions shown on mobile)
- **THEN** the navigation works smoothly without hover states

### Requirement: System shall enforce access control for account 360 view

The system SHALL enforce existing Twenty permissions and row-level security when displaying account 360 data.

#### Scenario: User with limited permissions sees restricted data
- **WHEN** a user with read-only access to Companies views the 360 view
- **THEN** the system hides edit actions and inline editing capabilities
- **THEN** user can view but not modify Company data
- **WHEN** a user lacks permission to view related objects (e.g., Opportunities)
- **THEN** the system hides the corresponding relation tabs or shows restricted state

#### Scenario: Row-level security applies to 360 view
- **WHEN** row-level security predicates restrict access to specific Companies
- **THEN** the system respects predicates and denies access to restricted 360 views
- **THEN** the system displays an appropriate access denied message
