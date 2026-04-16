# Spécification — Fondations CRM personnalisé

## Métadonnées

- Version : 1.0.0
- Statut : Draft
- Dernière mise à jour : 2026-04-05
- Portée : fonctionnalités socle du CRM construit sur le fork de Twenty

---

## ADDED Requirements

### Requirement: Vue 360 sur les comptes

Le système doit fournir une vue 360 pour chaque compte, rassemblant les informations clés liées.

#### Scenario: Affichage 360 d’un compte
Étant donné qu’un utilisateur ouvre la fiche d’un compte
Quand la vue 360 du compte est affichée
Alors le système affiche :
- les informations de base du compte (nom, type, coordonnées principales)
- la liste des contacts associés à ce compte
- la liste des opportunités liées à ce compte

#### Scenario: Opportunité avec compte acheteur direct
Étant donné qu’une opportunité référence le compte comme acheteur direct
Quand la vue 360 du compte est affichée
Alors cette opportunité apparaît dans la section « Opportunités » du compte
Et la relation est identifiée comme « Acheteur direct »

#### Scenario: Opportunité avec compte en relation
Étant donné qu’une opportunité est liée au compte en tant que partie prenante non acheteur direct
Quand la vue 360 du compte est affichée
Alors cette opportunité apparaît dans la section « Opportunités »
Et la nature de la relation est indiquée (exemples : « Collectivité de rattachement », « Partenaire », « Prescripteur »)

---

### Requirement: Rapprochement de comptes depuis un fichier CSV

Le système doit permettre de rapprocher les comptes du CRM avec une base externe fournie sous forme de fichier CSV.

#### Scenario: Import d’un fichier CSV de comptes externes
Étant donné qu’un utilisateur importe un fichier CSV contenant une base de comptes externe
Quand le fichier est analysé
Alors le système identifie :
- les comptes externes qui correspondent à des comptes existants dans le CRM
- les comptes externes qui n’ont pas de correspondance dans le CRM

#### Scenario: Rapprochement par similarité de noms
Étant donné qu’un compte externe possède un nom proche d’un compte du CRM
Quand le rapprochement est effectué
Alors le système propose une correspondance même si les noms ne sont pas strictement identiques
Et il met en évidence le degré de similarité ou les raisons de la suggestion

##### Exemple de similarité attendue
- Entrée externe : « cc mondarverne »
- Compte CRM : « Communauté de communes Mond’Arverne Communauté »
Le système doit proposer ce compte comme candidat probable à la correspondance.

#### Scenario: Aide à la mise à jour de comptes existants
Étant donné qu’un compte externe est rapproché d’un compte existant dans le CRM
Quand l’utilisateur consulte la proposition de rapprochement
Alors le système affiche côte à côte les informations CRM et les informations externes
Et il permet de sélectionner quelles informations de la base externe doivent être utilisées pour mettre à jour le compte dans le CRM

#### Scenario: Création de nouveaux comptes à partir du rapprochement
Étant donné qu’un compte externe n’a pas de correspondance dans le CRM
Quand le rapprochement est terminé
Alors le système permet de créer de nouveaux comptes CRM à partir de ces entrées
Et il marque ces comptes comme issus d’un import externe

---

### Requirement: Intégration avec l’API BANATIC

Le système doit pouvoir interroger l’API BANATIC (via data.gouv.fr) pour récupérer des informations sur les intercommunalités et groupements.

#### Scenario: Recherche de collectivité via BANATIC
Étant donné qu’un utilisateur souhaite enrichir ou créer un compte correspondant à une collectivité ou un groupement
Quand il lance une recherche BANATIC à partir du nom, de la commune siège ou du SIREN
Alors le système interroge l’API BANATIC
Et propose une liste de résultats correspondant aux critères
Et permet de sélectionner un résultat pour pré-remplir ou mettre à jour la fiche de compte

#### Scenario: Jointure sur SIREN
Étant donné qu’un compte CRM possède un SIREN
Quand une synchronisation ou une mise à jour BANATIC est déclenchée
Alors le système utilise le SIREN pour retrouver les informations BANATIC pertinentes (nom, nature juridique, coordonnées, périmètre, compétences)
Et propose d’actualiser les champs correspondants du compte

#### Scenario: Distinction Communes / autres collectivités
Étant donné qu’un utilisateur cherche une commune, un département ou une région
Quand une recherche BANATIC est lancée
Alors le système ne tente pas de récupérer ces entités via BANATIC si elles n’y figurent pas
Et oriente si besoin vers l’API Géo INSEE (sans imposer d’implémentation dans ce socle)

---

### Requirement: Synchronisation des contacts avec l’iPhone

Le système doit permettre la synchronisation des contacts CRM avec un smartphone iPhone.

#### Scenario: Synchronisation descendante des contacts vers l’iPhone
Étant donné qu’un utilisateur a des contacts dans le CRM
Quand la synchronisation des contacts est déclenchée
Alors les contacts éligibles sont synchronisés vers l’iPhone de l’utilisateur
Et les informations principales du contact (nom, prénom, fonction, téléphone, email) sont transférées

#### Scenario: Traçage de l’origine de création du contact
Étant donné qu’un contact est créé dans le CRM
Quand ce contact est consulté
Alors le contact indique comment il a été créé :
- soit « Créé dans le CRM »
- soit « Créé via import »

#### Scenario: Actualisation depuis le CRM vers l’iPhone
Étant donné qu’un contact CRM synchronisé est modifié dans le CRM
Quand une synchronisation est relancée
Alors les modifications pertinentes sont répercutées sur le contact côté iPhone

---

### Requirement: Recherche et enrichissement LinkedIn des contacts

Le système doit pouvoir aider à retrouver la fiche LinkedIn des contacts à l’aide de l’IA.

#### Scenario: Recherche LinkedIn depuis la fiche contact
Étant donné qu’un contact n’a pas encore d’URL LinkedIn renseignée
Quand l’utilisateur clique sur le bouton de recherche LinkedIn dans la fiche contact
Alors le système utilise les informations du contact (nom, prénom, organisation, etc.)
Et lance une recherche assistée par IA
Et propose un ou plusieurs profils LinkedIn probables
Et permet de sélectionner le bon profil pour l’enregistrer dans la fiche contact

#### Scenario: Traitement de masse pour la recherche LinkedIn
Étant donné que l’utilisateur souhaite enrichir plusieurs contacts en une fois
Quand il ouvre un assistant de recherche LinkedIn de masse dans les paramètres
Alors le système lui permet de sélectionner :
- un ensemble de comptes
- et/ou un ensemble de contacts associés
Et lance une recherche assistée par IA pour ces contacts
Et propose d’enregistrer les profils LinkedIn trouvés contact par contact ou par lot

---
### Requirement: Enrichissement fiche contacts par OSINT
Sur la fiche d'un contact peut être lancer une opération d'OSINT pour compléter le champs commentaires d'informations recuillie par OSINT (recherche sur réseau sociaux, internet, annuaire, etc...)

Un bouton "OSINT" sera présent sur la fiche. Texte en VERT si l'OSINT n'a jamais été fait, Jaune s'il a déjà été effectué et qu'il s'agit de remettre à jour les informations de l'OSINT (On ne part pas de zéro dans ce cas)

---
### Requirement: Visualisation cartographique des comptes, contacts et opportunités

Le système doit proposer une vue cartographique permettant de représenter géographiquement des comptes, des contacts ou des opportunités.

#### Scenario: Affichage des entités sur une carte
Étant donné que des comptes, contacts et opportunités disposent d’informations de localisation
Quand l’utilisateur ouvre la vue carte
Alors le système affiche des marqueurs (« clous ») sur une carte pour les entités sélectionnées

#### Scenario: Différenciation par type d’entité
Étant donné que la vue carte affiche plusieurs types d’entités
Quand les marqueurs sont rendus
Alors la couleur (ou le style) des marqueurs permet de distinguer :
- les comptes
- les contacts
- les opportunités

#### Scenario: Filtrage des entités affichées
Étant donné qu’un utilisateur veut se concentrer sur un type d’entité
Quand il applique un filtre (par exemple « n’afficher que les comptes »)
Alors la carte n’affiche que les marqueurs correspondant à ce type d’entité

---

### Requirement: Gestion de listes de leads pour campagnes de démarchage

Le système doit permettre de constituer et gérer des listes de leads utilisées pour des campagnes.

#### Scenario: Création manuelle d’une liste de leads
Étant donné qu’un utilisateur souhaite préparer une campagne de démarchage
Quand il crée une nouvelle liste de leads
Alors il peut ajouter des leads un par un depuis des comptes ou des contacts existants
Et chaque lead est rattaché à la liste

#### Scenario: Création de leads à partir d’une requête
Étant donné qu’un utilisateur souhaite cibler une typologie de comptes ou de contacts
Quand il construit une requête dans le CRM (filtres, critères)
Alors il peut utiliser le résultat de cette requête pour alimenter une nouvelle liste de leads
Ou pour enrichir une liste existante

---

### Requirement: Traçabilité des activités (emails, rendez-vous, tâches) par compte, contact ou opportunité

Le système doit tracer les activités liées aux comptes, contacts et opportunités.

#### Scenario: Enregistrement manuel d’une tâche
Étant donné qu’un utilisateur crée une tâche manuelle
Quand il renseigne un titre, une description et un lien vers un compte, un contact ou une opportunité
Alors cette tâche apparaît dans la liste des activités de l’entité liée

#### Scenario: Synchronisation des emails via IMAP
Étant donné qu’une synchronisation IMAP est configurée
Quand le système analyse les emails envoyés ou reçus
Alors il associe chaque email aux contacts ou comptes correspondants lorsque l’adresse email est connue dans le CRM
Et crée des entrées d’activité liées à ces entités

#### Scenario: Exclusion des emails sans contact connu
Étant donné qu’un email est présent dans la boîte mais que l’adresse email n’est associée à aucun contact CRM
Quand la synchronisation est exécutée
Alors cet email n’est pas intégré dans les activités du CRM

#### Scenario: Synchronisation des événements d’agenda
Étant donné qu’une synchronisation d’agenda (calendrier) est configurée
Quand le système parcourt les événements passés
Alors il ajoute les rendez-vous impliquant des contacts ou comptes connus à la liste des activités de ces entités
Et il ignore les événements qui n’impliquent aucun contact ou compte connu

---

### Requirement: Recherche globale dans le CRM

Le système doit proposer une recherche globale sur l’ensemble des données CRM.

#### Scenario: Recherche globale multi-entités
Étant donné qu’un utilisateur saisit un texte libre dans la barre de recherche globale
Quand il lance la recherche
Alors le système retourne les résultats correspondants dans :
- les comptes
- les contacts
- les opportunités
- les tâches
- les notes (si gérées comme entités)

#### Scenario: Résultats groupés par type d’enregistrement
Étant donné qu’une recherche globale renvoie plusieurs types de résultats
Quand la page de résultats est affichée
Alors les résultats sont regroupés par type (compte, contact, opportunité, tâche, note)
Et l’utilisateur peut naviguer facilement d’un groupe à l’autre

---

### Requirement: API externe pour comptes, contacts, opportunités, leads et tâches

Le système doit exposer une API permettant d’interagir avec les principales entités CRM.

#### Scenario: Lecture via API
Étant donné qu’un système externe appelle l’API du CRM
Quand il demande la lecture d’un compte, d’un contact, d’une opportunité, d’un lead ou d’une tâche
Alors le CRM retourne les données de l’entité si l’appel est autorisé

#### Scenario: Création via API
Étant donné qu’un système externe appelle l’API du CRM avec des données valides
Quand il demande la création d’un compte, d’un contact, d’une opportunité, d’un lead ou d’une tâche
Alors le CRM crée l’entité correspondante
Et retourne un identifiant permettant de la retrouver

#### Scenario: Modification via API
Étant donné qu’un système externe appelle l’API du CRM avec un identifiant valide et des données de mise à jour
Quand il demande la modification d’un compte, d’un contact, d’une opportunité, d’un lead ou d’une tâche
Alors le CRM applique les modifications autorisées à l’entité

#### Scenario: Suppression via API
Étant donné qu’un système externe appelle l’API du CRM avec un identifiant valide
Quand il demande la suppression d’un compte, d’un contact, d’une opportunité, d’un lead ou d’une tâche
Alors le CRM supprime l’entité ou la marque comme supprimée selon la politique de suppression définie




### Requirement: Continuité de design avec Twenty

Le système doit faire évoluer l’interface utilisateur en continuité avec la base existante du CRM Twenty.

#### Scenario: Ajout d’une nouvelle vue ou fonctionnalité
Étant donné qu’une nouvelle vue, un nouvel écran ou un nouveau composant est ajouté
Quand il est conçu et implémenté
Alors il réutilise en priorité les composants, patterns visuels, conventions de navigation et comportements déjà présents dans Twenty
Et il n’introduit pas de rupture majeure d’expérience sans justification explicite dans une spec

#### Scenario: Refus d’une dérive de design
Étant donné qu’une proposition introduit un style visuel, une navigation ou une logique d’interaction très différente de Twenty
Quand cette proposition est évaluée
Alors elle doit être explicitement justifiée comme divergence volontaire
Et ne peut pas être implémentée sans validation préalable
