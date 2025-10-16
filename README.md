🧡 Vanadis Hearth: Recipe Management App

Vanadis Hearth is your personal sanctuary for discovering, managing, and preserving culinary treasures.
Built with React, TypeScript, and Vite, it offers a responsive, orange-themed interface — designed for clarity, comfort, and warmth.
Data persistence and authentication are powered by Firebase Firestore.

🚀 Quick Start
Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed.

Run the Development Server

Open your terminal:

Press Ctrl + ~ (Control + tilde) in your editor,
or click “Show Terminal” in the main panel.

Start the server:

npm run dev


Open the app:

The terminal will show a local URL (e.g. http://localhost:5173).
Click it to preview the application.

🗂️ Project Structure
File / Folder	Purpose
src/App.tsx	Main application file. Contains global state, routing, Firebase initialization, and core UI components.
vite.config.ts	Configuration for the build and development environment.
package.json	Dependencies, metadata, and script definitions.
Navigating the Files

Activity Bar: Located on the far-left sidebar.

Explorer Icon: The topmost icon (stack of files).

Shortcut: Ctrl + Shift + E

⚙️ Next Steps for Development
🔸 Firebase Integration

Add the global variables __firebase_config and __initial_auth_token to App.tsx.

Establish Firebase connection and authentication flow.

🔸 Firestore Logic

Implement CRUD operations for the “My Recipes” view.

Store user data securely within each user’s Firestore path.

🔸 API Integration

Connect to TheMealDB public API for the “Discover” view.

Fetch and display external recipe data dynamically.

🧩 Tech Stack

Frontend: React, TypeScript, Vite

Backend: Firebase Firestore

UI Theme: Responsive, orange-accented minimal design

API: TheMealDB (for public recipe data)

📌 Status

🧱 Current Stage: Frontend shell complete.
Next: Core logic and data integration in progress
