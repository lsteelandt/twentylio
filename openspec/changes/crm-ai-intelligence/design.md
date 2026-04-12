## Context

**État actuel :**
Twenty n'a pas de moteur d'intelligence artificielle intégré. Les équipes doivent effectuer manuellement les recherches OSINT, l'enrichissement des données CRM et l'analyse des tendances. L'intégration avec n8n existe pour les workflows mais pas de support IA natif dans l'interface CRM.

**Contraintes :**
- Maintenir la compatibilité avec l'upstream Twenty
- Sécurisation des clés API IA (jamais stockées en clair)
- Support multi-providers IA avec configuration flexible
- Intégration avec l'architecture de métadonnées existante (custom fields)
- Utilisation des variables d'environnement N8N_API_URL et N8N_API_KEY
- Interface IA cohérente avec l'expérience Twenty existante

**Parties prenantes :**
- Équipes commerciales (Sales, Prospection)
- Équipes de gestion client (Account Management)
- Équipes techniques (intégration n8n)

## Goals / Non-Goals

**Goals :**
- Fournir une interface de configuration IA dans les paramètres (paramètres → Intelligence Artificielle)
- Permettre le choix entre plusieurs providers IA (Mistral, Claude, ChatGPT, Gemini, Z.ai, OpenRouter)
- Créer un onglet dédié "IA" dans chaque objet CRM avec suggestions et outils
- Implémenter un moteur OSINT pour enrichir les données (réseaux sociaux, entreprises, sites web)
- Permettre l'action "Enrichir avec IA" depuis l'interface (manuel → n8n → IA → CRM)
- Stocker les résultats IA de manière flexible dans les objets CRM
- Générer des tâches IA basées sur le contexte CRM

**Non-Goals :**
- Création d'un nouveau module de workflow pour l'IA (réutilisation de workflows existants)
- Modification du système de permissions pour l'IA (héritage des permissions existantes)
- Stockage séparé des résultats IA (stocker dans les objets CRM)

## Decisions

### 1. Architecture du module AI

**Choix :** Créer un nouveau module backend `ai/` et frontend `ai/` dédiés à l'intégration IA.

**Rationale :**
- Isolation fonctionnelle : le code IA est séparé du cœur de Twenty
- Facilité de maintenance et évolution
- Possibilité de désactiver le module IA sans impacter le reste du CRM
- Compatibilité avec l'upstream (pas de modification de composants core)

**Alternatives considérées :**
- Intégrer directement dans workflow existing : Rejeté (trop couplé, manque d'interface dédiée)
- Créer un package Twenty-IA séparé : Rejeté (trop complexe à maintenir)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE MODULE AI                       │
└─────────────────────────────────────────────────────────────────┘

packages/twenty-server/src/modules/ai/
  ├─ ai-configuration/         → Service de configuration IA
  ├─ osint-engine/             → Moteur OSINT
  └─ ai-actions/                → Actions CRM enrichées

packages/twenty-front/src/modules/ai/
  ├─ ai-configuration/         → Écran de configuration IA
  ├─ ai-intelligence/         → Composants d'onglet IA
  └─ hooks/                  → Hooks React pour utiliser l'IA
```

### 2. Configuration multi-providers IA

**Choix :** Table AIConfiguration dans PostgreSQL avec un champ dynamique 'providerConfig' de type RAW_JSON.

**Rationale :**
- Chaque provider IA a ses propres champs de configuration (ex: endpoint, model, maxTokens)
- RAW_JSON permet de stocker n'importe quelle structure de configuration
- Extensible : ajout de nouveaux providers sans migration de schéma

**Structure de configuration :**
```typescript
interface AIConfiguration {
  id: string;
  workspaceId: string;
  provider: 'mistral' | 'claude' | 'chatgpt' | 'gemini' | 'zai' | 'openrouter';
  providerConfig: {
    // Champs dynamiques selon provider
    apiKey: string;
    endpoint?: string;
    model?: string;
    maxTokens?: number;
    // ... autres champs spécifiques
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Alternatives considérées :**
- Table par provider (MistralConfiguration, ClaudeConfiguration...) : Rejeté (duplication de code)
- Fichier de configuration JSON dans le workspace : Rejeté (pas persistant, pas queryable)

### 3. Onglet IA contextuel dans les objets CRM

**Choix :** Ajouter un onglet "IA" dans chaque objet CRM (Company, Person, Task, etc.) avec suggestions et outils contextuels.

**Rationale :**
- Contextuel : suggestions IA basées sur les données de l'objet actif
- Accessible depuis les vues existantes (Company 360°, Person details, Task, etc.)
- Coérence avec le pattern d'onglets de Twenty
- Ne nécessite pas de modifier la navigation principale

**Structure de l'onglet IA :**
```
┌─────────────────────────────────────────────────────────────────┐
│  ONGLET IA - [Company: ACME Corp]                          │
├─────────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │   SUGGESTIONS IA    │  │   OUTILS OSINT     │ │
│  │                     │  │                     │ │
│  │ ┌──────────────────┐  │  ├─ LinkedIn           │ │
│  │ │ LinkedIn : ...     │  ├─ Crunchbase        │ │
│  │ │ Employees: 50      │  ├─ Twitter           │ │
│  │ │ Revenue: $5M       │  └─ Dun & Bradstreet   │ │
│  │ └──────────────────┘  │                        │ │
│  │                     │  ┌──────────────────────┐ │
│  │   BOUTONS           │  │   ENRICHISSEMENT    │ │
│  │                     │  │                     │ │
│  │ [Enrichir données]  │  │ [Analyse OSINT]    │ │
│  │ [Générer tâches]   │  │ [Anomalies détectées]│ │
│  └──────────────────────┘  └──────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │   HISTORIQUE DES ACTIONS IA                     │   │
│  │                                                     │   │
│  │  [2025-04-06] Enrichissement OSINT   ...   │   │
│  │    - Suspect Score: 4/5                 ...   │   │
│  │  [2025-04-05] Génération de tâches        ...   │   │
│  │    - 3 tâches suggérées                ...   │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Moteur OSINT

**Choix :** Moteur OSINT modulaire avec scrapers paramétrables pour les sources prioritaires.

**Rationale :**
- Modularitée : ajouter de nouvelles sources OSINT facilement
- Paramétrable : liste de sites web à suivre configurable par workspace
- Flexibilité : support de différents types de sources (réseaux sociaux, entreprises, articles)

**Sources OSINT supportées initialement :**
```typescript
interface OSINTSource {
  type: 'social' | 'company' | 'article';
  name: string;
  config?: {
    // Configuration spécifique par type
  };
}

// Sources sociales
LinkedIn: { type: 'social', name: 'LinkedIn', config: { usernameField: 'linkedinProfile' } }
Twitter: { type: 'social', name: 'Twitter', config: { usernameField: 'twitterHandle' } }
GitHub: { type: 'social', name: 'GitHub', config: { usernameField: 'githubProfile' } }

// Sources entreprise
Crunchbase: { type: 'company', name: 'Crunchbase', config: { endpoint: '...' } }
DunBradstreet: { type: 'company', name: 'DunBradstreet', config: { endpoint: '...' } }

// Sources articles (sites web à suivre)
Liste configurée par workspace avec URLs à scanner
```

**Alternatives considérées :**
- Scraping direct dans le module AI : Rejeté (violations TOS des services)
- Uniquement sources payantes : Rejeté (coût élevé, limité)

### 5. Intégration n8n pour l'action IA

**Choix :** Action "Enrichir avec IA" qui appelle votre serveur n8n configuré.

**Rationale :**
- Déjà mentionné dans CLAUDE.md : accès API à n8n via N8N_API_URL et N8N_API_KEY
- Centralisation de la logique IA : un workflow n8n peut orchestrer l'appel IA, l'OSINT, et le stockage
- Flexibilité : vous pouvez modifier le workflow n8n sans toucher au code Twenty

**Flux d'interaction :**
```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX D'INTÉGRATION N8N                      │
└─────────────────────────────────────────────────────────────────┘

User CRM (Twentylio)
  └─ Clic "Enrichir avec IA" sur compte ACME Corp
       └─ Trigger workflow n8n "Enrich Account 360"
              └─ Envoi JSON → n8n

n8n (Votre serveur)
  ├─ Réception JSON : { companyId: "...", context: {...} }
  ├─ Appel IA configurée (ex: Claude via API Anthropic)
  └─ Renvoi JSON : { enrichedData: {...} }
       └─ Trigger workflow n8n "Update Company"
              └─ Mise à jour CRM → Champ 'aiEnrichment'

Twentylio (CRM)
  └─ Mise à jour automatique du Suspect Score
  └─ Notification utilisateur : "Enrichissement terminé"
```

**Format d'échange JSON :**
```json
// Request (Twenty → n8n)
{
  "action": "enrich_company",
  "companyId": "uuid",
  "context": {
    "objectType": "company" | "person" | "task",
    "objectData": {
      "name": "ACME Corp",
      "domainName": "acme.com",
      "employees": 50
    },
    "osintTargets": [
      "linkedin",
      "crunchbase",
      "twitter"
    ]
  },
  "metadata": {
    "triggeredBy": "manual" | "workflow",
    "userId": "uuid",
    "workspaceId": "uuid"
  }
}

// Response (n8n → Twenty)
{
  "action": "enrich_company",
  "companyId": "uuid",
  "result": {
    "success": true,
    "enrichedData": {
      "suspectScore": 4,
      "socialProfiles": {
        "linkedin": "https://linkedin.com/company/acme"
      },
      "companyData": {
        "employees": 125,
        "revenue": 12500000
      },
      "articles": [
        {
          "title": "ACME lance nouveau produit",
          "url": "https://techcrunch.com/...",
          "summary": "..."
        }
      ],
      "suggestions": [
        "Approcher pour partenariat",
        "Risque détecté : concurrence accrue"
      ],
      "generatedTasks": [
        {
          "title": "Analyser le site web ACME",
          "priority": "high",
          "assignedTo": null
        },
        {
          "title": "Contacter le CTO via LinkedIn",
          "priority": "medium",
          "assignedTo": null
        }
      ]
    },
    "aiMetadata": {
      "provider": "claude",
      "model": "claude-3-5-sonnet",
      "timestamp": "2025-04-06T10:30:00Z"
    }
  }
}
```

### 6. Stockage des résultats IA

**Choix :** Champ custom 'aiEnrichment' de type RAW_JSON sur chaque objet CRM.

**Rationale :**
- Flexibilité : stocker n'importe quel résultat IA (score, profiles, articles, tâches, suggestions)
- Compatibilité avec le metadata engine : custom field existant déjà supporté
- Performance : RAW_JSON utilise PostgreSQL JSONB, queryable partiellement

**Structure du champ aiEnrichment :**
```json
{
  "lastEnrichmentAt": "2025-04-06T10:30:00Z",
  "provider": "claude",
  "suspectScore": 4,
  "socialProfiles": {
    "linkedin": "...",
    "twitter": "..."
  },
  "companyData": {
    "employees": 125,
    "revenue": 12500000
  },
  "articles": [
    { "title": "...", "url": "...", "summary": "..." }
  ],
  "suggestions": [
    { "text": "Approcher pour partenariat" }
  ],
  "generatedTasks": [
    { "title": "...", "priority": "high" }
  ],
  "history": [
    {
      "action": "enrich_company",
      "timestamp": "2025-04-06T10:30:00Z",
      "provider": "claude",
      "success": true
    }
  ]
}
```

### 7. Boutons contextuels "Enrichir avec IA"

**Choix :** Ajouter des boutons "Enrichir avec IA" dans les vues CRM (Company 360°, Person details, etc.).

**Rationale :**
- Accessibilité : l'action est disponible là où l'utilisateur en a besoin
- Contextuel : bouton dans le contexte de l'objet à enrichir
- Flux : bouton → workflow n8n → IA → CRM

**Alternatives considérées :**
- Bouton uniquement dans l'onglet IA : Rejeté (trop profond, pas contextuel)
- Action automatique uniquement : Rejeté (pas de contrôle utilisateur)

## Risks / Trade-offs

### Sécurité des clés API

**Risque :** Les clés API IA stockées dans la configuration pourraient être exposées.

**Mitigation :**
- Chiffrement des clés dans la base de données (columnne 'apiKey' cryptée)
- Permissions restreintes : seuls les admins workspace peuvent voir/configurer les clés
- Masquage dans les logs : jamais logger les clés API
- Variables d'environnement N8N_API_URL et N8N_API_KEY déjà existantes

### Coûts d'API IA

**Risque :** Les appels aux providers IA (Claude, Mistral, etc.) génèrent des coûts récurrents.

**Mitigation :**
- Budget configurable par workspace
- Alertes de dépassement de quota
- Cache des résultats pour éviter les appels dupliqués
- Option d'utilisation du provider OpenRouter (meilleure valeur)

### Qualité des données OSINT

**Risque :** Les données OSINT peuvent être obsolètes ou inexactes.

**Mitigation :**
- Afficher la date d'enrichissement dans l'onglet IA
- Permettre le rafraîchissement manuel
- Historique complet des actions pour traçabilité

### Dépendance à n8n

**Risque :** L'action "Enrichir avec IA" dépend de votre serveur n8n.

**Mitigation :**
- Fallback UI : notification en cas d'erreur n8n
- Timeout configurée pour éviter le blocage UI
- Retry automatique pour les erreurs temporaires

### Performance de l'onglet IA

**Risque :** L'onglet IA avec suggestions et outils peut devenir lourd.

**Mitigation :**
- Lazy loading des suggestions et historique
- Pagination de l'historique des actions
- Optimisation des requêtes OSINT (cache, indexes)

## Migration Plan

**Phase 1 : Développement (Backend)**
1. Création du module `ai/` dans twenty-server
2. Définition du service de configuration IA
3. Implémentation du moteur OSINT basique
4. Création des actions IA (enrich, generate-tasks)
5. Migration DB : table AIConfiguration et champ 'aiEnrichment'

**Phase 2 : Développement (Frontend)**
1. Création du module `ai/` dans twenty-front
2. Écran de configuration IA dans les paramètres
3. Composant d'onglet IA contextuel
4. Hook React `useAIEnrichment`
5. Tests unitaires et E2E

**Phase 3 : Intégration**
1. Création du workflow n8n "Enrichir avec IA"
2. Configuration n8n (variables N8N_API_URL, N8N_API_KEY)
3. Tests bout de bout de bout en bout

**Phase 4 : Déploiement**
1. Migration DB vers production
2. Activation progressive (feature flag optionnel)
3. Documentation utilisateur
4. Monitoring des appels IA

**Rollback strategy :**
- Désactivation du module IA via feature flag
- Aucune donnée stockée n'est supprimée (le champ 'aiEnrichment' est optionnel)
- Workflows n8n peuvent être désactivés individuellement

## Open Questions

1. **Providers IA supplémentaires** : Faut-il envisager d'autres providers (Perplexity, HuggingFace, Cohere, Grok) ?
2. **Scraping légal** : Les TOS des services (LinkedIn, etc.) autorisent-elles l'automatisation via l'IA ?
3. **Cache des résultats** : Quelle stratégie de cache pour éviter les appels dupliqués (Redis, PostgreSQL, local) ?
4. **Fonctionnalités IA avancées** : Faut-il prévoir l'analyse de sentiments, la détection d'anomalies, la prédiction de propension ?
5. **Intégration avec le Suspect Score** : Comment l'enrichissement IA doit-il alimenter directement le Suspect Score du compte 360° ou doit-il passer par le workflow n8n ?
