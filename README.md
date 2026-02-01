## Project Context for Cursor AI

This is a full-stack web application called **Card Benefits Tracker**.

### Goal
Build a scalable web application that allows users to track credit card benefits, perks, and reward categories in one centralized dashboard.

### Key Requirements
- Clean, maintainable, production-quality code
- Clear separation between frontend and backend
- RESTful API design
- Secure authentication using JWT
- Relational database design
- Strong typing (TypeScript / Java)

### Backend
- Java with Spring Boot
- Entities for User, CreditCard, Benefit, BenefitUsage
- REST endpoints for CRUD operations
- Authentication & authorization
- DTO-based request/response models

### Frontend
- Modern component-based framework (Angular or React)
- Dashboard-first UI
- Forms for adding/editing cards and benefits
- Responsive design

### Development Style
- Prefer clarity over cleverness
- Use industry best practices
- Include comments where logic is non-obvious
- Avoid overengineering early features

### Long-Term Vision
This project may evolve into a commercial product, so architecture should allow future scaling, feature expansion, and potential monetization.

### Free Hosting (Recommended)
GitHub Pages can host the Angular frontend for free, and Render can host the Spring Boot backend for free.

#### 1) Deploy Backend on Render
1. Create a free Render account.
2. New > Web Service > connect this repo.
3. Language: `Docker` (recommended)
4. Root Directory: `backend`
6. Set Environment Variables:
   - `JAVA_VERSION=17`
7. Deploy and copy the Render service URL (e.g. `https://your-service.onrender.com`).

#### 2) Point Frontend to Backend
Update the production API URL in `frontend/src/environments/environment.production.ts`:
```
apiUrl: "https://your-service.onrender.com/api"
```

#### 3) Deploy Frontend on GitHub Pages
This repo includes a GitHub Actions workflow that builds and publishes the frontend:
1. Push to the `main` branch.
2. In GitHub: Settings > Pages > Source = GitHub Actions.
3. Your site will be available at `https://<username>.github.io/<repo-name>/`.

#### Notes
- GitHub Pages is static only; the backend must be hosted elsewhere.
- CORS is configured to allow requests from any origin.
