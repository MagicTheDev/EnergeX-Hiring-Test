# EnergeX-AI Hiring Test – Full-Stack Developer Technical Assessment 

This project implements the **EnergeX Full-Stack Assessment**:  
A complete microservice application built with **Lumen (PHP)**, **Node.js (TypeScript)**, **Redis**, **MySQL**, and a **React frontend**. The stack is containerized with **Docker** and deployed using **Coolify**.

---

## 🚀 Live Demo

- **Frontend (React UI):** [https://energex.magicthe.dev](https://energex.magicthe.dev)  
- **Swagger API Docs (OpenAPI):** [https://energex.magicthe.dev/docs](https://energex.magicthe.dev/docs)  
- **GraphQL Playground:** [https://energex.magicthe.dev/graphql](https://energex.magicthe.dev/graphql)

---

- **Frontend (React + Vite):** SPA for registration, login, and posts.  
- **Backend #1 (Lumen, PHP):** REST API with JWT authentication, migrations, password hashing, and Redis-backed caching.  
- **Backend #2 (Node.js, TS):** GraphQL API + Swagger docs, serving posts with Redis caching.  
- **Database:** MySQL (`users`, `posts` tables).  
- **Cache:** Redis for fast retrieval of posts (with 60 second cache)  
- **Reverse Proxy:** Nginx routes `/api` → Lumen, `/graphql` + `/docs` → Node, SPA fallback for React.  
- **Deployment:** Docker + Coolify.

---

## 📦 Features
- 60 second redis cache where applicable
### Lumen API (PHP – JWT Secured)
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | `/api/register`   | Register a new user (name, email, password) |
| POST   | `/api/login`      | Authenticate and return JWT |
| GET    | `/api/posts`      | Get all posts (cached in Redis) |
| POST   | `/api/posts`      | Create a new post (JWT required) |
| GET    | `/api/posts/{id}` | Get single post (cached in Redis) |

### Node.js GraphQL
| Query | Example |
|-------|---------|
| `posts` | Fetch all posts (cached globally) |
| `post(id: ID!)` | Fetch single post (cached) |

### React Frontend
- Register & log in
- List posts.  
- Add new posts.  
- Styled with a dark UI theme.

### Testing
- **PHPUnit** for Lumen routes & auth.  
- **Jest + Supertest** for Node GraphQL API.  

---

## ⚙️ Setup & Development

### Requirements
- Docker & Docker Compose
- Node 20+ (for local frontend dev)
- PHP 8.2+ (if running Lumen outside Docker)

### Clone the repo
```bash
git clone https://github.com/your-org/energex-assessment.git
cd energex-assessment
