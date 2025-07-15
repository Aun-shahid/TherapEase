# MindScribe

MindScribe is an innovative AI-powered assistant designed to revolutionize the way psychologists and psychotherapists handle documentation and session management. By leveraging advanced artificial intelligence and natural language processing, MindScribe transforms the traditionally time-consuming task of clinical note-taking into an efficient, automated process.

The platform addresses a critical pain point in mental health practice: the administrative burden that prevents therapists from focusing entirely on their clients. MindScribe listens to therapy session conversations, performs sophisticated sentiment analysis, and generates comprehensive SOAP (Subjective, Objective, Assessment, Plan) notes that meet clinical standards. Additionally, the system provides robust multilingual support, including Urdu-to-text transcription capabilities, ensuring accessibility for diverse client populations.

This comprehensive solution empowers mental health professionals to dedicate more time to patient care while maintaining detailed, accurate clinical records that support continuity of care and treatment planning.

> **Note**: This project is currently in active development as part of our Final Year Project and represents a proof-of-concept for AI-assisted clinical documentation.

---

## Key Features

* **AI-Powered SOAP Note Generation**: Automatically creates structured clinical notes following the SOAP methodology (Subjective, Objective, Assessment, Plan) based on intelligent analysis of therapy session content.
* **Advanced Sentiment Analysis**: Employs sophisticated NLP to identify emotional patterns, therapeutic progress indicators, and significant clinical observations within session recordings.
* **Multilingual Transcription Support**: Provides accurate Urdu-to-text transcription services, enabling therapists to work effectively with Urdu-speaking clients while maintaining comprehensive documentation.
* **Clinical Workflow Integration**: Designed to seamlessly integrate into existing therapeutic workflows, reducing administrative overhead without disrupting established practice patterns.
* **Real-time Processing**: Offers immediate generation of clinical notes, allowing therapists to review and refine documentation while session details remain fresh.

---

## Project Status

MindScribe is actively under development with core functionality being implemented and tested. The system architecture is established, and primary features are in various stages of completion. Team members are encouraged to contribute to ongoing development efforts, and feedback from early testing phases is being incorporated into system improvements.

---

## Prerequisites

Ensure your system meets the following requirements:

* **Python 3.11**: Required for compatibility with dependencies and AI libraries.
* **PostgreSQL Database Server**: Needed for data persistence and session management.
* **Node.js 22.x and npm**: Required for frontend development components.
* **Git**: For repository management and collaboration.
* **Environment Configuration**: .env file with database credentials and API keys (provided separately).

---

## Backend Setup Instructions

### Database Preparation

1. Install PostgreSQL and configure with credentials matching the `.env` file.
2. Create a new database instance for MindScribe development.

### Project Configuration

1. Navigate to the `Therapease/backend/` directory.

2. Create a virtual environment:

   ```bash
   py -3.11 -m venv venv
   ```
3. Activate the virtual environment:

   * **Windows**:

     ```bash
     venv\Scripts\activate
     ```
   * **macOS/Linux**:

     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Environment Setup

* Place the `.env` file in the `Therapease/backend/` directory.
* Ensure database credentials match PostgreSQL settings.

### Database Migration
1. Navigate to `Therapease/backend/app`

2. Generate migration files:

   ```bash
   python manage.py makemigrations
   ```
3. Apply migrations:

   ```bash
   python manage.py migrate
   ```
4. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

### Server Launch

Start the development server:
fom  `Therapease/backend/app`
```bash
python manage.py runserver
```

* Backend available at: `http://127.0.0.1:8000/`
* Swagger: `http://127.0.0.1:8000/api/schema/swagger-ui/`
* Admin interface: `http://127.0.0.1:8000/admin/`

---

## Frontend Instructions

 To allow your emulator or physical device to connect to the Django backend on your local machine:

1. Open **Command Prompt (CMD)** and run:
   ```bash
   ipconfig
   ```
   Copy your IPv4 Address (e.g., 192.168.100.117).

Update the following files:

🔹 TherapEase/backend/app/app/settings.py

```bash
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "192.168.100.117"]

CORS_ALLOWED_ORIGINS = [
    "http://192.168.100.117:8081",
    "http://192.168.100.117:19006",
    "http://localhost:3000",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
]
```

and 
🔹 TherapEase/frontend/mobile/app/utils/config.ts
```bash
export const BASE_URL = 'http://192.168.100.117:8000'; // ← Replace with your IP
```


2. From the project root, open a new terminal and run:

```bash
cd frontend/mobile
```

3. In the terminal, paste the following command 

```bash
npm install
```
4. Have your emulator in Android Studio on

5. In the same terminal , paste the following the command to launch the expo development server :

```bash
npx expo start
```
Then:
Press a to open the app on an Android emulator.

And now your frontend is all setup. 

## Project Architecture

* **Backend System**: Django-based API server for AI processing, database operations, and clinical note generation.
* **Mobile Application**: React Native app for recording sessions, reviewing notes, and managing clients.
* **Web Frontend**: Web interface for practice management, detailed note editing, and admin functions.
* **Database Layer**: PostgreSQL database managing client data, session records, notes, and user auth.

---

## Development Workflow

* Use feature branches for development.
* Generate migration files for DB changes.
* Update `requirements.txt` for new dependencies.
* Keep `.env` secure and out of version control.

---

## Contributing Guidelines

* Use feature branches.
* Test changes thoroughly.
* Submit PRs with clear descriptions.
* Follow API and coding standards.
* Ensure DB changes are backward-compatible.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Support and Contact

For technical issues or setup help:

* Open an issue in the repository
* Use established communication channels for team discussions

**MindScribe** – Transforming mental health documentation through intelligent automation.
