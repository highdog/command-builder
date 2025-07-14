# Gemini Project Information

This file provides context for the Gemini AI assistant to understand and work with this project.

## Project: docqa

This appears to be a Node.js web application that allows users to ask questions about documents.

### Key Technologies:

*   **Backend:** Node.js, Express
*   **Database:** SQLite (`db.sqlite`)
*   **Document Parsing:** `pdf-parse` for handling PDF files.
*   **Frontend:** HTML, CSS (in `public/`)

### Project Structure:

*   `server.js`: The main Express server file.
*   `database.js`: Handles database connections and queries.
*   `seed.js`: Populates the database with initial data.
*   `documents.pdf`: The source document for the Q&A.
*   `public/`: Contains the frontend files.
*   `Mobile.md`, `Mobile-zh-CN.md`: Markdown files, possibly for documentation or content.

### Instructions for Gemini:

*   When working with the database, use the functions in `database.js`.
*   The main application logic is in `server.js`.
*   Frontend files are served from the `public` directory.
