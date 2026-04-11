🚀 CodeSphere

A full-stack developer platform that simulates real-world Git workflows with integrated issue tracking, authentication, and an AI assistant — all within a modern CLI-inspired interface.

CodeSphere is designed with a product-oriented mindset, focusing on structured backend logic, repository isolation, and scalable system architecture rather than simple UI imitation.

🌟 Overview

CodeSphere recreates core Git concepts inside a controlled backend environment while supporting multi-user collaboration, persistent commit history, and structured state transitions.

1. It demonstrates real-world backend architecture patterns such as:
2. Deterministic state management
3. Repository-level isolation
4. Secure authentication systems
5. Modular backend organization
6. Scalable database design

🔥 Features
🧠 Git Workflow Simulation Engine

CodeSphere implements a backend command-processing engine that mimics essential Git operations:

1.    Command	Description
2.    init	Initialize a new repository workspace
3.    add	Stage changes
4.    commit	Create version snapshots
5.    push	Sync local repository state to remote
6.    pull	Fetch remote updates
7.    revert	Roll back to a previous commit

Each operation triggers structured backend state transitions with persistent commit history per repository.

🗂 Multi-Repository Architecture

1. Multi-user support
2. Repository-level data isolation
3. Independent commit history storage
4. Metadata tracking (owner, timestamps, activity logs)
5. Built with scalability and clean separation of data in mind.

🐞 Issue Tracking System

1. Each repository includes a built-in issue management module:
2. Create and manage issues
3. Status-based tracking
4. Ownership assignment
5. Persistent database storage
6. Simulates real-world collaborative debugging workflows.

🔐 Secure Authentication

1. User registration & login
2. JWT-based authentication
3. Protected frontend routes
4. Backend middleware authorization
5. Designed to extend into role-based access control in future updates.

🤖 Integrated AI Assistant

1. An embedded AI support layer that:
2. Assists with debugging
3. Suggests architectural improvements
4. Provides contextual development guidance
5. Enhances productivity within the platform

🏗 Tech Stack

Frontend

1. React (Vite)
2. JavaScript
3. Tailwind CSS
4. Next.js
5. Modern animated UI
6. CLI-inspired developer theme

Backend

1. Node.js
2. Superbase
3. Express.js
4. MongoDB Atlas
5. JWT authentication


📁 Project Structure
CodeSphere/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── main.jsx

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone <repository-url>
cd CodeSphere
2️⃣ Backend Setup
cd backend
npm install
npm start

Create a .env file inside the backend folder:

PORT=8000
MONGO_URI=
JWT_SECRET=
SUPABASE_SERVICE_ROLE=
GEMINI_API_KEY=

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

CI/CD enabled via Git integration

🎯 Design Philosophy

CodeSphere is built around:

1. Structured backend state transitions
2. Clean separation of concerns
3. Product-driven architecture
4. Scalable repository isolation
5. Developer-first user experience

This project emphasizes system design clarity and production-oriented thinking.

🔮 Future Enhancements

1. Real-time collaboration via WebSockets
2. Advanced permission systems
3. Activity analytics dashboard
4. Branch simulation & merge logic
5. Performance optimizations at scale

📌 Author
Alok Verma
Full-Stack Developer
