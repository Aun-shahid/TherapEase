# TherapEase

TherapEase is an AI-powered assistant designed to support psychologists and psychotherapists by streamlining their note-taking process. It listens to therapy session conversations, performs sentiment analysis, and generates structured SOAP (Subjective, Objective, Assessment, Plan) notes. It also supports Urdu-to-text transcription for Urdu-speaking clients, reducing the manual note-taking burden for therapists.

**Note:** This project is in very early development and is a proof-of-concept for our Final Year Project.

## Features

-   **AI-Powered SOAP Note Generation:** Automatically creates SOAP notes based on sentiment analysis of therapy conversations.
-   **Urdu-to-Text Transcription:** Transcribes Urdu audio into text for multilingual therapy sessions.
-   **Helper Tool for Therapists:** Simplifies manual note-taking, allowing therapists to focus on clients.

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

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions, suggestions, or feedback, open an issue on this repository or contact the maintainers.

---

TherapEase - Simplifying therapy note-taking, one session at a time!
