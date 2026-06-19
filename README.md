# Automated DevOps Workflow : CI/CD Pipeline

Ce projet met en œuvre un pipeline de **Validation Continue (CI)** entièrement automatisé via **GitHub Actions**. Il sert de "feu vert" applicatif : le code est testé sous toutes ses coutures avant d'être automatiquement conteneurisé et stocké, prêt pour le déploiement.

##  Architecture du Projet

L'application utilise une architecture découplée standard :

* **Frontend :** Une interface légère en HTML/CSS/JS Vanilla, servie par un serveur web **Nginx**.
* **Backend :** Une API REST construite avec **Node.js** (Express).
* **Base de données :** Un système de gestion de base de données relationnelle **MariaDB**.


```bash
.github
└── workflows
    └── ci.yaml
```


---

##  Le Pipeline de CI (GitHub Actions)

Le workflow est configuré dans le fichier `.github/workflows/ci.yaml` et s'enclenche automatiquement à chaque **Push** ou **Pull Request** sur la branche `main`.

Il est découpé en 4 jobs interdépendants :

![github recover](./asset_doc/pipeline.png)


### 1. 🧪 Tests Unitaires (`frontend-test` & `backend-test`)

* **Frontend :** Isolation du code client et lancement des tests avec **Jest**.
* **Backend :** Lancement des tests unitaires Node.js. Un conteneur éphémère **MariaDB** est mis à disposition via les `services` de GitHub Actions pour valider la structure initiale. Un script de sécurité (`wait-for-db.sh`) bloque le backend tant que la base n'est pas prête à accepter les connexions.

###  2. Tests d'Intégration (`integration-test`)

* Ce job ne démarre que si les deux jobs de tests unitaires précédents sont **au vert** (`needs: [frontend-test, backend-test]`).
* Il orchestre l'ensemble de l'architecture localement sur le runner GitHub à l'aide de **Docker Compose** (`docker compose up -d --build`).
* Il injecte le schéma SQL (`init.sql`) et joue les scénarios de tests de bout en bout pour s'assurer que le Frontend, le Backend et la Base de données communiquent parfaitement sans erreur réseau (Validation de la route `/health`).

###  3. Conteneurisation (`build-image`)

* C'est la récompense du pipeline. Si toute la chaîne de tests est valide, GitHub utilise **Docker Buildx** via une matrice de stratégie (`strategy: matrix`) pour compiler en parallèle les images de production du Frontend et du Backend.
* Les images sont automatiquement taguées (`latest` et `SHA du commit`) puis poussées sur le registre sécurisé de GitHub : **GHCR (GitHub Container Registry)**.


![github recover](./aset_doc/recover.png)

---

##  Lancer le projet en Local (CD Express)

Une fois que la CI a validé et publié les images sur GHCR, tu peux cloner ce projet et lancer l'application complète sur ton Mac/PC avec une seule commande.

### Prérequis

* Avoir **Docker Desktop** installé et démarré.

### Lancement

À la racine du projet, exécute :

```bash
docker compose up -d

```

### Accès aux services

* **L'application (Frontend) :** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)
* ⚙️ **L'API (Backend / Healthcheck) :** [http://localhost:3000/health](https://www.google.com/search?q=http://localhost:3000/health)

---

*Développé apar thsykas — Un workflow pour coder en toute sérénité.*