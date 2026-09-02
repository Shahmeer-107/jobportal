# Job Portal Platform — Backend API

A production-grade full-stack Job Portal connecting companies and job seekers, with role-based access for **Admins**, **Employers**, and **Applicants**.

Built with **Python · Django · Django REST Framework · PostgreSQL · Celery · Redis · JWT · Azure · GitHub Actions**

---

## Features

- **JWT Authentication** with OTP-based email verification and password reset
- **Role-Based Access Control (RBAC)** — Admin, Employer, and Applicant roles
- **End-to-end Job Posting & Application Workflow**
- **RESTful APIs** built with Django REST Framework
- **Async Background Tasks** via Celery + Redis (OTP emails, notifications)
- **Third-party News API Integration** for live industry updates
- **Automated Email Notification System**
- **CI/CD Pipeline** via GitHub Actions, deployed on Microsoft Azure

---

## Project Structure

```
├── accounts/       # User authentication, registration, OTP verification, password reset
├── applicants/     # Applicant profiles, job applications, and status tracking
├── jobs/           # Job postings, search, filters, and employer management
├── news/           # Third-party News API integration for live industry updates
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django, Django REST Framework |
| Auth | JWT, OTP Email Verification, RBAC |
| Async Tasks | Celery, Redis |
| Database | PostgreSQL (production), SQLite (dev) |
| Frontend | React.js, Tailwind CSS |
| Cloud | Microsoft Azure App Service |
| CI/CD | GitHub Actions |
| Email | Automated Email Notifications |

---

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL (production) or SQLite (development)
- Redis (for Celery)
- See `requirements.txt` for all dependencies

### Installation

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd jobboard
    ```

2. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

3. **Set up environment variables:**
    ```sh
    cp .env.example .env
    # Update .env with your database, Redis, email, and JWT settings
    ```

4. **Run migrations:**
    ```sh
    python manage.py migrate
    ```

5. **Create a superuser:**
    ```sh
    python manage.py createsuperuser
    ```

6. **Start Redis** (required for Celery):
    ```sh
    redis-server
    ```

7. **Start Celery worker:**
    ```sh
    celery -A jobboard worker --loglevel=info
    ```

8. **Start the development server:**
    ```sh
    python manage.py runserver
    ```

---

## Running Tests

```sh
python manage.py test
```

---

## API Overview

| Endpoint | Description |
|---|---|
| `POST /api/auth/register/` | Register with OTP email verification |
| `POST /api/auth/login/` | JWT login |
| `POST /api/auth/password-reset/` | Password reset via email |
| `GET /api/jobs/` | List all job postings |
| `POST /api/jobs/` | Create job posting (Employer only) |
| `POST /api/jobs/apply/` | Apply for a job (Applicant only) |
| `GET /api/applicants/` | List applicants (Admin/Employer only) |
| `GET /api/news/` | Live industry news |

---

## Deployment

This project is deployed on **Microsoft Azure App Service** via **GitHub Actions CI/CD pipeline**.

- Push to `main` branch triggers automated deployment
- Environment variables managed via Azure App Configuration
- PostgreSQL hosted on Azure Database for PostgreSQL

---

## License

This project is for portfolio/demonstration purposes.