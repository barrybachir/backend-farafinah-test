# Backend Test - API Users/Auth

API REST en TypeScript avec Express, Prisma (SQLite), JWT et documentation Swagger. Dans le cadre de l'evaluation technique pour Farafinah

## Stack technique

- Node.js + TypeScript
- Express 5
- Prisma ORM + SQLite
- Authentification JWT (`jsonwebtoken`)
- Upload de fichier (`multer`)
- Documentation OpenAPI/Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Tests API basiques (`vitest`, `supertest`)

## Choix techniques

- **Express**: framework minimal et rapide pour exposer des endpoints REST.
- **Prisma**: accès type-safe a la base de donnees et integration simple avec SQLite.
- **SQLite**: base legere, ideale pour un projet local et des tests rapides.
- **JWT**: authentification stateless adaptee aux APIs.
- **Swagger**: documentation interactive utile pour tester les routes sans outil externe.
- **Vitest + Supertest**: tests rapides des endpoints HTTP sans lancer un vrai serveur reseau.

## Prerequis

- Node.js 18+ recommande
- npm

## Configurer les variables d’environnement

Créer un fichier .env à la racine et coller ce qui suit :
DATABASE_URL="file:./dev.db"
JWT_SECRET="change_me_in_production"
PORT=9090


## Installation

```bash
npm install
```

## Variables d'environnement

Creer/adapter le fichier `.env` a la racine:

```env
PORT=9090
DATABASE_URL="file:./dev.db"
JWT_SECRET="change_me_please"
```

## Commandes utiles

- Lancer en developpement:

```bash
npm run dev
```

- Generer le client Prisma:

```bash
npx prisma generate
```

- Executer les tests:

```bash
npm test
```

- Lancer les tests en mode watch:

```bash
npm run test:watch
```

## Documentation API

- Swagger UI: [http://localhost:9090/docs/](http://localhost:9090/docs/)

## Routes principales

### Auth

- `GET /api/auth` - verification de disponibilite de la route auth
- `POST /api/auth` - login utilisateur (retourne `accessToken`)

### Users

- `GET /api/users/generate?count=5` - genere des utilisateurs fictifs
- `GET /api/users/me` - profil utilisateur connecte (token requis)
- `GET /api/users/:username` - consulter un utilisateur (token requis)
- `POST /api/users/batch` - import d'utilisateurs via fichier JSON (`multipart/form-data`, champ `file`)

## Exemples de requetes

### 1) Login

```bash
curl -X POST http://localhost:9090/api/auth \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"secret123\"}"
```

Exemple de reponse:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2) Profil courant (`/me`)

```bash
curl http://localhost:9090/api/users/me \
  -H "Authorization: Bearer <TOKEN_JWT>"
```

### 3) Utilisateur par username

```bash
curl http://localhost:9090/api/users/johndoe \
  -H "Authorization: Bearer <TOKEN_JWT>"
```

### 4) Import batch JSON

```bash
curl -X POST http://localhost:9090/api/users/batch \
  -F "file=@users.json"
```

## Structure du projet 

```txt
src/
  app.ts
  server.ts
  controllers/
    auth.controller.ts
    users.controller.ts
  routes/
    auth.routes.ts
    users.routes.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    upload.middleware.ts
  docs/
    swagger.ts
  utils/
    prisma.ts
prisma/
  schema.prisma
tests/
  auth.routes.test.ts
  users.routes.test.ts
```

## Notes

- Les routes protegees attendent un header:
  - `Authorization: Bearer <token>`

