## ADDED Requirements

### Requirement: System shall provide OSINT enrichment capabilities for CRM objects

The system SHALL provide Open Source Intelligence (OSINT) tools to enrich CRM objects with data from social media, company databases, and web sources.

#### Scenario: User initiates OSINT enrichment for Company
- **WHEN** a user clicks "Run OSINT" tool or "Enrich with AI" action is triggered
- **THEN** the system initiates OSINT data collection for the Company
- **THEN** the system collects data from configured sources (LinkedIn, Crunchbase, Twitter, etc.)
- **THEN** the system processes and aggregates the OSINT results

#### Scenario: OSINT collects social media profiles
- **WHEN** OSINT enrichment is active for a Company
- **THEN** the system searches LinkedIn for the company profile
- **THEN** the system searches Twitter/X for company mentions and activity
- **THEN** the system searches GitHub for company repositories and contributors

#### Scenario: OSINT collects company data
- **WHEN** OSINT enrichment is active for a Company
- **THEN** the system queries Crunchbase for company information (employees, funding, acquisitions)
- **THEN** the system queries Dun & Bradstreet for legal data
- **THEN** the system aggregates company data into a structured format

#### Scenario: OSINT monitors configured web articles
- **WHEN** articles are configured for a Company (e.g., techcrunch.com, wsj.com)
- **THEN** the system scrapes or fetches articles mentioning the company
- **THEN** the system extracts article titles, URLs, publication dates, and summaries
- **THEN** the system stores article data in the aiEnrichment field

#### Scenario: OSINT results are stored in CRM object
- **WHEN** OSINT enrichment completes successfully
- **THEN** the system updates the Company's aiEnrichment field with the collected data
- **THEN** the system includes enrichment timestamp and AI provider metadata
- **THEN** the system displays enriched data in the AI tab and Account 360 view

### Requirement: OSINT tools shall be configurable per workspace

The system SHALL allow workspace administrators to configure which OSINT sources and web articles to monitor.

#### Scenario: Admin configures OSINT sources
- **WHEN** a workspace administrator configures OSINT sources in AI configuration
- **THEN** the system allows enabling/disabling each source type
- **THEN** the system provides parameter configuration for each source (e.g., LinkedIn username field)
- **THEN** the system saves the OSINT source configuration to the AIConfiguration table

#### Scenario: Admin configures web articles to monitor
- **WHEN** a workspace administrator adds a web site to monitor for articles
- **THEN** the system accepts the site URL and optional scan interval
- **THEN** the system saves the site configuration with a unique identifier
- **THEN** the OSINT engine includes the site in scheduled article monitoring

### Requirement: OSINT shall respect API rate limits and terms of service

The system shall respect rate limits and terms of service for all external OSINT sources and APIs.

#### Scenario: System respects LinkedIn rate limits
- **WHEN** making LinkedIn API calls during OSINT enrichment
- **THEN** the system implements rate limiting to avoid API throttling
- **THEN** the system caches LinkedIn profile data to reduce API calls
- **THEN** the system handles rate limit errors gracefully with retry delays

#### Scenario: System respects data scraping terms
- **WHEN** scraping web sources for OSINT data
- **THEN** the system respects robots.txt directives
- **THEN** the system implements appropriate request delays to avoid blocking
- **THEN** the system uses user-agent headers compliant with source policies

### Requirement: OSINT shall provide data validation and deduplication

The system shall validate OSINT data and avoid duplicate entries in CRM enrichment.

#### Scenario: System validates OSINT data before storage
- **WHEN** OSINT data is collected from a source
- **THEN** the system validates data structure and required fields are present
- **THEN** the system rejects or flags incomplete/invalid data
- **THEN** the system logs validation errors for debugging

#### Scenario: System deduplicates OSINT results
- **WHEN** OSINT enrichment runs multiple times for the same Company
- **THEN** the system identifies duplicate data across enrichment runs
- **THEN** the system merges data intelligently (most recent takes precedence)
- **THEN** the system updates the aiEnrichment history without creating duplicate entries

### Requirement: OSINT shall support partial enrichment failure

The system shall continue with partial OSINT results even when some sources fail or return errors.

#### Scenario: Some OSINT sources fail
- **WHEN** OSINT enrichment runs but LinkedIn API fails while Crunchbase succeeds
- **THEN** the system stores successful results from available sources
- **THEN** the system includes metadata indicating which sources failed
- **THEN** the system allows retrying failed sources individually

#### Scenario: OSINT enrichment times out
- **WHEN** OSINT sources do not respond within timeout period
- **THEN** the system stores partial results from sources that responded
- **THEN** the system marks timed-out sources for potential retry
- **THEN** the system does not block the overall enrichment process due to timeout

### Requirement: OSINT shall integrate with n8n workflow

The system shall allow triggering OSINT enrichment via n8n workflows for automation.

#### Scenario: OSINT enrichment triggered via n8n workflow
- **WHEN** an n8n workflow triggers OSINT enrichment for a Company
- **THEN** the system executes OSINT data collection as configured
- **THEN** the system sends enriched data back to n8n in the workflow response
- **THEN** the system stores the enrichment action in the aiEnrichment history

#### Scenario: OSINT results update Company Suspect Score
- **WHEN** OSINT data indicates high employee count or growth metrics
- **THEN** the system calculates or updates the Company's Suspect Score
- **THEN** the Suspect Score in Account 360 view reflects the new OSINT enrichment
- **THEN** the system includes OSINT source as the score provenance
