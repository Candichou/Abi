# Abi — Application Bienveillante et Inclusive

Annuaire de professionnels de santé bienveillants, inclusifs et éthiques, recommandés par des associations de patients et par les patients eux-mêmes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?logo=postgresql&logoColor=white)
![Tests](https://img.shields.io/badge/tests-Vitest-6e9f18?logo=vitest&logoColor=white)

**🔗 Démo en ligne : [abi-care.vercel.app](https://abi-care.vercel.app/)**

> **Statut** : MVP en développement actif. Périmètre V1 = parcours **Patient** uniquement (voir [Périmètre](#périmètre)).

![Page d'accueil d'Abi : recherche par spécialité et localisation](assets/readme/home.png)

## Sommaire

- [Contexte](#contexte)
- [Aperçu](#aperçu)
- [Périmètre](#périmètre)
- [Stack](#stack)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Modèle de données](#modèle-de-données)
- [Conventions](#conventions)
- [Sécurité et conformité](#sécurité-et-conformité)
- [Tests et CI](#tests-et-ci)
- [Roadmap](#roadmap)

## Contexte

Trouver un professionnel de santé compétent ne suffit pas pour les personnes en situation de vulnérabilité (maladies chroniques, handicap, personnes LGBTQIA+, personnes racisées, femmes…). Il n'existe pas d'annuaire structuré autour de critères éthiques validés par des acteurs de terrain.

Abi référence des praticiens sur des critères transparents (consentement éclairé, inclusivité, accessibilité). Chaque fiche est proposée, puis publiée **uniquement après validation d'un administrateur**.

Projet réalisé en autonomie dans le cadre du Titre Professionnel Concepteur Développeur d'Applications (RNCP niveau 6).

## Aperçu

Résultats de recherche : chaque fiche affiche la spécialité, la ville, le tarif et le secteur, l'association qui a validé le praticien, et ses tags regroupés par catégorie (pathologie, inclusivité, pratique). Les noms sont floutés pour les visiteurs non connectés.

![Résultats de recherche avec fiches praticiens, validation par une association et tags](assets/readme/search-results.png)

## Périmètre

| | Fonctionnalité | État |
|---|---|---|
| ✅ | Recherche par spécialité et localisation (insensible aux accents) | V1 |
| ✅ | Fiches praticiens, données partiellement masquées pour les non-connectés | V1 |
| ✅ | Inscription / connexion, sessions, rate limiting | V1 |
| ✅ | Dashboard patient : praticiens sauvegardés, édition du profil, suppression du compte | V1 |
| ✅ | Seed de démonstration (praticiens, tags, associations fictives) | V1 |
| 🕓 | Parcours Association complet (profil, modération, recommandation) | V2 |
| 🕓 | Interface d'administration | V2 |
| 🕓 | Avis patients et votes sur les tags | V2 |
| 🕓 | Vérification d'email à l'inscription | V2 |
| 🕓 | Cartographie des praticiens | V2 |

**Décisions de périmètre assumées**

- **Rôle Association** : visible dans le sélecteur d'inscription (il fait partie de la proposition de valeur) mais désactivé côté UI **et refusé côté serveur**. Le parcours complet (profil, validation `pending/active/suspended`, modération) est un chantier à part entière, livré après la V1. Le schéma est déjà prêt (`associations`, `practitionerAssociations`).
- **Vérification d'email** : reportée en V2 (dépendance `resend` retirée). Elle nécessite une clé API et un domaine vérifié. Prévu : Resend en production, Mailpit en local.
- **Rôle `admin`** : le plugin `admin()` de BetterAuth réutilise la colonne `users.role`. Elle est protégée en écriture côté inscription publique (`input: false`). Avant de créer le premier compte admin, ajouter le cas `role === "admin"` dans le routing du dashboard, qui redirige aujourd'hui silencieusement vers `/`.

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | SSR natif, Server Actions, routing par fichiers |
| Langage | TypeScript | Typage strict |
| Base de données | PostgreSQL (Neon) | Relationnel, compatible serverless |
| ORM | Drizzle | Type-safe, léger, migrations versionnées |
| Auth | BetterAuth | Sessions sécurisées, plugin admin, rate limiting intégré |
| Validation | Zod 4 | Validation à l'exécution + source unique des types |
| État client | Zustand | Partage d'état entre composants sans lien parent-enfant |
| Style | Tailwind CSS 4 | Mobile-first, tokens CSS |
| Tests | Vitest | Unitaires et intégration |
| CI/CD | GitHub Actions, Vercel | Validation de PR, preview par PR |

## Démarrage rapide

**Prérequis** : Node.js 20+, [pnpm](https://pnpm.io) 10+, une base PostgreSQL [Neon](https://neon.tech) (gratuite suffit).

```bash
git clone https://github.com/Candichou/Abi.git
cd Abi
pnpm install
```

Créer un fichier `.env` à la racine :

```dotenv
# Base de données (chaîne de connexion Neon)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Auth
BETTER_AUTH_SECRET=             # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Seed uniquement : ids d'utilisateurs existants rattachés aux données de démo
ASSO_USER_ID=
ADMIN_ID=
```

Initialiser la base puis lancer l'application :

```bash
pnpm db:migrate   # applique les migrations versionnées de drizzle/
pnpm db:seed      # données de démonstration
pnpm dev          # http://localhost:3000
```

> `ASSO_USER_ID` et `ADMIN_ID` doivent référencer des lignes existantes de `users` : créez deux comptes via `/signup` avant de lancer le seed, puis copiez leurs ids.

> La recherche utilise l'extension PostgreSQL `unaccent`, activée par la migration `0006`. Sur Neon, aucune action manuelle n'est nécessaire.

## Scripts

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build et serveur de production |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (exécution unique) |
| `pnpm db:generate` | Génère une migration depuis le schéma Drizzle |
| `pnpm db:migrate` | Applique les migrations |
| `pnpm db:push` | Synchronise le schéma sans migration (dev jetable uniquement) |
| `pnpm db:seed` | Insère les données de démonstration |
| `pnpm db:reset` | Vide les tables métier (praticiens, tags, associations) |

## Architecture

Architecture en couches. Chaque couche a une responsabilité et ne dépend jamais d'une couche située au-dessus.

```
app/             Routes Next.js (App Router)
components/      Composants React (aucun accès DB)
store/           État client partagé (Zustand)
lib/             Config, validation Zod, utilitaires purs (aucun accès DB)
server/
├── db/          Connexion Drizzle → Neon, schémas, seed
├── auth/        getCurrentUser : seul point couplé à BetterAuth
├── queries/     Lectures DB
└── actions/     Server Actions (écritures, validées par Zod)
proxy.ts         Protège /dashboard/* (redirige vers /signin sans session)
drizzle/         Migrations SQL versionnées
```

**Règles de dépendance**

- `components/` ignore l'existence de la base de données.
- `server/queries/` ignore l'existence de React.
- `lib/` ne contient que de la configuration et de la validation, sans accès DB.
- Les Server Actions n'appellent jamais BetterAuth ni `next/headers` directement : elles passent par `server/auth/getCurrentUser.ts`. Changer de fournisseur d'auth ne modifie qu'un fichier.

## Modèle de données

Schémas dans `server/db/schema/` (`app.ts` : métier, `auth.ts` : BetterAuth).

**Actives en V1**

| Table | Rôle |
|---|---|
| `practitioners` | Fiche praticien, statut de modération (`pending/validated/rejected/suspended`), visibilité |
| `tags`, `practitionerTags` | Tags catégorisés (pathologie, inclusivité, accessibilité…) |
| `savedPractitioners` | Praticiens sauvegardés par un patient |
| `users`, `sessions`, `accounts`, `verifications` | BetterAuth |

**Modélisées, branchées en V2** : `associations`, `practitionerAssociations`, `tagVotes`, `reports`, `practitionerConsentRequests`, `consentLogs`. Présentes dans le schéma pour documenter l'évolution prévue, volontairement non exposées pour ne livrer aucun parcours inachevé.

Les signalements (`reports`) seront traités par modération humaine uniquement, sans masquage ni blacklist automatique, pour limiter le risque juridique (diffamation, responsabilité de plateforme).

## Conventions

**Zod pour ce qui entre, type simple pour ce qui sort**

- Une donnée qui entre (formulaire, argument de Server Action) est non fiable : elle est validée par un schéma Zod avant usage, et son type est déduit avec `z.infer`. Un seul endroit à modifier si une valeur change.

  ```ts
  // lib/validations/role.ts
  export const roleSchema = z.enum(["patient", "association"]);
  export type Role = z.infer<typeof roleSchema>;
  ```

- Une donnée qui sort d'une requête DB est déjà garantie par la requête : un simple `type` suffit (`PractitionerFull`, `SavedPractitioner` dans `server/queries/`).

**Zustand uniquement si nécessaire** : un store n'est justifié que si deux composants sans lien parent-enfant lisent ou modifient la même donnée. Sinon, `useState`. Le store `savedPractitionersStore` n'est qu'un cache côté client, synchronisé par les Server Actions et réhydraté à chaque chargement. La source de vérité reste la base.

**Point d'attention** : `users.role` est stocké en `text` (colonne gérée par BetterAuth). Zod garantit la cohérence côté application, pas contre une écriture SQL directe. Un `pgEnum` est prévu pour `practitioners.specialty`.

## Sécurité et conformité

| Sujet | Mesure |
|---|---|
| Données de santé (RGPD art. 9) | Collecte minimale (pseudonyme et email), consentement à l'inscription, suppression du compte depuis le dashboard |
| Authentification | Sessions par cookie, durée de 24 h, renouvelées toutes les heures |
| Force brute | Rate limiting BetterAuth : 3 tentatives / 10 s sur la connexion, 5 requêtes / min par défaut ailleurs |
| Mots de passe | 12 caractères minimum, majuscule, chiffre et symbole, validés côté client et serveur |
| Contrôle d'accès | `proxy.ts` sur `/dashboard/*`, validation Zod de toute entrée de Server Action, rôle Association refusé côté serveur |
| Exposition des données | Champs sensibles des praticiens masqués pour les visiteurs non connectés (`lib/privacy.ts`) |
| Hébergement | Neon et Vercel |

## Tests et CI

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Tests Vitest sur la validation des mots de passe, le masquage des données (`lib/privacy.ts`), le client d'auth, les Server Actions et les requêtes de recherche et de sauvegarde.

Le workflow [`pr.yml`](.github/workflows/pr.yml) exécute **lint → typecheck → build → tests** sur chaque Pull Request vers `main`. Il peut aussi être lancé à la main pour vérifier une branche sans ouvrir de PR :

```bash
gh workflow run pr.yml --ref <branche>
```

**Secrets GitHub requis** (Settings → Secrets and variables → Actions) :

| Secret | Pourquoi |
|---|---|
| `DATABASE_URL` | Le client Neon est instancié au chargement du module, importé par la route `/api/auth/[...all]` que Next.js analyse au build |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Lus par `betterAuth()` |
| `NEXT_PUBLIC_APP_URL` | Lue par `authClient` |

Le build n'effectue aucun appel réseau réel : des valeurs syntaxiquement valides suffisent (`http://localhost:3000` pour les URLs).

## Roadmap

- [x] Schémas Drizzle, authentification, recherche, fiches praticiens
- [x] Dashboard patient (sauvegardes, profil, suppression de compte)
- [x] Tests et CI
- [x] Déploiement sur Vercel
- [ ] **V2** : parcours Association, administration, avis patients, vérification d'email, cartographie
