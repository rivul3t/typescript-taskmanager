🧰 Team projects api

A RESTful API for managing users, projects, tasks.

⚙️ Tech Stack

    Node.js

    Express.js

    PostgreSQL

    Prisma

    TypeScript

📦 Requirements

    Node.js ≥ 16

    npm

    PostgreSQL

🚀 Getting Started

Clone the repository

    git clone https://github.com/rivul3t/typescript-taskmanager.git
    cd typescript-taskmanager

Install dependencies

    npm install

Configure environment variables

    cp .env.example .env

Run migrations / seed database

    npx prisma migrate dev

Start the server

    npm run build
    npm start

🔐 Environment Variables

Example .env:

PORT=8888
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=number_of_rounds

📖 API Documentation

    Postman Collection: Coming soon

📖 API Endpoints

🔐 Users  
| Method | Endpoint | Description | Body (JSON) |
| ------ | --------------------- | ------------- | --------------------------------------------------------- |
| POST | `/api/users/register` | Register user | `{ "name": "user", "email": "user", "password": "1234" }` |
| POST | `/api/users/login` | Login | `{ "name": "user", "password": "1234" }` |

📁 Projects  
| Method | Endpoint | Description | Body (JSON) |
| ------ | ---------------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| GET | `/api/projects` | Get your projects | – |
| POST | `/api/projects` | Create new project | `{ "name": "project", "description": "project" }` _(optional `description`)_ |
| GET | `/api/projects/:projectId` | Get project by ID | – |
| POST | `/api/projects/:projectId/members` | Add member to project | `{ "user_id": "14" }` |

📁 Tasks
| Method | Endpoint | Description | Body (JSON) |
| ------ | ------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| POST | `/api/projects/:projectId/tasks` | Add task to project | `{ "name": "task", "description": "test task", "due_date": "YYYY-MM-DD" }` _(optional `description`)_ |
| GET | `/api/projects/:projectId/tasks` | Get project tasks | – |
| GET | `/api/projects/:projectId/tasks/:taskId` | Get task by ID | – |
| PATCH | `/api/projects/:projectId/tasks/:taskId/assign` | Assign task | – _(или укажи, если нужно тело запроса)_ |
| PATCH | `/api/projects/:projectId/tasks/:taskId/complete` | Complete task | – |

📂 Project Structure

.  
├── src/  
│ ├── controllers/  
│ ├── routes/  
│ ├── middleware/  
│ ├── lib/  
│ ├── services/  
│ ├── utils/  
│ └── main.ts  
├── prisma/
│ └── schema.prisma  
├── tests/  
├── .env.example  
├── .env  
├── package.json  
└── tsconfig.json

🧪 Testing

    npm run test
