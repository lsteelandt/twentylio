## ADDED Requirements

### Requirement: System shall provide AI configuration interface for workspace administrators

The system SHALL provide a configuration interface in the settings section that allows workspace administrators to select AI providers, configure API keys, and manage AI-related settings.

#### Scenario: Admin accesses AI configuration
- **WHEN** a workspace administrator navigates to Settings > Artificial Intelligence
- **THEN** the system displays the AI configuration interface
- **THEN** the interface shows a list of supported AI providers (Mistral, Claude, ChatGPT, Gemini, Z.ai, OpenRouter)
- **THEN** the interface allows selection of the active AI provider

#### Scenario: Admin configures AI provider
- **WHEN** a workspace administrator selects an AI provider (e.g., Claude)
- **THEN** the system displays provider-specific configuration fields (API key, endpoint, model, max tokens)
- **THEN** the system validates the API key format before saving
- **THEN** the system saves the configuration to the AIConfiguration table

#### Scenario: Admin configures OSINT sources
- **WHEN** a workspace administrator navigates to OSINT Sources configuration
- **THEN** the system displays a list of supported OSINT source types (Social, Company, Article)
- **THEN** the system allows adding, editing, and removing OSINT sources
- **THEN** the system provides parameter configuration for each source (username field, endpoint, etc.)

#### Scenario: Admin manages web sites to monitor
- **WHEN** a workspace administrator configures article sources
- **THEN** the system displays a form to add web sites to monitor
- **THEN** the system accepts a site URL and optional scan interval
- **THEN** the system saves the site configuration to the AIConfiguration

#### Scenario: System validates API key security
- **WHEN** an administrator enters an AI provider API key
- **THEN** the system validates the key format is correct for the selected provider
- **THEN** the system masks the API key after saving (display only last 4 characters)
- **THEN** the system encrypts the API key in the database

#### Scenario: System supports provider switching
- **WHEN** a workspace administrator switches the active AI provider
- **THEN** the system updates the active provider in the AIConfiguration
- **THEN** the system saves the provider history (previous provider, switch time, switched by user)
- **THEN** the system clears any cached results from the previous provider

### Requirement: System shall store AI configuration securely

The system SHALL store AI provider configurations using database encryption and proper access controls.

#### Scenario: AI configuration is encrypted at rest
- **WHEN** an AI configuration is saved to the database
- **THEN** the system encrypts sensitive fields (API keys) before storage
- **THEN** the system uses a strong encryption algorithm (AES-256)
- **THEN** the system decrypts the configuration only when needed for API calls

#### Scenario: Only admins can access AI configuration
- **WHEN** a non-admin user attempts to access the AI configuration interface
- **THEN** the system denies access and displays an insufficient permissions error
- **THEN** the system logs the unauthorized access attempt

#### Scenario: System provides fallback for unavailable AI provider
- **WHEN** the selected AI provider is unavailable or returns errors
- **THEN** the system displays an error message to the user
- **THEN** the system allows switching to an alternative provider
- **THEN** the system does not block other CRM functionality if AI is unavailable

### Requirement: System shall support environment variables for n8n integration

The system SHALL use N8N_API_URL and N8N_API_KEY environment variables for n8n workflow integration.

#### Scenario: System reads n8n environment variables
- **WHEN** the system initializes or makes an n8n API call
- **THEN** the system reads N8N_API_URL from environment variables
- **THEN** the system reads N8N_API_KEY from environment variables
- **THEN** the system fails initialization if required variables are missing

#### Scenario: System provides error handling for missing n8n credentials
- **WHEN** N8N_API_URL or N8N_API_KEY are not configured
- **THEN** the system logs a configuration error
- **THEN** the system displays an appropriate error message in the UI
- **THEN** the system provides instructions on how to configure environment variables

### Requirement: System shall support dynamic provider configuration fields

The system SHALL allow each AI provider to define its own set of configuration fields that are displayed dynamically in the configuration interface.

#### Scenario: Provider defines custom configuration fields
- **WHEN** an AI provider defines custom fields (e.g., Mistral requires 'model' and 'maxTokens')
- **THEN** the system stores these fields in the providerConfig JSON column
- **THEN** the configuration interface displays the custom fields when that provider is selected
- **THEN** the system validates custom field values according to provider specifications

#### Scenario: System handles missing optional configuration fields
- **WHEN** a user saves AI configuration without specifying an optional field
- **THEN** the system uses the provider's default value for that field
- **THEN** the system displays the default value in the configuration interface

### Requirement: System shall allow API key testing

The system SHALL provide a test button to verify AI provider API keys before saving.

#### Scenario: Admin tests AI API key
- **WHEN** an administrator clicks "Test API Key" button
- **THEN** the system makes a test API call to the provider endpoint
- **THEN** the system validates the response indicates successful authentication
- **THEN** the system displays a success message and enables the save button
- **WHEN** the test call fails (invalid key, network error)
- **THEN** the system displays a specific error message
- **THEN** the system keeps the save button disabled until the test succeeds
