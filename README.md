Abi — Application Bienveillante et Inclusive

Annuaire de spécialistes de santé validés bienveillants, inclusifs et ethique, par des associations de patients et les patients eux-même.

Statut : en développement actif — Demo Day prévu le 2 juin 2026 · Soutenance RNCP6 mi-août 2026

🎯 Le problème
Trouver un professionnel de santé compétent ne suffit pas pour les personnes en situation de vulnérabilité (maladies chroniques, handicap, publics LGBTQIA+, personnes racisées, femmes…). Il n'existe pas d'annuaire structuré autour de critères éthiques validés par des associations de terrain.
Abi comble ce vide : les praticiens sont référencés et validés par des associations partenaires sur des critères transparents (consentement éclairé, inclusivité, accessibilité).

✨ Fonctionnalités
MVP (en cours)

 Page d'accueil avec recherche par spécialité et localisation
 Schémas de base de données (Drizzle ORM)
 Authentification multi-rôles (BetterAuth) — routes signin/signup
 UI des formulaires d'inscription (en cours)
 Fiches praticiens avec floutage partiel pour non-connectés
 Workflow de contribution : patient propose → validation association → publication
 Seed de démonstration (praticiens, tags, utilisateurs fictifs)

Post-MVP (soutenance août 2026)

 Tableau de bord association (modération, validation)
 Interface d'administration
 Cartographie des praticiens
 Système d'avis patients


🛠️ Stack technique: 

Framework: Next.js 15 => (App Router)SSR natif, routing file-based, 
Langage: TypeScript => Typage strict, maintenabilité.
Base de données: PostgreSQL (Neon) => Relationnel, serverless-compatible
ORM: Drizzle => Type-safe, léger, migrations versionnées
Auth: BetterAuth => Multi-rôles natif, sessions sécurisées 
Styling: Tailwind CSSv4 => Mobile-first, tokens CSS personnalisés
Déploiement: Vercel => CI/CD intégré, preview par PR
Tests: Vitest => Unit + intégration 
CI/CD: GitHub Actions => Lint, tests, déploiement automatisé

🏗️ Architecture
app/
├── (auth)/              # Groupe de routes authentification
│   ├── signup/          # Inscription multi-étapes
│   └── signin/          # Connexion
├── (public)/            # Routes accessibles sans connexion
│   └── page.tsx         # Home — recherche praticiens
├── api/
│   └── auth/            # BetterAuth handlers
lib/
├── db/                  # Drizzle schemas + connexion Neon
├── validations/         # Schémas Zod (auth, contribution)
└── utils/               # Helpers partagés
Architecture multicouche :

Présentation : composants React (App Router)
Métier : Server Actions + validation Zod
Données : Drizzle ORM → PostgreSQL Neon


🔐 Sécurité & conformité

RGPD art. 9 : données de santé — collecte minimale (pseudonyme + email uniquement), consentement explicite recueilli à l'inscription, droit à la suppression exposé dans l'interface
Hébergement UE : Neon (Frankfurt) + Vercel (Edge)
Authentification : sessions httpOnly, CSRF protection, rate limiting (BetterAuth)
Anti-bot : Cloudflare Turnstile (sans CAPTCHA visuel — accessible)
Mots de passe : 12 caractères minimum, complexité imposée côté client (Zod) et serveur
OWASP : validation entrées, pas d'exposition de données sensibles aux non-connectés (floutage praticiens)


♿ Accessibilité
Conformité RGAA (déclinaison française WCAG 2.1) — exigence explicite RNCP37873 :

Landmarks HTML5 sémantiques (<header>, <main>, <nav>)
Contrastes vérifiés AAA : #002F33 / #F9F8F1 → 13.56:1 · #F7D452 / #002F33 → 9.97:1
aria-label sur tous les boutons icône · aria-hidden sur icônes décoratives
Focus visible sur tous les éléments interactifs (RGAA 10.7)
Touch targets ≥ 44×44px (WCAG 2.5.5)
Pas de CAPTCHA visuel (Turnstile invisible)


## 📱 Screenshots

| Home — Mobile | Home — Desktop | Signup |
|---|---|---|
| ![Home mobile](doc/home_mobile.png) | ![Signup étape 1](doc/signup_step1.png) |


🚀 Installation locale
bash# Prérequis : Node.js 20+, compte Neon, compte BetterAuth

git clone https://github.com/[ton-username]/abi
cd abi
pnpm install

# Variables d'environnement
cp .env.example .env.local
# → Renseigner DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# Migrations
pnpm drizzle-kit push

# Démarrer
pnpm run dev

🗺️ Roadmap
Semaine 1-2 (mai 2026)   ✅ Setup, Home UI, Auth routes, Schemas Drizzle
Semaine 3-4 (mai 2026)   🔄 Auth UI, seed, fiches praticiens (floutage)
Semaine 5-6 (juin 2026)  ⏳ Demo Day MVP — recherche fonctionnelle
Semaine 7-12 (juin-août) ⏳ Dashboard association, admin, tests, déploiement

🎓 Contexte académique
Projet de soutenance Titre Pro CDA RNCP6 — RNCP37873 couvrant les blocs :

BC01 : interfaces utilisateur, composants métier, sécurité applicative
BC02 : architecture multicouche, modélisation BDD, accès aux données
BC03 : tests, déploiement, démarche DevOps
