# 🎯 To-Do List : Finalisation du MVP Pub2Win

Maintenant que le cœur de notre système (Custom JWT + MongoDB) est parfaitement en place, voici ce qu'il reste à construire pour avoir une plateforme 100% fonctionnelle de A à Z.

## 🔴 Priorité Haute (Le Cœur du Produit)

- [ ] **Connecter les Dashboards à l'API**
  - Actuellement, `RestaurantDashboard` et `InfluencerDashboard` affichent de fausses données (mock data).
  - *Action :* Remplacer ces fausses données par des appels `fetch` vers notre backend (ex: `/api/offers`, `/api/transactions/balance`) en utilisant le token JWT dans les headers (`Authorization: Bearer <token>`).

- [ ] **Création d'Offres & Upload d'Images**
  - Le Merchant doit pouvoir créer de vraies offres avec de belles photos.
  - *Action :* Créer le formulaire de création d'offre côté frontend, et intégrer **Cloudinary** (ou AWS S3) côté backend pour stocker les images uploadées.

- [ ] **Le Système de QR Code (O2O Loop)**
  - C'est la fonctionnalité phare du projet : l'influenceur va au restaurant, génère un QR code sur son app, et le restaurateur le scanne pour valider la visite et envoyer les WinCoins.
  - *Action :* Implémenter la génération de QR code dynamique (Frontend) et l'endpoint de vérification/paiement automatique (Backend).

- [ ] **🤖 Vérification IA des Stories (Instagram Graph API + NLP)**
  - C'est la solution 100% automatique pour les influenceurs (comptes Créateurs/Business).
  - *Action (Frontend)* : Intégrer le "Facebook Login" pour que l'influenceur connecte son compte Instagram à Pub2Win.
  - *Action (Backend)* : 
    - Écouter l'API Instagram pour récupérer l'image de la story lorsqu'elle est publiée.
    - Envoyer l'image à une IA (ex: GPT-4 Vision ou Gemini) pour analyser le visuel (ex: "est-ce un burger luxueux ?").
    - Mettre en place un **Cron Job** (tâche planifiée) qui s'exécute 23h55 plus tard pour vérifier via l'API si la story est toujours en ligne.
    - Si la story a été supprimée prématurément, annuler la mission et pénaliser l'influenceur (pas de WinCoins).



## 🟢 Priorité Basse (Mobile & Finitions)

- [ ] **Migration de l'Application Mobile**
  - L'application React Native utilise encore les traces de Clerk.
  - *Action :* Mettre à jour les requêtes réseau de l'app mobile pour qu'elles utilisent le système de connexion classique avec JWT.

- [ ] **Affinement du Design & Micro-animations**
  - S'assurer que le mode Sombre/Clair est parfait partout et ajouter des feedbacks visuels (toasts/notifications) quand une action réussit ou échoue.
