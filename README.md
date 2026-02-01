## Card Benefits Tracker (AI Agent Project)

This is a full-stack web application that helps users compare credit card rewards and benefits, estimate value based on spend, and identify optimal cards and coverage gaps.

### Key Features
- Card catalog with reward categories, perks, fees, and official references
- Spend-based optimization with monthly/yearly reward estimates
- Best-by-category winners and top recommendations
- Cheaper alternative recommendations for similar coverage
- Progressive, step-by-step UI for card selection and spend input

### AI Contribution Metrics
- Lines of code added: **18,913**
- Files changed: **95**
- Measurement: `git diff` from root commit to `HEAD`

### Time Spent
- Session 1 (bootstrapping + getting app running): **~1 hour**
- Session 2 (bug fixes + UX improvements): **~2 hours**
- Session 3 (deployment): **~20 minutes**

### Technologies Used
- **Frontend:** Angular 17, TypeScript, SCSS
- **Backend:** Java 17, Spring Boot
- **Build/Deploy:** Maven, Docker, GitHub Actions, GitHub Pages, Render
- **Data:** JSON-based catalog and DTO-driven API

### Project Phases (with key prompts)
1. **Bootstrap & Data Flow**
   - “Get the backend to serve card data and the frontend to display it.”
2. **Optimization & UX**
   - “Make it more user friendly following the Z pattern with better contrast.”
   - “Show detailed rewards, estimates, and top recommendations based on spend.”
3. **Deployment**
   - “Host frontend and backend for free (Render + GitHub Pages).”

### Future Improvements
- Audit and fine-tune reward data with verified sources
- Harden security (auth, rate limits, secrets, private endpoints)
- Improve UX further (more guidance, charts, clearer comparisons)
- Add card profiles with full details on selection
- Recommend which card to use for each category and purchase
- User profiles/login (optional) with saved preferences
- Show side-by-side deltas vs user’s current cards (savings/loss)

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
