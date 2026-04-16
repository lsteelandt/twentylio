# CLAUDE.md

Ce fichier fournit des instructions à Claude Code pour travailler dans ce dépôt.

## Identité du projet

- Ce dépôt est un fork de Twenty utilisé pour construire un CRM personnalisé adapté à mes besoins métier.
- L’objectif n’est pas de réécrire Twenty depuis zéro, mais de le personnaliser de manière incrémentale.
- Préserver autant que possible la compatibilité avec l’upstream.

## Mode de travail

- Pour tout changement non trivial, utiliser OpenSpec d’abord.
- Workflow obligatoire : proposal -> validate -> apply -> archive.
- Ne pas implémenter directement les changements multi-fichiers, architecturaux, de schéma, de workflow ou d’interface sans spec approuvée.

## Périmètre du monorepo

- Frontend : `packages/twenty-front/`
- Backend : `packages/twenty-server/`
- Site web : `packages/twenty-website-new/`
- Intégration Zapier : `packages/twenty-zapier/`

## Discipline de périmètre

- Travailler uniquement dans le package concerné par la demande.
- Ne pas modifier plusieurs packages sauf si la spec le justifie explicitement.
- Privilégier les changements petits, locaux et réversibles.

## Discipline de fork

- Préférer l’extension et la personnalisation additive aux réécritures destructrices.
- Ne pas renommer ou déplacer de répertoires majeurs sans demande explicite dans une spec approuvée.
- Signaler avant tout changement cassant, fortement divergent de l’upstream, ou coûteux à maintenir.

## Discipline d’architecture

- Toujours inspecter d’abord le module existant, le nommage, les hooks, les patterns GraphQL et les tests avant de modifier le code.
- Respecter les conventions existantes avant d’introduire de nouvelles abstractions.
- Réutiliser au maximum les composants, services et patterns de domaine déjà présents.

## Validation

- Avant de terminer, exécuter les commandes de lint, test et build pertinentes pour les packages impactés.
- Si le comportement change, ajouter ou mettre à jour les plus petits tests pertinents.
- Ne jamais déclarer un travail terminé s’il n’a pas été validé.

## OpenSpec

- La source de vérité des spécifications se trouve dans `openspec/`.
- Lire `openspec/project.md` et les specs concernées avant toute implémentation.

## Discipline UI / Design

- Le design doit partir de la base existante du CRM Twenty.
- Réutiliser en priorité les composants d’interface, patterns de navigation et styles déjà présents.
- Ne pas introduire de nouveau design system ou de rupture visuelle majeure sans spec OpenSpec approuvée.
- Toute nouvelle vue ou composant doit s’intégrer naturellement dans l’expérience actuelle de Twenty.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
