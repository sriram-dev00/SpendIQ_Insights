# SpendIQ Insights — Personal Financial Intelligence Platform

SpendIQ Insights is an enterprise-grade personal finance and cash flow intelligence platform. It provides automated financial analytics, real-time transaction tracking, budget caps, savings milestone tracking, and deterministic rule-based cash flow insights.

---

## 1. Project Architecture & Responsibilities

The system is architected as a decoupled client-server application:

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 19 + Vite 8)             │
│  - React Router 7 (Protected route guard & redirects)  │
│  - Zustand 5 (Client state synchronized with server)   │
│  - Recharts 3.10 (Dynamic financial visualization)     │
│  - Tailwind CSS 3.4 (Responsive theme engine)         │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (Credentials included)
                            │ REST API (/api/*)
┌───────────────────────────▼────────────────────────────┐
│                  Backend (FastAPI)                     │
│  - Argon2id Password Hashing (argon2-cffi)             │
│  - JWT Authentication (PyJWT HS256 + HttpOnly Cookies) │
│  - CSRF Defense-in-depth (Sec-Fetch-Site & Origin)     │
│  - Per-User Authorization & Multitenancy Scoping       │
│  - Pydantic v2 Input & Response Serialization          │
└───────────────────────────┬────────────────────────────┘
                            │ SQLAlchemy 2.x ORM
                            │ psycopg2-binary
┌───────────────────────────▼────────────────────────────┐
│              PostgreSQL Database Engine                │
│  - Users, Profiles, Transactions, Categories,          │
│    Budgets, Savings Goals                              │
│  - Alembic Versioned Migrations                        │
└────────────────────────────────────────────────────────┘
```

### Frontend Responsibilities
- Render interactive financial dashboards, charts, date filters, and forms.
- Synchronize state using Zustand (`useAuthStore`, `useTransactionStore`, `useBudgetStore`, `useGoalStore`, `useCategoryStore`).
- Enforce route protection via [ProtectedRoute.tsx](file:///d:/project%20dev/SpendIq_Insights/src/components/auth/ProtectedRoute.tsx), preserving target redirect paths.
- Restrict `localStorage` strictly to non-sensitive UI settings (light/dark theme toggle).
- Perform client-side rule-based financial modeling (safe-to-spend surplus calculations, discretionary savings estimates).

### Backend Responsibilities
- Serve as the single authoritative source of truth for all financial data.
- Validate incoming requests with Pydantic v2 schemas.
- Authenticate requests via HttpOnly cookies (with Bearer header support).
- Execute defense-in-depth CSRF verification on state-changing cookie requests.
- Guarantee multi-user data isolation: every query scopes records strictly to `current_user.id`.
- Recalculate category spending totals and budget usages dynamically from verified transactions.

---

## 2. Required Software & Dependencies

### System Requirements
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Python**: 3.12+ (tested on Python 3.14)
- **PostgreSQL**: 15+ (local instance or managed service)

### Backend Dependencies (`backend/requirements.txt`)
- `fastapi>=0.115.0`
- `uvicorn[standard]>=0.32.0`
- `pydantic>=2.9.0`
- `pydantic-settings>=2.5.0`
- `sqlalchemy>=2.0.35`
- `psycopg2-binary>=2.9.9`
- `alembic>=1.13.3`
- `pyjwt>=2.9.0`
- `argon2-cffi>=23.1.0`
- `python-multipart>=0.0.12`
- `pytest>=8.3.0`
- `httpx>=0.27.0`

### Frontend Dependencies (`package.json`)
- `react@^19.0.0`
- `react-dom@^19.0.0`
- `react-router-dom@^7.0.0`
- `zustand@^5.0.0`
- `recharts@^3.10.0`
- `lucide-react@^1.16.0`
- `tailwindcss@^3.4.17`
- `vite@^8.2.1`
- `typescript@~5.9.3`

---

## 3. Environment Variable Setup

Both frontend and backend utilize `.env` files for configuration. Real `.env` files are ignored by version control. Template files with placeholders are provided:

### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Fill in the parameters:
```env
# Database Connection URI (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spendiq

# JWT Security
JWT_SECRET_KEY=spendiq_super_secret_jwt_key_development_change_in_production_32b
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Frontend URL for CORS Whitelist
FRONTEND_ORIGIN=http://localhost:5173

# Environment & Cookie Settings
ENVIRONMENT=development
COOKIE_NAME=spendiq_access_token
```

### Frontend Configuration (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
```env
# Optional custom backend URL (defaults to Vite proxy at /api -> http://127.0.0.1:8000)
VITE_API_URL=
```

---

## 4. PostgreSQL Database Setup

1. Start your PostgreSQL service.
2. Create the application database:
```sql
CREATE DATABASE spendiq;
```

---

## 5. Alembic Database Migrations

Database schema versions are managed through Alembic.

To apply migrations:
```powershell
# From the backend directory
cd backend
.venv\Scripts\python -m alembic upgrade head
```

To create a new migration after schema changes:
```powershell
.venv\Scripts\python -m alembic revision --autogenerate -m "describe_changes"
```

---

## 6. Running the Application

### Starting the Backend
```powershell
cd backend
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### Starting the Frontend
```powershell
# From repository root
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 7. Testing & Build Commands

### Backend Automated Test Suite
Run the 48 comprehensive automated pytest tests:
```powershell
cd backend
.venv\Scripts\python -m pytest tests/ -v
```

### Frontend Linting
```powershell
npx oxlint
```

### Frontend TypeScript Verification & Production Build
```powershell
npm run build
```

---

## 8. Implemented API Endpoints & Authentication Flow

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account with Argon2id password hash | No |
| `POST` | `/api/auth/login` | Authenticate user, issue JWT, set HttpOnly cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & preferences | **Yes** |
| `POST` | `/api/auth/logout` | Invalidate session and clear auth cookie | **Yes** |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/transactions` | List all transactions for authenticated user | **Yes** |
| `POST` | `/api/transactions` | Record new income or expense transaction | **Yes** |
| `GET` | `/api/transactions/{id}` | Retrieve specific transaction (user-scoped) | **Yes** |
| `PUT` | `/api/transactions/{id}` | Update existing transaction | **Yes** |
| `DELETE` | `/api/transactions/{id}` | Delete transaction | **Yes** |

### Budgets (`/api/budgets`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/budgets` | List budgets with dynamic spent recalculation | **Yes** |
| `POST` | `/api/budgets` | Create spending limit for category | **Yes** |
| `PUT` | `/api/budgets/{id}` | Update allocated spending limit or period | **Yes** |
| `DELETE` | `/api/budgets/{id}` | Delete budget cap | **Yes** |

### Savings Goals (`/api/goals`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/goals` | List all savings milestones | **Yes** |
| `POST` | `/api/goals` | Create savings goal milestone | **Yes** |
| `PUT` | `/api/goals/{id}` | Update goal target or progress | **Yes** |
| `DELETE` | `/api/goals/{id}` | Delete savings goal | **Yes** |
| `POST` | `/api/goals/{id}/contribute` | Add incremental savings contribution | **Yes** |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | List system standard and custom categories | **Yes** |
| `POST` | `/api/categories` | Create custom category | **Yes** |

### Health Checks (`/api/health`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Application status & version check | No |
| `GET` | `/health/db` | Live PostgreSQL connectivity probe | No |

---

## 9. Security & Access Control Architecture

1. **Password Hashing**: Passwords are never stored in plaintext. They are hashed using `argon2-cffi` (Argon2id algorithm).
2. **Session Security**: JWTs contain an explicit 24-hour expiration (`exp`), subject claim (`sub`), and are issued in an `HttpOnly`, `SameSite=Lax` cookie.
3. **Cross-Site Request Forgery (CSRF) Defense**: For cookie-authenticated mutating requests (`POST`, `PUT`, `DELETE`, `PATCH`), the API inspects `Sec-Fetch-Site` (blocking `cross-site`) and verifies the `Origin` header against `settings.cors_origins`.
4. **Data Isolation**: All private database queries explicitly filter by `user_id == current_user.id`. Manipulation of resource IDs returns `404 Not Found`, preventing horizontal privilege escalation.
5. **Sanitization**: Password hashes, JWT secrets, and sensitive tokens are strictly excluded from all API response models.
6. **State Cleansing on Logout**: Logging out clears HttpOnly cookies on the backend and purges all Zustand stores (`useAuthStore`, `useTransactionStore`, `useBudgetStore`, etc.) on the frontend. Persistent PostgreSQL records are untouched.

---

## 10. Financial Features & Intelligence Engine

- **Cash Flow Analytics**: Calculates total income, expenses, and net savings from actual persisted user records.
- **Rule-Based Surplus Calculation**: Computes safe-to-spend surplus by factoring income, expenses, committed budget limits, and safety buffers.
- **Transparent Disclosures**: AI assistant and insight modules clearly state they are deterministic rule-based models without guaranteed financial returns.
- **Empty States**: Clean empty state placeholders guide newly registered users without displaying phantom demo values.
- **Preset Date Windows**: Preset filters (`7D`, `1M`, `3M`, `6M`, `ALL`) compute dynamically from the current date.

---

## 11. Known Limitations & Production Deployment Requirements

- **HTTPS / Secure Cookies**: In local development (`ENVIRONMENT=development`), `COOKIE_SECURE` is set to `False` to permit testing on `http://localhost`. In production, `ENVIRONMENT=production` or `COOKIE_SECURE=True` must be set alongside HTTPS reverse-proxies.
- **Database Scalability**: The current implementation connects synchronously via SQLAlchemy with connection pooling. For high-concurrency production deployments, an ASGI-native connection pooler (e.g. PgBouncer) is recommended.
- **External AI Providers**: The system currently runs deterministic rule-based financial models. If integration with an external LLM (e.g. OpenAI or Anthropic) is desired in the future, it should be connected via a secure backend proxy without storing API keys on the client.
