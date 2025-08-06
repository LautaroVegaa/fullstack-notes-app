📝 Notes App (Full Stack Challenge) A full-stack single-page web application for creating, editing, archiving, and categorizing notes. Developed as part of a technical challenge using a layered architecture backend and a React-based frontend.

🚀 Features ✅ Create, edit, and delete notes

📦 Archive and unarchive notes dynamically

🏷️ Categorize notes (assign and remove categories)

🔍 Filter notes by category

📄 View active or archived notes with toggle

⚡ Real-time UI updates (no full page reload)

🧠 Clean UI with dynamic form handling and editing

📦 Full backend CRUD API using a layered architecture

🧪 Built using TypeScript on both frontend and backend

🛠️ Tech Stack Frontend React + Vite + TypeScript

CSS Modules (no external styling libraries)

Custom Hooks and functional components

Backend NestJS (TypeScript)

SQLite (via Prisma ORM)

REST API (structured by service/controller layers)

📁 Project Structure bash root/ ├── backend/ # NestJS backend │ └── src/notes/ # Note & Category modules ├── frontend/ # React frontend │ ├── components/ # Reusable UI components │ ├── services/ # NoteService API handler │ └── App.tsx # Main app logic 📦 Setup Instructions

Clone the Repository bash git clone https://github.com/your-username/notes-app.git cd notes-app

Backend Setup bash cd backend npm install npx prisma migrate dev --name init npm run start This starts the NestJS backend on http://localhost:3000

Frontend Setup bash cd ../frontend npm install npm run dev This starts the frontend on http://localhost:5173

🧪 Testing the App Go to http://localhost:5173

Create a new note with title and content

Optionally assign categories

Archive/unarchive and verify section updates instantly

Filter notes by category

📖 Notes The frontend dynamically updates on note changes using local state, avoiding full-page reloads.

Archiving or unarchiving a note moves it between views instantly.

Categories are managed independently and persist across sessions.

👨‍💻 Author Name: Lautaro Vega Carignani

GitHub: @LautaroVegaa
