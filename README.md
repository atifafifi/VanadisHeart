Vanadis Hearth: Recipe Management App

Welcome to Vanadis Hearth, your personal sanctuary for finding, managing, and preserving culinary treasures. This project is built using React, TypeScript, and Vite, with data persistence managed by Firebase Firestore.

The current application is focused on a responsive, orange-themed frontend shell, ready for the core logic integration.

🚀 Quick Start (Running the Project)

This project requires Node.js and npm (or yarn/pnpm).

Open the Terminal:

The fastest way to open the integrated terminal is by pressing the keyboard shortcut: Ctrl + ~ (Control key and the tilde key).

Alternatively, look for the "Show Terminal" link in the center of the main editor panel and click it.

Start the Development Server:

Once the terminal is open, run the following command:

npm run dev


View the App:

The terminal output will provide a local URL (e.g., http://localhost:5173). Click this link to open the application preview.

📂 Project Structure & Navigation

The primary components for this application are located here:

File/Folder

Purpose

src/App.tsx

Main Application File. Contains all state, routing logic, Firebase initialization, and primary UI components.

vite.config.ts

Configuration file for the build and development process.

package.json

Project dependencies and script commands.

Accessing Files (The Explorer View)

To see and navigate the file structure:

Access the Activity Bar: Look at the far left vertical column of icons.

Click the Explorer Icon: Click the topmost icon, which looks like a stack of files.

Keyboard Shortcut: Ctrl + Shift + E

✅ Next Steps for Development

Our immediate focus is integrating the backend to make the app functional:

Firebase Initialization: Integrate the global __firebase_config and __initial_auth_token into App.tsx to establish the connection and authenticate the user.

Firestore Logic: Implement the CRUD (Create, Read, Update, Delete) operations for the "My Recipes" view, storing private data in the user's Firestore path.

TheMealDB Integration: Implement the public API calls for the "Discover" view to fetch external recipe data.
