## Why

Les équipes commerciales et de gestion client ont besoin d'outils d'intelligence artificielle pour enrichir et analyser les données CRM. L'OSINT (Open Source Intelligence) permet de récupérer des informations sur les entreprises et contacts depuis des sources publiques. Actuellement, ces processus sont manuels et chronophages. Intégrer un moteur IA unifié avec configuration multi-providers (Mistral, Claude, ChatGPT, Gemini, Z.ai, OpenRouter) permet d'automatiser l'enrichissement des données, de générer des tâches basées sur le contexte, et d'analyser les tendances existantes.

## What Changes

- **Nouveau module AI Configuration** : Interface de configuration dans les paramètres pour choisir la solution IA et les clés API
- **Nouveau module AI Intelligence** : Onglet dédié "IA" dans chaque objet CRM avec suggestions et outils
- **Moteur OSINT** : Capacité d'analyser les réseaux sociaux, données d'entreprise et sites web paramétrés
- **Action Enrichir** : Boutons contextuels et dans l'onglet IA pour lancer l'enrichissement via IA
- **Stockage flexible** : Champ custom 'aiEnrichment' sur les objets CRM pour stocker les résultats IA
- **Intégration n8n** : Action "Enrichir avec IA" déclencheant un workflow n8n qui appelle l'IA configurée

## Capabilities

### New Capabilities
- `ai-configuration`: Configuration multi-providers IA avec clés API sécurisées et champs dynamiques par provider.
- `ai-intelligence`: Interface IA contextuelle pour OSINT, enrichissement et analyse de données CRM.
- `osint-enrichment`: Capacité d'enrichir les objets CRM via OSINT (réseaux sociaux, entreprises, sites web).
- `ai-tasks`: Génération de tâches IA basées sur le contexte CRM.

### Modified Capabilities

## Impact

**Modules Backend** :
- `packages/twenty-server/src/modules/ai/` : Nouveau module AI (configuration, OSINT, actions)
- `packages/twenty-server/src/engine/metadata-modules/field-metadata/` : Ajout type de champ custom pour stocker les résultats IA

**Modules Frontend** :
- `packages/twenty-front/src/modules/ai/` : Nouveau module AI (configuration, intelligence, composants)
- `packages/twenty-front/src/modules/companies/` : Boutons IA contextuels dans vue 360°
- `packages/twenty-front/src/modules/people/` : Boutons IA contextuels dans vue personne

**Métadonnées** :
- Nouveau champ 'aiEnrichment' sur Company, Person, Task (type RAW_JSON)
- Page Layouts modifiables pour inclure les résultats IA

**Intégrations** :
- n8n : Workflow action pour déclencher l'IA et stocker les résultats
- Providers IA : Appels direct ou via n8n selon configuration

**Base de données** :
- Table AIConfiguration pour stocker les paramètres IA par workspace
- Colonnes 'aiEnrichment' sur les tables CRM existantes
