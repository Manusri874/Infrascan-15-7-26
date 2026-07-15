**Running the Project**

The frontend and backend must be started in two separate terminals.

**Step 1: Start the Backend**
1. Open a terminal.
2. Navigate to the backend folder.

***cd backend***
3. Activate the virtual environment.

Windows
***.\venv\Scripts\activate***

macOS/Linux
***source venv/bin/activate***

4. Start the Flask server.
***python app.py***

If the backend starts successfully, you should see something similar to:
* Running on http://127.0.0.1:5000

Keep this terminal running.

**Step 2: Start the Frontend**
1. Open a new terminal.
2. Navigate to the project root directory (the folder containing package.json).
***cd InfraScan***
   
3. Start the Vite development server.
***npm run dev***

You should see output similar to:

Local: http://localhost:5173/

Open this URL in your web browser.

