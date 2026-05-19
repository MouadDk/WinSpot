# 🗺️ WinSpot - Architecture & User Flow Diagrams

Ce document illustre les différents parcours utilisateurs (Flows) et l'architecture technique de la plateforme WinSpot après la migration vers un système 100% propriétaire (JWT) et l'ajout de l'Intelligence Artificielle.

---

## 1. User Journey Map (Le parcours utilisateur)

```text
                                    ┌─────────────────────────┐
                                    │   LANDING PAGE (/)      │
                                    │  "Welcome to WinSpot"   │
                                    └────────────┬────────────┘
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        │                        │                        │
                        │          [Launch Campaign Button]               │
                        │                  [Explore Features Button]      │
                        │                    [Both → /choose-role]        │
                        │                                                 │
                        ▼                                                 ▼
        ┌──────────────────────────────────────────────────────────────────┐
        │          ROLE SELECTION PAGE (/choose-role)                      │
        │         "Choose Your Path" - Split Screen Gateway               │
        ├────────────────────────────┬──────────────────────────────────────┤
        │      LEFT: MERCHANTS       │      RIGHT: INFLUENCERS             │
        │   (Blue/Cyan Theme)        │     (Purple Theme)                  │
        │                            │                                     │
        │  🏢 "For Merchants"        │  ⭐ "For Influencers"              │
        │                            │                                     │
        │  [Login]  [Register]       │  [Login]  [Register]              │
        │     ▼          ▼           │    ▼          ▼                    │
        └─────┼──────────┼───────────┴────┼──────────┼────────────────────┘
              │          │                 │          │
       ┌──────▼──┐   ┌──▼──────┐   ┌─────▼──┐   ┌──▼──────┐
       │  LOGIN  │   │ REGISTER │   │ LOGIN  │   │REGISTER │
       │/merchant│   │/merchant │   │/influ..│   │/influ.. │
       │ /login  │   │/register │   │/login  │   │/register│
       └────┬────┘   └────┬─────┘   └────┬───┘   └────┬────┘
            │             │              │            │
            └─────────────┼──────────────┴────────────┘
                          │
            [Custom JWT Authentication (Backend)]
                          │
                    [Token Saved]
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
    ┌─────────────────┐           ┌──────────────────┐
    │   MERCHANT      │           │   INFLUENCER     │
    │   DASHBOARD     │           │   DASHBOARD      │
    │   (Blue Theme)  │           │  (Purple Theme)  │
    │/merchant-dash..│           │/influencer-dash..│
    │                 │           │                  │
    │  ✅ Protected   │           │  ✅ Protected    │
    │  ✅ User Data   │           │  ✅ User Data    │
    │  ✅ Topup/Offers│           │  ✅ Scan/Cashout │
    └─────────────────┘           └──────────────────┘
```

---

## 2. Component Hierarchy (Frontend Web)

```text
main.jsx
  └─ AuthContext.Provider (Gère le JWT et l'état de l'utilisateur)
      └─ BrowserRouter
          └─ App.jsx
              ├─ Public Routes
              │   ├─ LandingPage (/)
              │   └─ RoleSelection (/choose-role)
              │
              ├─ Auth Routes (Protégé: Redirige si déjà connecté)
              │   ├─ MerchantAuth (/merchant/login, /merchant/register)
              │   └─ InfluencerAuth (/influencer/login, /influencer/register)
              │
              └─ Dashboard Routes (Protégé par RoleGuard)
                  ├─ MerchantDashboard (/merchant-dashboard)
                  └─ InfluencerDashboard (/influencer-dashboard)
```

---

## 3. State Machine: Custom JWT Auth Flow

```text
[UNAUTHENTICATED]
       │
       ├─→ Can access: /, /choose-role, Auth pages
       │
       ├─→ Cannot access: /merchant-dashboard, /influencer-dashboard
       │   (AuthContext & RoleGuard blocks these)
       │
       └─→ Visit Auth Page & Complete Signup/Login
                     │
                     ▼
        ┌───────────────────────────────┐
        │  BACKEND PROCESSES (/api/auth)│
        │  - Hash password (Bcrypt)     │
        │  - Check Database (MongoDB)   │
        │  - Generate JWT Token         │
        └───────────────────────────────┘
                     │
                     ▼
        [Token stored in localStorage]
                     │
             [RoleGuard checks role]
                     │
             ├─ Merchant: /merchant-dashboard
             │
             └─ Influencer: /influencer-dashboard
                     │
                     ▼
[AUTHENTICATED + IN DASHBOARD]
       │
       ├─→ API Calls include: `Authorization: Bearer <token>`
       │
       └─→ Click Logout → Clear localStorage
                     │
                     ▼
            [Back to UNAUTHENTICATED]
```

---

## 4. Admin Dashboard Flow (Control Center)

```text
[ADMIN LOGIN] (Mot de passe stocké dans le .env)
       │
       ▼
[ADMIN DASHBOARD (Port 5176)]
       │
       ├─→ [Onglet: Merchants]
       │     └─ Voir la liste, Supprimer des comptes, Faire des "Top Up" (Injecter WinCoins)
       │
       ├─→ [Onglet: Influencers]
       │     └─ Voir la liste, Supprimer des comptes, Vérifier le solde
       │
       └─→ [Onglet: Cashouts] (Demandes de retraits)
             │
             ├─→ Approuver ✅ → L'admin a fait le virement bancaire, la transaction passe à "completed".
             │
             └─→ Rejeter ❌ → La transaction passe à "failed", les WinCoins sont remboursés à l'influenceur.
```

---

## 5. O2O Loop & AI Verification Flow (Le Coeur de l'App)

```text
ÉTAPE 1 : VISITE PHYSIQUE (O2O)
┌────────────────┐          ┌────────────────┐
│ INFLUENCER APP │          │ MERCHANT APP   │
│ Génère QR Code │ ───────▶ │ Scanne QR Code │
│ (Mission ID)   │          │ via Dashboard  │
└────────────────┘          └────────────────┘
                                    │
                                    ▼
ÉTAPE 2 : LA PREUVE SOCIALE (Vérification IA)
┌────────────────────────────────────────────────────────┐
│ INFLUENCER publie une Story Instagram avec le @tag     │
│ et connecte son compte via Facebook/Instagram Graph    │
└────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND WINSPOT                                        │
│ - Récupère l'image de la Story via l'API Instagram     │
│ - Envoie l'image à l'IA (Vision/NLP)                   │
│ - IA check : "Présence du produit ?" "Cadre luxueux ?" │
└────────────────────────────────────────────────────────┘
                                    │
                                    ▼
ÉTAPE 3 : LE CRON JOB (Les 24h)
┌────────────────────────────────────────────────────────┐
│ 23h55 plus tard, le serveur interroge l'API Instagram  │
│ La story est-elle toujours là ?                        │
│                                                        │
│ ❌ NON = Mission annulée, pénalité.                    │
│ ✅ OUI = Mission validée, WinCoins transférés !        │
└────────────────────────────────────────────────────────┘
```

---

## 6. Route Protection Logic (RoleGuard)

```text
┌─ / ────────────────────────── PUBLIC
│
├─ /choose-role ─────────────── PUBLIC
│
├─ /merchant/login ──────────── Redirect to dashboard if already logged in
│
├─ /merchant-dashboard
│  └─ <RoleGuard allowedRole="merchant">
│      └─ Vérifie que l'utilisateur a un JWT valide ET que role === 'merchant'
│
├─ /influencer/login ────────── Redirect to dashboard if already logged in
│
├─ /influencer-dashboard
│  └─ <RoleGuard allowedRole="influencer">
│      └─ Vérifie que l'utilisateur a un JWT valide ET que role === 'influencer'
│
└─ * (any other route) ──────── Redirect to home
```

---

## 7. Sécurité & Performances Implémentées

- ✅ **Custom JWT Auth** : Indépendant des services tiers (Clerk), jetons signés cryptographiquement.
- ✅ **Bcrypt Hashing** : Mots de passe illisibles même en cas de fuite de base de données.
- ✅ **Role-Based Access Control (RBAC)** : Middleware backend (`auth.js`) et frontend (`RoleGuard.jsx`) pour séparer strictement marchands et influenceurs.
- ✅ **Lazy Loading** : Composants React chargés à la demande (React Router v7).
- ✅ **CORS Management** : API accessible uniquement par les domaines autorisés (localhost:5173, 5174, 5176).
- ✅ **Admin Hardcoded Secret** : Panneau d'administration doublement sécurisé (`x-admin-secret`).

**Le flow est désormais complet, souverain, prêt à encaisser de la charge et équipé pour l'Intelligence Artificielle ! 🚀**
