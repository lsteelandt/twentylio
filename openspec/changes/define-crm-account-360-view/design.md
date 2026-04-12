## Context

**État actuel :**
Twenty a déjà des objets Company avec des relations vers Person, Opportunity, Task, Note, etc. Les composants frontend `object-record` fournissent une base générique pour afficher ces relations. Cependant, il n'existe pas de vue 360° consolidée qui rassemble toutes ces informations en un seul endroit avec un focus sur le contexte commercial.

**Contraintes :**
- Maintenir la compatibilité avec l'upstream Twenty
- Réutiliser au maximum les composants existants (record-card, timeline, etc.)
- Suivre les patterns de navigation et design de Twenty
- Système de métadonnées dynamique : les custom fields doivent apparaître dans la vue 360°
- Intégration avec workflows existants (triggers, actions)

**Parties prenantes :**
- Équipes commerciales (Sales)
- Équipes de gestion client (Account Management)
- Équipes techniques (intégrations n8n)

## Goals / Non-Goals

**Goals :**
- Fournir une vue 360° des comptes centralisant toutes les informations contextuelles
- Permettre la configuration flexible de la vue via Page Layouts
- Intégrer les workflows pour l'enrichissement automatique des données 360°
- Offrir une timeline consolidée de toutes les activités liées au compte
- Exposer des KPIs spécifiques par compte
- Maintenir une cohérence visuelle avec l'expérience Twenty existante

**Non-Goals :**
- Création de nouveaux objets métier (réutilisation des objets existants)
- Modification du système de permissions existant
- Changement de l'architecture de base du metadata engine
- Personnalisation par utilisateur de la vue 360° (configuration au niveau workspace)

## Decisions

### 1. Architecture du composant Account 360

**Choix :** Créer un nouveau module frontend `account-360` dans `packages/twenty-front/src/modules/companies/` qui réutilise les composants génériques `object-record` existants.

**Rationale :**
- Composants génériques existants (record-card, timeline, record-table) sont déjà testés et optimisés
- Évite la duplication de code
- Facilite la maintenance et l'évolution avec l'upstream Twenty
- Le metadata engine génère déjà les champs et relations nécessaires

**Alternatives considérées :**
- Créer des composants 360° entièrement personnalisés : Rejeté (duplication, maintenance élevée)
- Modifier directement record-show : Rejeté (trop spécifique aux comptes, cas d'usage différents)

### 2. Organisation de la vue 360°

**Choix :** Layout en sections verticales empilées, sans onglets. Les trois objets relationnés (Contacts, Opportunités, Tâches) sont affichés l'un après l'autre sur la même page, avec scroll vertical.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Company Name]                          [Actions] [Enrichir]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Context Section (Key fields + KPIs)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Context    │  │   KPIs      │  │              │         │
│  │  (Key fields)│  │  (Metrics)   │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ── Contacts (Person) ──────────────────────────────────────    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Colonnes de la vue par défaut "All People"               │   │
│  │ (Nom, Email, Ville, etc. → via SQL viewField query)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ── Opportunités ───────────────────────────────────────────    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Colonnes de la vue par défaut "All Opportunities"        │   │
│  │ (Nom, Étape, Montant, Date clôture, etc.)                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ── Tâches ─────────────────────────────────────────────────    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Colonnes de la vue par défaut "All Tasks"                │   │
│  │ (Titre, Statut, Due date, etc.)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Rationale :**
- Affichage complet sans nécessiter de navigation entre onglets
- L'utilisateur voit toutes les informations d'un coup, quitte à scroller
- Chaque section utilise les colonnes de la vue par défaut de l'objet correspondant
- Les colonnes sont dynamiques et correspondent exactement à ce qui est configuré dans les vues "All {objectLabelPlural}"
- Extensible pour ajouter de nouvelles sections
- Compatible avec Page Layouts existants

**Colonnes dynamiques par section :**
Les colonnes affichées dans chaque section sont déterminées par les vues par défaut configurées dans le workspace, via la requête SQL :
```sql
SELECT fm.name AS column_name, fm.type AS column_type, vf.position
FROM core."viewField" vf
JOIN core."fieldMetadata" fm ON vf."fieldMetadataId" = fm.id
JOIN core."view" v ON vf."viewId" = v.id
JOIN core."objectMetadata" om ON v."objectMetadataId" = om.id
WHERE om."nameSingular" = '{object}'
AND v.name = 'All {objectLabelPlural}'
AND vf."isVisible" = true
AND vf."isActive" = true
ORDER BY vf.position ASC;
```

Cette requête est exécutée côté frontend via le hook `useViewFieldsByViewName` pour chaque objet (Person, Opportunity, Task).

### 3. Chargement des données 360°

**Choix :** Utiliser GraphQL queries existantes avec fragments, agrégées dans un seul hook useAccount360Data.

**Rationale :**
- GraphQL fragment pattern déjà utilisé dans Twenty
- Permet d'optimiser les requêtes (un seul round trip)
- Cache Apollo partagé avec le reste de l'application

**Alternatives considérées :**
- API REST dédiée 360° : Rejeté (contrevient à l'architecture GraphQL de Twenty)
- Chargement chunké par section : Rejeté (UX dégradée, effet de clignotement)

### 4. Intégration Workflows

**Choix :** Exposer deux nouveaux éléments pour les workflows :
- Trigger "Account Viewed" : déclenché quand un utilisateur accède à la vue 360° d'un compte
- Action "Enrich Account 360" : permet d'ajouter des données externes via n8n

**Rationale :**
- Permet l'enrichissement automatique des données (ex: scraping LinkedIn, enrichment API tiers)
- Notification d'activité pour les intégrations externes
- Réutilise le pattern de triggers/actions existant dans Twenty

**Alternatives considérées :**
- Polling depuis n8n : Rejeté (inefficace, latence)
- Webhook uniquement : Rejeté (unidirectionnel, limité)

### 5. Custom Fields dans la vue 360°

**Choix :** Afficher tous les custom fields du Company dans la section Context, en respectant l'ordre du Page Layout.

**Rationale :**
- Le metadata engine permet déjà de définir des custom fields
- Les Page Layouts existants gèrent l'ordre et la visibilité
- Cohérence avec le reste de l'application Twenty

### 6. Timeline d'activités

**Choix :** Réutiliser le composant `timeline` existant avec un filtre pour ne montrer que les activités liées au compte.

**Rationale :**
- Le composant timeline est déjà robuste et testé
- Supporte déjà l'agrégation de différents types d'activités
- Évite la duplication de logique

## Risks / Trade-offs

### Performance

**Risque :** La vue 360° peut devenir lourde si beaucoup de relations (contacts, opps, activités).

**Mitigation :**
- Pagination pour les listes (contacts, opportunités)
- Lazy loading des sections
- Utilisation de l'indexation PostgreSQL existante
- Caching Apollo optimisé

**Trade-off :** Initial load vs. navigation fluide. On privilégie l'affichage immédiat du contexte, puis le chargement progressif des sections lourdes.

### Maintenance avec l'upstream

**Risque :** Divergence avec l'upstream Twenty lors de mises à jour.

**Mitigation :**
- Réutilisation maximale des composants génériques
- Pas de modification de composants core (twenty-front, twenty-server)
- Code personnalisé isolé dans un module dédié
- Documentation claire des modifications

### UX pour les nouveaux utilisateurs

**Risque :** Vue 360° peut être déroutante si trop dense.

**Mitigation :**
- Sections verticales bien séparées avec titres clairs et compteurs
- Empty states clairs quand aucune donnée
- Pagination dans chaque section pour limiter le volume affiché
- Guide d'utilisation dans onboarding

### Complexité des Workflows

**Risque :** Intégration n8n peut créer des dépendances externes critiques.

**Mitigation :**
- Actions de workflow optionnelles, non blocking
- Timeouts et retry logic robustes
- Fallback UI si enrichment échoue

## Migration Plan

**Phase 1 : Développement**
1. Création du module frontend `account-360`
2. Définition du layout et des composants
3. GraphQL queries et hooks
4. Intégration Page Layouts
5. Tests unitaires et E2E

**Phase 2 : Workflows**
1. Implémentation du trigger "Account Viewed"
2. Implémentation de l'action "Enrich Account 360"
3. Tests de workflow

**Phase 3 : Déploiement**
1. Migration DB (si custom fields supplémentaires)
2. Activation progressive (feature flag optionnel)
3. Monitoring des performances
4. Feedback utilisateur

**Rollback strategy :**
- Désactivation de la vue 360° via feature flag
- Les données existantes ne sont pas modifiées (vue lecture seule de base)
- Workflows peuvent être désactivés individuellement

## Décisions - Réponses aux questions ouvertes

### KPIs spécifiques par compte

**Décision :** Afficher deux KPIs :
1. **Nombre d'activités sur le compte** : Compte total des activités liées au compte sur la période configurée (par défaut : 30 jours)
2. **Suspect scoring (IA-assisté)** : Score de maturité du prospect, de 0 à 5

**Format du Suspect scoring :**
- **0** : Pas d'information disponible (score non calculable)
- **1 à 5** : Échelle de maturité (1 = très bas / 5 = très mature)

**Fonctionnalité IA-assistée :**
- Le score sera renseigné via une fonctionnalité d'enrichissement assistée par l'IA
- L'IA effectue de l'OSINT (Open Source Intelligence) sur le compte pour détecter des traces de besoins
- Le scoring peut être déclenché manuellement ou automatiquement via workflow n8n

**Sources OSINT potentielles :**
- Vérification de présence sur LinkedIn, Crunchbase, etc.
- Détection de traces d'achats, de recrutement, de besoins techniques
- Analyse de maturité digitale (site web, réseaux sociaux)

### Intégration n8n

**Décision :** Le format d'échange entre Twenty et n8n est JSON.

**Structure de payload (request) :**
```json
{
  "companyId": "uuid",
  "companyContext": {
    "name": "string",
    "domainName": "string",
    "employees": "number",
    "address": { ... },
    "suspectScore": "number | null"
  },
  "metadata": {
    "triggeredBy": "manual" | "workflow",
    "timestamp": "ISO-8601"
  }
}
```

**Structure de payload (response) :**
```json
{
  "companyId": "uuid",
  "enrichedData": {
    "suspectScore": "number",
    "notes": "string",
    "customFields": {
      "fieldName1": "value1",
      "fieldName2": "value2"
    }
  },
  "source": "n8n"
}
```

**Flux d'enrichissement :**
1. Trigger : User clic sur bouton "Enrichir avec IA" ou workflow automatique
2. Request : Twenty envoie JSON vers n8n (avec contexte)
3. Processing : n8n exécute workflow IA + OSINT
4. Response : n8n retourne données enrichies (score, notes, custom fields)
5. Update : Twenty met à jour le Company avec nouvelles données

### Permissions pour la vue 360°

**Décision :** Tous les utilisateurs authentifiés du workspace peuvent accéder à la vue 360°.

**Rationale :**
- La vue 360° est une vue consolidée de données existantes, pas de nouvelles données sensibles
- Réutilisation du système de permissions existant : si un utilisateur peut voir un Company, il peut voir sa vue 360°
- Simplification de la gestion des permissions
- Cohérence avec la philosophie Twenty (transparence des données au sein du workspace)

**Conséquences :**
- Pas de nouvelles permissions spécifiques "account-360-view"
- Les permissions existantes s'appliquent automatiquement (read-only pour édition, etc.)
- Le row-level security (RLS) continue de fonctionner pour restreindre l'accès aux Companies

### Support mobile

**Décision :** La vue 360° doit être accessible et utilisable sur mobile.

**Contraintes UX mobile :**
- Layout responsive adaptatif pour écrans < 768px
- Sections empilées verticalement (Context → Relations → Timeline)
- Tabs navigables avec contrôles tactiles (touch-friendly)
- Timeline avec scrolling horizontal pour petits écrans
- KPIs réorganisés en grille compacte sur mobile

**Approche de mise en œuvre :**
- Utiliser le système de responsive de Twenty (`@media` queries, Tailwind breakpoints)
- Tester sur plusieurs tailles d'écran (iPhone SE, iPhone Pro, iPad)
- Navigation simplifiée : réduction des actions visibles sur mobile
- Focus sur l'information critique en premier (Context section)
