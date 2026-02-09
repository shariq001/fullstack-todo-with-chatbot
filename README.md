# GIAIC Hackathon 2 - Todo AI Chatbot Project

A progressive multi-phase todo application, evolving from a CLI in-memory app to a sophisticated AI-powered chatbot with natural language processing, powered by the Model Context Protocol (MCP) and OpenAI Agents.

## Project Phases Overview

### Phase 1: CLI In-Memory Todo App
**Status**: ✅ Completed

A console-based todo application with in-memory storage built with Python.

#### Phase 1 Features
- Add new tasks with title and description
- View all tasks with their status
- Update existing tasks
- Delete tasks
- Mark tasks as complete/incomplete
- In-memory storage (data persists only during runtime)

#### Phase 1 Quick Start

**Requirements**: Python 3.13+, UV package manager (optional)

```bash
# Method 1: Direct Python execution
python run_todo_app.py

# Method 2: From src directory
cd src
python main.py
```

#### Phase 1 Menu Interface
1. **Add a new task** - Create tasks with title and optional description
2. **View all tasks** - Display all tasks with ID, status, title, and description
3. **Update a task** - Modify existing task title or description
4. **Delete a task** - Remove tasks by ID (with confirmation)
5. **Mark task as complete** - Update task status to completed
6. **Mark task as incomplete** - Update task status to pending
7. **Exit** - Quit the application

#### Phase 1 Architecture

Model-View-Controller (MVC) pattern:
- **Models** (`src/models/`): Task data model
- **Services** (`src/services/`): Business logic (TaskManager)
- **UI** (`src/ui/`): Command-line interface
- **Main** (`src/main.py`): Application entry point

#### Phase 1 Structure
```
src/
├── models/
│   └── task.py          # Task data model
├── services/
│   └── manager.py       # Task management business logic
├── ui/
│   └── cli.py           # CLI interface and menu system
├── main.py              # Application entry point
└── run_todo_app.py      # Alternative entry point
```

---

### Phase 2: Enhanced Todo App (Foundation Phase)
**Status**: ✅ Completed

Extended Phase 1 with data persistence and improved architecture.

#### Phase 2 Features
- All Phase 1 features
- Data persistence (database storage)
- Improved error handling
- Enhanced user experience

---

### Phase 3: AI-Powered Todo Chatbot with MCP & Agentic Architecture
**Status**: 🔄 In Development

A natural-language todo chatbot powered by OpenAI Agents and Model Context Protocol (MCP).

#### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Agent Framework** | OpenAI Agents SDK |
| **Protocol** | Model Context Protocol (MCP) |
| **Backend** | Python FastAPI |
| **ORM** | SQLModel |
| **Database** | Neon Serverless PostgreSQL |
| **Frontend** | OpenAI ChatKit |
| **Development** | Spec-Driven Development (Claude Code + Spec-Kit Plus) |

#### Phase 3 Architecture

```
User (OpenAI ChatKit Frontend)
    ↓
/api/chat Endpoint (FastAPI)
    ↓
OpenAI Agent (Tool Selection)
    ↓
MCP Tools (add, list, update, delete, get)
    ↓
Neon PostgreSQL Database
    ↓
Persistent Conversation History & Task Data
```

**Data Flow:**
1. User sends natural language message via ChatKit frontend
2. Frontend calls single `/api/chat` endpoint with message + user context
3. FastAPI backend loads conversation history from DB, invokes OpenAI Agent
4. Agent autonomously selects MCP tools (add, list, update, delete, get) based on intent
5. MCP server executes tools against Neon PostgreSQL with user_id validation
6. Agent formulates natural language response
7. Backend persists all messages and tool results
8. Response returned to frontend

#### Phase 3 Core Features
- **Natural Language Interface**: No command parsing required; users interact conversationally
- **MCP Server**: 5 strictly-typed tools with user_id validation:
  - `add_task` - Create new tasks
  - `list_tasks` - Retrieve all user tasks
  - `update_task` - Modify task details
  - `delete_task` - Remove tasks
  - `get_task` - Fetch specific task
- **Persistent Conversation History**: Across sessions
- **Single Endpoint Design**: All interactions through `/api/chat`
- **User Data Isolation**: At the tool level
- **AI Agent Autonomy**: Intelligently selects appropriate tools based on natural language intent

#### Phase 3 Project Structure
```
project-root/
├── backend/                    # FastAPI Application
│   ├── app/
│   │   ├── main.py            # FastAPI app initialization
│   │   ├── api/
│   │   │   └── routes.py       # API endpoints (/api/chat)
│   │   ├── models/
│   │   │   └── task.py         # SQLModel definitions
│   │   ├── services/
│   │   │   ├── agent.py        # OpenAI Agent service
│   │   │   └── mcp_client.py   # MCP client integration
│   │   └── database/
│   │       └── connection.py   # Neon PostgreSQL connection
│   └── requirements.txt        # Python dependencies
├── mcp-server/                 # MCP Server
│   ├── server.py               # MCP server implementation
│   ├── tools/
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── update_task.py
│   │   ├── delete_task.py
│   │   └── get_task.py
│   └── requirements.txt
├── frontend/                   # OpenAI ChatKit Frontend
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── components/
│   │   │   └── ChatInterface.jsx
│   │   └── index.js
│   └── package.json
├── specs/                      # Specification-Driven Development
│   └── <feature-name>/
│       ├── spec.md            # Feature requirements
│       ├── plan.md            # Architecture decisions
│       └── tasks.md           # Implementation tasks
├── history/                    # Development History
│   ├── prompts/               # Prompt History Records (PHR)
│   └── adr/                   # Architecture Decision Records
└── README.md
```

#### Phase 3 Setup & Deployment

**Backend Setup**
```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://user:pass@neon-db/dbname"
uvicorn app.main:app --reload
```

**MCP Server Setup**
```bash
cd mcp-server
pip install -r requirements.txt
python server.py
```

**Frontend Setup**
```bash
cd frontend
npm install
npm start
```

#### Phase 3 API Reference

**Endpoint**: `POST /api/chat`

**Request**
```json
{
  "message": "Add a task to buy groceries",
  "user_id": "user123",
  "session_id": "session456"
}
```

**Response**
```json
{
  "response": "I've added 'buy groceries' to your task list.",
  "tools_used": ["add_task"],
  "task_created": {
    "id": "task789",
    "title": "buy groceries",
    "status": "pending"
  }
}
```

---

## Development Methodology

The project follows **Spec-Driven Development (SDD)** with:
1. **Specification** (`spec.md`): Define user stories and requirements
2. **Planning** (`plan.md`): Architectural design and component breakdown
3. **Tasking** (`tasks.md`): Detailed implementation tasks organized by user story
4. **Implementation**: Build following the task breakdown

### Implemented User Stories

**Phase 1 & 2:**
- P1: Add New Tasks
- P1: View All Tasks
- P2: Update Task Details
- P2: Delete Tasks
- P2: Mark Tasks Complete/Incomplete

**Phase 3 (In Progress):**
- P1: Natural Language Task Creation
- P1: Conversational Task Listing
- P2: AI-Powered Task Updates
- P2: Natural Language Task Deletion
- P3: Persistent Conversation History
- P3: Multi-session Support

---

## Key Principles

✅ **User Data Isolation**: Every tool validates user_id
✅ **Natural Language First**: No manual command syntax required
✅ **Persistent State**: All conversations and tasks stored in PostgreSQL
✅ **Autonomous Agent**: OpenAI Agent intelligently selects tools
✅ **MCP Protocol**: Standardized tool execution and validation
✅ **Spec-Driven**: Architecture decisions documented in ADRs

---

## Requirements

- **Phase 1 & 2**: Python 3.13+
- **Phase 3**:
  - Python 3.13+ (Backend & MCP)
  - Node.js 18+ (Frontend)
  - PostgreSQL (Neon Serverless)
  - OpenAI API Key
  - MCP-compatible SDK

---

## Contributing

When contributing, follow the Spec-Driven Development guidelines:
1. Create feature specification in `specs/<feature-name>/spec.md`
2. Document architecture in `specs/<feature-name>/plan.md`
3. Define tasks in `specs/<feature-name>/tasks.md`
4. Create Prompt History Records (PHR) for tracking
5. Suggest ADRs for significant architectural decisions

---

## Project Repository Structure

```
Hackathon/
└── Hackathon 2/
    ├── Phase1/              # CLI In-Memory App
    ├── Phase2/              # Enhanced Todo App (Foundation)
    └── Phase3/              # AI Chatbot with MCP & Agents (Current)
        ├── backend/
        ├── mcp-server/
        ├── frontend/
        ├── specs/
        ├── history/
        └── README.md        # This file
``` 
