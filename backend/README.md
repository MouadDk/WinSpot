# WinSpot Backend API

Backend Node.js/Express pour la plateforme WinSpot — un système de cashback (WinCoins) connectant des **Merchants** (restaurants, bars, boutiques…) avec des **Influenceurs**.

---

## 📁 Structure du Projet

```
backend/
├── .env                          # Variables d'environnement (NE PAS COMMITER)
├── activity.log                  # Fichier de logs Winston (généré automatiquement)
├── package.json
├── api/
│   └── webhooks/                 # (vide — le webhook est dans src/routes/)
└── src/
    ├── index.js                  # Point d'entrée — connexion MongoDB + démarrage serveur
    ├── app.js                    # Configuration Express (CORS, middlewares, routes)
    ├── config/
    │   ├── db.js                 # Connexion Mongoose à MongoDB Atlas
    │   └── logger.js             # Configuration Winston (logs dans activity.log)
    ├── middleware/
    │   └── auth.js               # Middlewares d'auth Clerk (requireAuthentication, requireRole)
    ├── models/
    │   ├── User.js               # Utilisateur synchronisé avec Clerk
    │   ├── Offer.js              # Offre de cashback
    │   ├── Mission.js            # Contrat merchant↔influencer
    │   └── Transaction.js        # Historique financier (gains/retraits WinCoins)
    └── routes/
        ├── clerkWebhook.js       # Webhook Clerk (user.created, user.updated)
        ├── health.js             # Health check
        └── protected.js          # Routes protégées par rôle
```

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** v18+
- **MongoDB Atlas** cluster (ou MongoDB local)
- **Clerk** compte avec les clés API

### Installation

```bash
cd backend
npm install
```

### Variables d'Environnement

Crée un fichier `.env` à la racine de `backend/` :

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/winspot
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

### Lancer le serveur

```bash
npm run dev       # Mode dev (auto-reload avec nodemon)
npm run start     # Mode production
```

> ⚠️ **IMPORTANT** : Assure-toi que ton IP est dans la whitelist MongoDB Atlas (Network Access → Add Current IP).

---

## 🔐 Système d'Authentification (Clerk)

### Comment ça fonctionne

Le backend utilise **Clerk** comme provider d'authentification. Voici le flux :

```
Frontend (React/Mobile)          Backend (Express)            MongoDB
       │                              │                         │
       │  1. User se connecte via     │                         │
       │     Clerk (email/Google)     │                         │
       │                              │                         │
       │  2. Clerk génère un          │                         │
       │     session token JWT        │                         │
       │                              │                         │
       │  3. Requête API avec         │                         │
       │     Bearer token ─────────►  │                         │
       │                              │  4. clerkMiddleware()   │
       │                              │     vérifie le JWT      │
       │                              │                         │
       │                              │  5. req.auth.userId     │
       │                              │     = Clerk ID ────────►│ Chercher User
       │                              │                         │ par clerkId
       │  6. Réponse ◄────────────── │  ◄──────────────────────│
```

### Middlewares disponibles dans `src/middleware/auth.js`

| Middleware | Usage | Description |
|---|---|---|
| `requireAuthentication()` | `router.get('/route', requireAuthentication(), handler)` | Vérifie qu'un token Clerk valide est présent. Pas de vérification de rôle. |
| `requireRole('merchant')` | `router.get('/route', requireRole('merchant'), handler)` | Vérifie le token + que `unsafeMetadata.role === 'merchant'` |
| `requireRole('influencer')` | `router.get('/route', requireRole('influencer'), handler)` | Vérifie le token + que `unsafeMetadata.role === 'influencer'` |

### Récupérer le Clerk ID dans un handler

```js
router.get('/example', requireAuthentication(), (req, res) => {
  const clerkUserId = req.auth.userId;   // ← Le Clerk ID
  // Utilise-le pour chercher dans MongoDB :
  // const user = await User.findOne({ clerkId: clerkUserId });
});
```

### Le pipeline de middlewares dans `app.js`

L'**ordre est critique** :

```
1. CORS
2. Webhook route (AVANT express.json — car svix a besoin du raw body)
3. express.json() + urlencoded
4. clerkMiddleware() ← injecte req.auth sur TOUTES les routes en dessous
5. Routes (health, protected)
6. Error handler global
```

---

## 📦 Modèles Mongoose

### 1. User (`src/models/User.js`)

Synchronisé automatiquement avec Clerk via webhooks.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `clerkId` | String | ✅ | ID unique Clerk (ex: `user_2abc123...`) |
| `email` | String | ✅ | Email principal |
| `firstName` | String | ❌ | Prénom |
| `lastName` | String | ❌ | Nom |
| `role` | Enum | ✅ | `'merchant'`, `'influencer'`, ou `'admin'` (default: `'influencer'`) |
| `category` | String | ❌ | **Merchants uniquement** — ex: `'Restaurant'`, `'Bar'`, `'Sport'` |
| `winCoinsBalance` | Number | ❌ | Solde WinCoins (default: `0`) |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Règles métier :**
- Le champ `category` est automatiquement mis à `null` pour les non-merchants (via hook `pre('save')`)
- La `category` provient de `publicMetadata` dans Clerk (configurée depuis le Clerk Dashboard)

---

### 2. Offer (`src/models/Offer.js`)

Offres de cashback créées par les merchants.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `merchantId` | String | ✅ | Clerk ID du merchant propriétaire |
| `establishmentName` | String | ✅ | Nom de l'établissement |
| `category` | String | ✅ | Catégorie (ex: `'Restaurant'`, `'Bar'`) |
| `description` | String | ❌ | Description de l'offre |
| `location.type` | String | ❌ | Toujours `'Point'` (GeoJSON) |
| `location.coordinates` | [Number] | ❌ | `[longitude, latitude]` |
| `location.address` | String | ❌ | Adresse textuelle |
| `location.city` | String | ❌ | Ville |
| `minConsumption` | Number | ✅ | Consommation minimum requise (≥ 0) |
| `winCoinsReward` | Number | ✅ | WinCoins gagnés (≥ 1) |
| `isActive` | Boolean | ❌ | Active ou non (default: `true`) |
| `expiresAt` | Date | ❌ | Date d'expiration |

**Index :** `2dsphere` sur `location` pour les requêtes géographiques.

---

### 3. Mission (`src/models/Mission.js`)

Contrats entre merchants et influenceurs.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `merchantId` | String | ✅ | Clerk ID du merchant |
| `influencerIds` | [String] | ❌ | Liste de Clerk IDs des influenceurs assignés |
| `description` | String | ✅ | Description de la mission |
| `subscriptionType` | Enum | ✅ | `'Basic'` ou `'Premium'` |
| `status` | Enum | ❌ | `'pending'` / `'active'` / `'completed'` / `'cancelled'` (default: `'pending'`) |
| `startDate` | Date | ❌ | Date de début |
| `endDate` | Date | ❌ | Date de fin |

---

### 4. Transaction (`src/models/Transaction.js`)

Historique financier des WinCoins.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `clerkId` | String | ✅ | Clerk ID de l'utilisateur |
| `type` | Enum | ✅ | `'gain'` ou `'retrait'` |
| `amount` | Number | ✅ | Montant (≥ 0) |
| `fee` | Number | ❌ | Frais de la transaction (default: `0`) |
| `description` | String | ❌ | Description |
| `offerId` | ObjectId | ❌ | Référence vers l'offre liée |
| `status` | Enum | ❌ | `'pending'` / `'completed'` / `'failed'` (default: `'completed'`) |

**Règle métier :**
> ⚠️ Le retrait minimum est de **20 WinCoins**. Si `type === 'retrait'` et `amount < 20`, la validation échoue automatiquement.

---

## 🪝 Webhook Clerk (`src/routes/clerkWebhook.js`)

### Endpoint : `POST /api/webhooks/user-created`

Ce webhook est appelé par Clerk à chaque événement utilisateur.

**Événements gérés :**

| Événement | Action |
|---|---|
| `user.created` | Crée un document User dans MongoDB avec les données Clerk |
| `user.updated` | Met à jour le User existant (ou le crée via upsert) |

**D'où viennent les données ?**

```
Clerk User Object
├── id                    → User.clerkId
├── email_addresses[0]    → User.email
├── first_name            → User.firstName
├── last_name             → User.lastName
├── unsafe_metadata.role  → User.role      (défini côté frontend au signup)
└── public_metadata.category → User.category (défini dans le Clerk Dashboard)
```

**Comment configurer le webhook dans Clerk :**
1. Aller dans [Clerk Dashboard](https://dashboard.clerk.dev) → Webhooks
2. Créer un endpoint : `https://ton-domaine.com/api/webhooks/user-created`
3. Sélectionner les événements : `user.created`, `user.updated`
4. Copier le "Signing Secret" dans `.env` → `CLERK_WEBHOOK_SECRET`

**Pour le dev local**, utilise [ngrok](https://ngrok.com) :
```bash
ngrok http 4000
# Puis utilise l'URL ngrok comme endpoint dans Clerk Dashboard
```

---

## 📝 Système de Logs Winston

Toutes les activités sont enregistrées dans `backend/activity.log`.

### Format des logs

```
[2026-05-04 22:15:42] [INFO] [ClerkID: user_2abc123] [Action: user.created] [Status: success] New merchant user registered
```

| Champ | Description |
|---|---|
| `timestamp` | Date et heure `YYYY-MM-DD HH:mm:ss` |
| `level` | `INFO`, `WARN`, `ERROR` |
| `ClerkID` | L'ID Clerk de l'utilisateur (ou `N/A`) |
| `Action` | Ce qui s'est passé (ex: `user.created`, `auth.roleCheck`, `server.startup`) |
| `Status` | `success`, `failed`, `denied` |
| `message` | Détails additionnels |

### Actions loguées

| Action | Quand | Fichier |
|---|---|---|
| `server.startup` | Démarrage/arrêt du serveur | `index.js` |
| `server.error` | Erreur globale non catchée | `app.js` |
| `webhook.verify` | Vérification svix échouée | `clerkWebhook.js` |
| `user.created` | Nouveau user via webhook | `clerkWebhook.js` |
| `user.updated` | Mise à jour user via webhook | `clerkWebhook.js` |
| `auth.check` | Authentification refusée | `auth.js` |
| `auth.roleCheck` | Rôle insuffisant | `auth.js` |

---

## 🧪 Comment Tester

### Test 1 : Health Check (sans auth)

```bash
curl http://localhost:4000/api/health
```

Réponse attendue :
```json
{ "status": "ok", "message": "Backend is running smoothly!" }
```

### Test 2 : Route protégée sans token (doit retourner 401)

```bash
curl http://localhost:4000/api/me
```

Réponse attendue :
```json
{ "error": "Unauthorized", "message": "Authentication required. Please sign in." }
```

### Test 3 : Route protégée avec token Clerk

Pour obtenir un token, utilise le frontend ou la Clerk API :

```bash
# Depuis le frontend React (dans la console du navigateur) :
const token = await window.Clerk.session.getToken();
console.log(token);
```

Puis :

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/api/me
```

Réponse attendue :
```json
{ "message": "Authenticated", "userId": "user_2abc123..." }
```

### Test 4 : Route protégée par rôle

```bash
# Test merchant (token d'un merchant requis)
curl -H "Authorization: Bearer <MERCHANT_TOKEN>" http://localhost:4000/api/merchant/test

# Test influencer (token d'un influencer requis)
curl -H "Authorization: Bearer <INFLUENCER_TOKEN>" http://localhost:4000/api/influencer/test
```

### Test 5 : Webhook (via Clerk Dashboard)

1. Configure le webhook dans Clerk (voir section Webhook ci-dessus)
2. Crée un nouvel utilisateur sur le frontend
3. Vérifie les logs : `type activity.log` (ou `cat activity.log` sur Mac/Linux)
4. Vérifie MongoDB : le User doit apparaître dans la collection `users`

### Test 6 : Vérifier les logs

```bash
# Windows PowerShell
Get-Content .\activity.log

# Suivre les logs en temps réel (comme tail -f)
Get-Content .\activity.log -Wait
```

---

## 📋 Routes API Existantes

| Méthode | Route | Auth | Rôle | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | ❌ | — | Health check |
| `POST` | `/api/webhooks/user-created` | ❌* | — | Webhook Clerk (vérifié par svix) |
| `GET` | `/api/me` | ✅ | Tous | Retourne le Clerk ID de l'utilisateur connecté |
| `GET` | `/api/merchant/test` | ✅ | merchant | Test d'accès merchant |
| `GET` | `/api/merchant/campaigns` | ✅ | merchant | Mock données campaigns |
| `GET` | `/api/influencer/test` | ✅ | influencer | Test d'accès influencer |
| `GET` | `/api/influencer/tasks` | ✅ | influencer | Mock données tasks |

*\* Le webhook utilise la vérification svix (pas de token Clerk)*

---

## ❌ Ce qui Manque (TODO pour le prochain développeur)

### 🔴 Priorité Haute — Routes CRUD

Il manque **toutes les routes CRUD** pour les modèles. Les modèles Mongoose existent mais aucune route n'est connectée à eux (sauf User via webhook).

**À créer :**

#### Routes Offers (`src/routes/offers.js`)
```
POST   /api/offers              → Créer une offre (merchant only)
GET    /api/offers              → Lister les offres (public ou auth)
GET    /api/offers/:id          → Détail d'une offre
PUT    /api/offers/:id          → Modifier une offre (merchant propriétaire only)
DELETE /api/offers/:id          → Supprimer une offre (merchant propriétaire only)
GET    /api/offers/nearby       → Offres par géolocalisation (query: lat, lng, radius)
```

#### Routes Missions (`src/routes/missions.js`)
```
POST   /api/missions            → Créer une mission (merchant only)
GET    /api/missions            → Lister mes missions (filtrées par rôle)
GET    /api/missions/:id        → Détail d'une mission
PUT    /api/missions/:id        → Modifier statut/description (merchant only)
POST   /api/missions/:id/assign → Assigner un influencer
DELETE /api/missions/:id        → Annuler une mission
```

#### Routes Transactions (`src/routes/transactions.js`)
```
POST   /api/transactions        → Créer une transaction (gain après cashback)
POST   /api/transactions/withdraw → Retrait WinCoins (min 20, valider le solde)
GET    /api/transactions        → Historique de l'utilisateur connecté
GET    /api/transactions/balance → Solde WinCoins actuel
```

#### Routes Users (`src/routes/users.js`)
```
GET    /api/users/me            → Profil complet depuis MongoDB
PUT    /api/users/me            → Modifier profil (ex: category pour merchant)
GET    /api/users/:id           → Profil public d'un user
```

---

### 🟡 Priorité Moyenne

| Tâche | Détails |
|---|---|
| **Controllers** | Séparer la logique métier dans `src/controllers/` au lieu de tout mettre dans les routes |
| **Validation Input** | Ajouter `express-validator` ou `joi` pour valider les body des requêtes POST/PUT |
| **Pagination** | Ajouter pagination sur les routes GET qui retournent des listes (skip/limit ou cursor) |
| **Logique WinCoins** | Implémenter la logique de gain/retrait : vérifier solde, mettre à jour `User.winCoinsBalance`, créer Transaction |
| **Offres géo** | Requête `$near` ou `$geoWithin` avec l'index 2dsphere pour `/api/offers/nearby` |
| **Upload images** | Système d'upload (Multer + Cloudinary/S3) pour les photos d'établissements |
| **Admin routes** | Routes admin pour gérer users, offres, missions (role `admin`) |

---

### 🟢 Priorité Basse

| Tâche | Détails |
|---|---|
| **Tests unitaires** | Ajouter Jest/Vitest + Supertest pour tester les routes et modèles |
| **Rate limiting** | Ajouter `express-rate-limit` pour protéger les routes |
| **CORS dynamique** | Gérer plusieurs origines (mobile, web staging, production) |
| **Swagger/OpenAPI** | Documenter l'API avec `swagger-jsdoc` + `swagger-ui-express` |
| **Docker** | Dockeriser le backend pour le déploiement |
| **CI/CD** | Pipeline GitHub Actions pour tests + déploiement auto |
| **Monitoring** | Intégrer Sentry ou similaire pour le monitoring d'erreurs en production |
| **Caching** | Ajouter Redis pour cacher les requêtes fréquentes (offres, profils) |

---

## 🔑 Concepts Clés à Comprendre

### Clerk ID vs MongoDB _id

- **Clerk ID** (`user_2abc123...`) : L'identifiant unique de Clerk, stocké dans `User.clerkId`. C'est lui qu'on récupère via `req.auth.userId`.
- **MongoDB _id** : L'ObjectId auto-généré par Mongoose. On l'utilise pour les relations internes (ex: `Transaction.offerId` → `Offer._id`).
- **Règle** : Pour lier un User à une Offer/Mission/Transaction, on utilise **toujours le Clerk ID** (pas le MongoDB _id). Ça simplifie les lookups car `req.auth.userId` donne directement le Clerk ID.

### unsafeMetadata vs publicMetadata (Clerk)

| | unsafeMetadata | publicMetadata |
|---|---|---|
| **Qui peut modifier** | Le frontend (côté client) | Seulement le backend ou Clerk Dashboard |
| **Usage dans WinSpot** | Stocker le `role` au signup | Stocker la `category` du merchant |
| **Sécurité** | ⚠️ L'utilisateur peut le modifier | ✅ Sécurisé |
| **Accès** | `sessionClaims.unsafe_metadata` | `public_metadata` (webhook) |

### Ordre des middlewares Express

```
Requête HTTP entrante
  │
  ├─► Webhook routes (raw body, pas de clerkMiddleware)
  │
  ├─► express.json()
  │
  ├─► clerkMiddleware() ← injecte req.auth
  │
  ├─► requireAuthentication() ← vérifie req.auth.userId
  │   └─► ou requireRole('merchant') ← vérifie le rôle aussi
  │
  └─► Handler de la route
```

---

## 📚 Dépendances

| Package | Version | Usage |
|---|---|---|
| `express` | ^4.21 | Framework web |
| `mongoose` | ^8.13 | ODM MongoDB |
| `@clerk/express` | ^2.1 | Middleware auth Clerk |
| `svix` | ^1.92 | Vérification signature webhook |
| `cors` | ^2.8 | Cross-Origin Resource Sharing |
| `dotenv` | ^16.4 | Variables d'environnement |
| `body-parser` | ^2.2 | Parser raw body pour webhooks |
| `winston` | ^3.x | Logging structuré |
| `nodemon` | ^2.0 | Auto-reload en dev |
