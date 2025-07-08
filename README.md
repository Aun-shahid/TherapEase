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

TherapEase is in early development. Features are experimental, and improvements are ongoing. Contributions and feedback are welcome!

## Prerequisites

Before running TherapEase, ensure you have:

-   Python 3.13
-   Node.js 22.x and npm (for the test frontend)
-   pip (Python package manager)
-   A system with an internet connection for installing dependencies

## Setup and Running Instructions

### Backend Setup

The backend uses Python and FastAPI. Follow these steps:

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```
2.  **Create a Virtual Environment:**
    ```bash
    python3.13 -m venv venv
    ```
3.  **Activate the Virtual Environment:**
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```
    -   On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
4.  **Install Requirements:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run the Backend Server:**
    From the `backend` directory, start the FastAPI server using Uvicorn:
    ```bash
    uvicorn src.main:app --reload
    ```
6.  **Test the APIs (Optional):**
    Access the Swagger UI to test the APIs at:
    [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup (Optional)

The test frontend is built with React and located in `test_frontend/mindscribe`. To run it:

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd test_frontend/mindscribe
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
4.  **Access the Frontend:**
    Open your browser and navigate to the URL provided (typically `http://localhost:5173`).

Boom! The server and frontend (if set up) are now running, and you can explore TherapEase!

## Project Structure

-   `backend/`: FastAPI backend code, including AI models and API endpoints for SOAP note generation and Urdu transcription.
-   `test_frontend/mindscribe/`: React-based test frontend for interacting with the backend APIs.
-   `requirements.txt`: Python dependencies for the backend.

## Contributing

We welcome contributions! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Submit a pull request with a clear description of changes.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Support and Contact

For questions, suggestions, or feedback, open an issue on this repository or contact the maintainers.

---

TherapEase - Simplifying therapy note-taking, one session at a time!
