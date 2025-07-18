# PPL_Project_JobPortal_Backend
- **accounts/**: Handles user authentication, registration, and account management.
- **applicants/**: Manages applicant profiles and related operations.
- **jobs/**: Manages job postings and job-related data.
- **news/**: Handles news and updates related to the job portal.

## Getting Started

### Prerequisites

- Python 3.10+
- Django (see requirements.txt for exact version)
- SQLite (default, or configure your own database in `.env`)

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd jobboard/jobboard
    ```

2. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```

3. Set up environment variables:
    - Copy `.env.example` to `.env` and update as needed.

4. Run migrations:
    ```sh
    python manage.py migrate
    ```

5. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

6. Start the development server:
    ```sh
    python manage.py runserver
    ```

## Running Tests

To run the unit tests:
```sh
python manage.py test
