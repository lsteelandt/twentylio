# Vue d’ensemble du projet

## Produit
Ce projet est un CRM personnalisé construit à partir d’un fork de Twenty.

## Objectif
L’objectif est de transformer progressivement la base de code Twenty en un CRM adapté à mes propres processus de prospection, vente, delivery, automatisation et gestion client.

## Stratégie produit
Nous ne reconstruisons pas un CRM depuis zéro.
Nous faisons évoluer Twenty de manière incrémentale, via des changements petits, validés et guidés par des spécifications.

## Stratégie dépôt
Ce dépôt contient déjà le code d’implémentation.
Toutes les modifications de code doivent être appliquées directement dans ce dépôt.
Aucun fichier d’implémentation ne doit être créé en dehors de la racine du dépôt.

## Périmètre du monorepo
- `packages/twenty-front/` : application frontend
- `packages/twenty-server/` : backend, API, logique métier
- `packages/twenty-website-new/` : site web / marketing
- `packages/twenty-zapier/` : intégration Zapier

## Politique de changement
- Privilégier les changements minimaux, ciblés par package et par module.
- Respecter l’architecture et les conventions de nommage existantes avant d’introduire de nouvelles abstractions.
- Éviter les changements cross-package sauf si la spec le justifie clairement.

## Politique de fork
- Préserver autant que possible la compatibilité avec l’upstream.
- Préférer les personnalisations additives aux refactors destructeurs.
- Tout changement cassant, fortement divergent de l’upstream ou difficile à maintenir doit être explicitement justifié dans la proposal.

## Politique de spécification
Utiliser OpenSpec pour :
- les nouvelles fonctionnalités CRM
- les changements de workflow métier
- les objets et champs personnalisés
- les changements d’interface impactant les parcours utilisateur
- les changements d’API ou de schéma
- les automatisations et intégrations
- les changements cross-package
- les refactors multi-fichiers

Les petits correctifs isolés peuvent se passer d’une spec complète seulement s’ils sont locaux, peu risqués, et ne changent pas significativement le comportement.

## Règles d’implémentation
- Les changements frontend vont dans `packages/twenty-front/`
- Les changements backend vont dans `packages/twenty-server/`
- Les changements site web vont dans `packages/twenty-website-new/`
- Les changements d’intégration vont dans `packages/twenty-zapier/`
- Les specs vivent dans `openspec/`

## Règles de validation
Avant apply :
- identifier les packages impactés
- identifier les modules impactés
- identifier les tests et les risques
- valider strictement la proposition

Avant de terminer :
- exécuter les commandes de lint, test et build pertinentes
- mettre à jour la documentation si les workflows ou comportements changent
