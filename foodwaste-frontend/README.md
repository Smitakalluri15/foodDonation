# FoodShare — Food Waste Donation Platform

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Toastify
- **Backend**: Spring Boot 3, Spring Security, JPA/Hibernate, JWT
- **Database**: MySQL 8

---

## Getting Started

### 1. Database
```sql
CREATE DATABASE foodwaste_db;
```
Or just run the backend — it auto-creates the DB via `createDatabaseIfNotExist=true`.

---

### 2. Backend (Spring Tool Suite)
1. Open STS → `File > Import > Existing Maven Projects` → select `foodwaste-backend/`
2. Edit `src/main/resources/application.properties`:
   ```
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Right-click project → `Run As > Spring Boot App`
4. Backend runs at `http://localhost:8080`

---

### 3. Frontend (React)
```bash
cd foodwaste-frontend
npm install
npm start
```
App runs at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Donations (Donor)
| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/api/donations/add` | DONOR |
| GET | `/api/donations/my` | DONOR |
| PUT | `/api/donations/{id}` | DONOR |
| PATCH | `/api/donations/{id}/cancel` | DONOR |

### Donations (NGO)
| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/api/donations/available?city=X` | AUTH |
| POST | `/api/donations/{id}/claim` | NGO |
| GET | `/api/ngo/tasks` | NGO |

### Volunteer
| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/api/volunteer/tasks/open` | VOLUNTEER |
| POST | `/api/volunteer/tasks/{id}/accept` | VOLUNTEER |
| POST | `/api/volunteer/tasks/{id}/complete` | VOLUNTEER |
| GET | `/api/volunteer/tasks/my` | VOLUNTEER |

---

## User Roles

| Role | Can Do |
|------|--------|
| **DONOR** | Post donations, edit/cancel own donations |
| **NGO** | Browse available food, claim donations |
| **VOLUNTEER** | Accept pickup tasks, mark tasks complete |

---

## Project Structure

```
foodwaste-frontend/
├── src/
│   ├── components/       Navbar, Footer, DonationCard, ProtectedRoute
│   ├── context/          AuthContext (JWT + user state)
│   ├── pages/            Home, Login, Register, Dashboards, Forms
│   ├── services/         api.js (axios), authService, donationService
│   └── utils/            helpers (format, badges, error handling)
```
