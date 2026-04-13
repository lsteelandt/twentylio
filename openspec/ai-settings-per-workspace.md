# Configuration IA par Workspace

## Contexte
Chaque workspace du CRM Twentylio peut avoir ses propres paramètres de configuration IA personnalisés. Ce document spécifie comment configurer ces paramètres de manière cohérente et évolutive.

## Objectif
Permettre à chaque workspace de configurer ses propres paramètres IA (vectorStoreType, vectorDimension, embeddingModel) sans briser la compatibilité avec l'upstream.

## Architecture

### Entités Workspace
Les entités workspace sont gérées par le moteur d'workspace de Twenty, pas par du code NestJS. Les entités sont définies dans:
- `packages/twenty-server/src/database/commands/upgrade-version-command/workspace-migrations/`

### Migrations Workspace
Chaque migration workspace doit implémenter `MigrationInterface` de `@mikro-orm/migrations` et être placée dans le répertoire workspace-migrations.

## Paramètres IA
Chaque workspace doit configurer:

| Paramètre | Type | Description |
|-----------|------|-------------|
| vectorStoreType | string | Type de store de vecteurs (pgvector, weaviate, etc.) |
| vectorDimension | number | Dimension des vecteurs d'embedding |
| embeddingModel | string | Nom du modèle d'embedding à utiliser |
| searchFields | FieldMetadata[] | Liste des champs indexés pour la recherche |

## Workflow

1. **Créer migration workspace**:
   ```
   packages/twenty-server/src/database/commands/upgrade-version-command/workspace-migrations/
   [timestamp]-add-ai-settings-to-[workspace-name].ts
   ```

2. **Implémenter la migration**:
   ```typescript
   export class AddAiSettingsTo[WorkspaceName] implements MigrationInterface {
     async up(): Promise<void> {
       // Configurer les paramètres IA pour ce workspace
     }
   }
   ```

3. **Exécuter la migration**:
   ```bash
   nx run workspace:db:up
   ```

## Contraintes

- Ne pas créer d'entités IA dans `src/modules/ai-settings/` (code NestJS)
- Ne pas utiliser des hooks de requête pour valider la configuration IA
- La configuration IA est gérée dans le moteur d'workspace, pas dans l'application

## Exemples

Voir: `packages/twenty-server/src/database/commands/upgrade-version-command/workspace-migrations/`
