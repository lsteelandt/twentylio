## 1. Backend - Module Structure

- [ ] 1.1 Create `ai` module directory in `packages/twenty-server/src/modules/ai/`
- [ ] 1.2 Create subdirectories: `ai-configuration/`, `osint-engine/`, `ai-actions/`
- [ ] 1.3 Create AI module entry point and dependencies
- [ ] 1.4 Create database entities for AI configuration

## 2. Backend - AI Configuration Service

- [ ] 2.1 Create AIConfigurationService with CRUD operations
- [ ] 2.2 Implement provider selection logic (Mistral, Claude, ChatGPT, Gemini, Z.ai, OpenRouter)
- [ ] 2.3 Create dynamic provider configuration field handling (RAW_JSON)
- [ ] 2.4 Implement API key encryption and validation
- [ ] 2.5 Create API key testing endpoint
- [ ] 2.6 Implement OSINT sources configuration (Social, Company, Article)
- [ ] 2.7 Implement web sites to monitor configuration
- [ ] 2.8 Create AIConfiguration GraphQL resolver and DTOs

## 3. Backend - OSINT Engine

- [ ] 3.1 Create OSINTSourceService to manage source configurations
- [ ] 3.2 Implement LinkedIn scraper (profile data, company info)
- [ ] 3.3 Implement Twitter/X scraper (mentions, activity)
- [ ] 3.4 Implement GitHub scraper (repositories, contributors)
- [ ] 3.5 Implement Crunchbase client (company data, employees)
- [ ] 3.6 Implement Dun & Bradstreet client (legal data, company info)
- [ ] 3.7 Implement web article scraper for monitored sites
- [ ] 3.8 Implement OSINT result aggregation and deduplication
- [ ] 3.9 Create OSINTEngineService orchestrator
- [ ] 3.10 Implement rate limiting and caching for all sources

## 4. Backend - AI Actions Service

- [ ] 4.1 Create AIActionsService for task generation and enrichment
- [ ] 4.2 Implement prompt generation for task suggestions based on CRM context
- [ ] 4.3 Implement AI provider client abstraction (Mistral, Claude, etc.)
- [ ] 4.4 Create task suggestion endpoint with CRM object context
- [ ] 4.5 Implement n8n integration for "Enrich with AI" workflow trigger
- [ ] 4.6 Create AI action history tracking
- [ ] 4.7 Implement Suspect Score calculation from OSINT data

## 5. Backend - Database Migrations

- [ ] 5.1 Create migration for AIConfiguration table
- [ ] 5.2 Add aiEnrichment RAW_JSON column to Company, Person, Task tables
- [ ] 5.3 Create OSINTSourceConfiguration table
- [ ] 5.4 Create WebSiteToMonitor table
- [ ] 5.5 Create indexes for AI configuration queries

## 6. Backend - GraphQL API

- [ ] 6.1 Create AI configuration GraphQL queries and mutations
- [ ] 6.2 Create OSINT enrichment GraphQL mutations
- [ ] 6.3 Create AI task suggestion GraphQL queries
- [ ] 6.4 Create AI history GraphQL queries
- [ ] 6.5 Create Suspect Score GraphQL queries
- [ ] 6.6 Register AI module resolvers in app.module.ts

## 7. Frontend - Module Structure

- [ ] 7.1 Create `ai` module directory in `packages/twenty-front/src/modules/ai/`
- [ ] 7.2 Create subdirectories: `ai-configuration/`, `ai-intelligence/`
- [ ] 7.3 Create AI module routing and navigation

## 8. Frontend - AI Configuration Interface

- [ ] 8.1 Create AI configuration screen in Settings > Artificial Intelligence
- [ ] 8.2 Implement provider selection component (cards for Mistral, Claude, ChatGPT, etc.)
- [ ] 8.3 Create dynamic provider configuration fields component
- [ ] 8.4 Implement API key input with masking (show only last 4 chars)
- [ ] 8.5 Create "Test API Key" button with loading states
- [ ] 8.6 Create OSINT sources configuration screen (add/edit/remove sources)
- [ ] 8.7 Create web sites to monitor configuration screen
- [ ] 8.8 Create AI GraphQL hooks (useAIConfiguration, useAIProviders)
- [ ] 8.9 Create error handling and notifications for configuration

## 9. Frontend - AI Intelligence Tab

- [ ] 9.1 Create AI tab component for CRM objects (Company, Person, Task, etc.)
- [ ] 9.2 Implement suggestions display component (cards with relevance scores)
- [ ] 9.3 Create OSINT tools section with tool cards (LinkedIn, Crunchbase, etc.)
- [ ] 9.4 Create AI action history component (chronological list)
- [ ] 9.5 Create task suggestions display (priority badges, due dates)
- [ ] 9.6 Create "Enrich with AI" button component
- [ ] 9.7 Create task creation form from AI suggestions
- [ ] 9.8 Implement empty states for all sections

## 10. Frontend - AI Integration with CRM Views

- [ ] 10.1 Add "AI" tab to Company 360 view (alongside Overview, People, etc.)
- [ ] 10.2 Add "AI" tab to Person details view
- [ ] 10.3 Add "AI" tab to Task module
- [ ] 10.4 Add "Enrich with AI" contextual button in Company 360 view
- [ ] 10.5 Create AI tab state persistence during navigation
- [ ] 10.6 Implement keyboard shortcuts for AI actions

## 11. Frontend - AI Tasks Integration

- [ ] 11.1 Create AI-suggested task creation flow
- [ ] 11.2 Implement bulk task creation from AI suggestions
- [ ] 11.3 Create task assignment suggestions (workspace member recommendations)
- [ ] 11.4 Add AI metadata display in task details
- [ ] 11.5 Implement task priority and description editing before creation
- [ ] 11.6 Create task categorization (Prospecting, Relationship Management, Analysis)
- [ ] 11.7 Create "Refresh Suggestions" button functionality

## 12. Frontend - AI Hooks

- [ ] 12.1 Create useAIConfiguration hook for accessing AI provider settings
- [ ] 12.2 Create useAISuggestions hook for getting AI-generated suggestions
- [ ] 12.3 Create useAIEnrichment hook for triggering OSINT enrichment
- [ ] 12.4 Create useAITasks hook for task generation
- [ ] 12.5 Create useAIHistory hook for action history
- [ ] 12.6 Create useN8nEnrichment hook for triggering n8n workflow

## 13. Backend - n8n Workflow Integration

- [ ] 13.1 Create "Enrich with AI" workflow action trigger in n8n
- [ ] 13.2 Implement HTTP client for n8n (using N8N_API_URL, N8N_API_KEY env vars)
- [ ] 13.3 Create JSON request structure matching design specification
- [ ] 13.4 Implement JSON response parsing and CRM object update
- [ ] 13.5 Implement timeout and retry logic for n8n API calls
- [ ] 13.6 Update Company Suspect Score from n8n enrichment response

## 14. Shared - Types and Utilities

- [ ] 14.1 Create TypeScript types for AI configuration (AIConfiguration, AIProvider)
- [ ] 14.2 Create types for OSINT results (OSINTData, SocialProfile, CompanyData)
- [ ] 14.3 Create types for AI suggestions (AISuggestion, AITask)
- [ ] 14.4 Create utility functions for API key encryption/decryption
- [ ] 14.5 Create utility functions for provider-specific field handling

## 15. Testing - Unit Tests

- [ ] 15.1 Write unit tests for AIConfigurationService
- [ ] 15.2 Write unit tests for OSINTEngine and scrapers
- [ ] 15.3 Write unit tests for AIActionsService
- [ ] 15.4 Write unit tests for provider clients (Mistral, Claude, etc.)
- [ ] 15.5 Write unit tests for n8n integration
- [ ] 15.6 Write unit tests for API key encryption/decryption

## 16. Testing - Integration Tests

- [ ] 16.1 Write integration test for AI configuration (save, test, provider switch)
- [ ] 16.2 Write integration test for OSINT enrichment end-to-end
- [ ] 16.3 Write integration test for AI task suggestion and creation
- [ ] 16.4 Write integration test for n8n workflow trigger

## 17. Testing - E2E Tests

- [ ] 17.1 Write E2E test for complete AI configuration flow (admin → provider → enrich)
- [ ] 17.2 Write E2E test for AI tab usage in Company 360 view
- [ ] 17.3 Write E2E test for AI task suggestion and task creation
- [ ] 17.4 Write E2E test for OSINT tools and article monitoring

## 18. Documentation

- [ ] 18.1 Document AI configuration setup in user guide
- [ ] 18.2 Document OSINT sources and how to use them
- [ ] 18.3 Document AI tab features (suggestions, tools, history)
- [ ] 18.4 Document n8n workflow integration for developers
- [ ] 18.5 Create developer guide for adding new AI providers

## 19. Validation

- [ ] 19.1 Run linter checks for backend AI module
- [ ] 19.2 Run linter checks for frontend AI module
- [ ] 19.3 Run unit tests and ensure all pass
- [ ] 19.4 Run integration tests and ensure all pass
- [ ] 19.5 Run E2E tests and ensure all pass
- [ ] 19.6 Build frontend and ensure no build errors
- [ ] 19.7 Build backend and ensure no build errors
- [ ] 19.8 Test n8n workflow integration with actual n8n instance
