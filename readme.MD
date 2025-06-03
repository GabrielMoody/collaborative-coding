# Collaborative Coding

Collaborative Coding is a real-time, multi-user code editor and project management platform inspired by VS Code. It allows multiple users to work together on coding projects, manage files and folders, and collaborate seamlessly with live updates.

## Features

- **Real-time Collaborative Editing:** Multiple users can edit the same file simultaneously with changes synced instantly using ShareDB and WebSockets.
- **Project Management:** Create, open, and manage multiple coding projects.
- **File & Folder Explorer:** Create and delete files and folders in a project, similar to a file manager.
- **User Authentication:** Secure login with JWT-based authentication.
- **Collaborator Management:** Invite users to projects.
- **Syntax Highlighting:** Monaco Editor provides syntax highlighting for multiple languages.
- **Context Menus:** Right-click on files/folders for quick actions (create, rename, delete).
- **Backend with Node.js, Express, MongoDB:** Robust REST API and real-time backend.

![](Collaborative%20Coding.gif)

## Tech Stack

- **Frontend:** React, Next.js, Monaco Editor, Tailwind CSS
- **Backend:** Node.js, Express, WebSocket
- **Database:** MongoDB, ShareDB
- **Authentication:** JWT (JSON Web Token)
- **Real-time:** ShareDB, Reconnecting WebSocket

## Getting Started

### Prerequisite

- Node v22+
- MongoDB 

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/collaborative-coding.git
   cd collaborative-coding
   ```

2. **ENV Variable Setup**
   
   On ``backend/.env`` change MONGO_URL variable with your mongodb url
   ```env
    MONGO_URI = "mongodb://localhost:27017/mydatabase"
   ```

3. **Run the backend**

    Backend will run on port 8000
    ```bash
    cd backend
    npm install
    npm run start
    ```
4. **Run the frontend**

    ```bash
    cd ../frontend # If you still on the backend folder
    npm install
    npm run dev
    ```
5. **Go to http://localhost:3000**

## Notes

This project is still a work in progress and not yet perfect. There are features that can be improved or added, and contributions are very welcome! If you have ideas, suggestions, or want to help develop new features, feel free to open an issue or submit a pull request.
