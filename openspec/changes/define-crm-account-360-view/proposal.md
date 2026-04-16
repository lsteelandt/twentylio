## Why

Les équipes commerciales ont besoin d'une vue consolidée et complète de chaque compte (entreprise) pour prendre des décisions éclairées et suivre efficacement les relations. Actuellement, l'information est dispersée entre plusieurs vues et composants, ce qui ralentit le travail de prospection et de suivi client. Une vue 360° améliore l'efficacité en centralisant toutes les informations contextuelles en un seul endroit.

## What Changes

- **Nouveau module "Account 360"** : Vue dédiée pour les entreprises/Company
- **Section Informations Contextuelles** : Affichage des champs clés (employés, revenus, secteur, profil ICP, adresse)
- **Section Relations** : Vue consolidée des personnes, opportunités et tâches liées, affichées en sections empilées (sans onglets) avec les colonnes des vues par défaut de chaque objet
- **Dashboard KPIs** : Métriques spécifiques au compte (value, activities, conversion rate)
- **Intégration Workflows** : Trigger et actions pour automatiser les mises à jour de la vue 360°
- **Side Panel étendu** : Permettre l'édition des informations depuis la vue 360°

## Capabilities

### New Capabilities
- `account-360-view`: Vue complète et consolidée des informations d'un compte CRM incluant les données contextuelles, relations, timeline et métriques.

### Modified Capabilities

## Impact

**Modules Backend** :
- `packages/twenty-server/src/modules/company/` : Extension pour données 360°
- `packages/twenty-server/src/modules/workflow/` : Triggers et actions pour la vue 360°

**Modules Frontend** :
- `packages/twenty-front/src/modules/companies/` : Nouveau composant Account 360
- `packages/twenty-front/src/modules/object-record/` : Réutilisation de composants génériques (record-card, timeline, etc.)
- `packages/twenty-front/src/modules/views/` : Configuration de vue 360°

**Métadonnées** :
- Possibilité d'ajouter des custom fields visibles dans la vue 360°
- Page Layouts configurables pour la vue 360°

**Intégrations** :
- Webhooks pour notifier n8n lors d'accès à la vue 360°
- HTTP Request Actions depuis workflows pour enrichir les données 360° (ex: enrichissement externe)
