# AI-Powered Code Review Assistant — Frontend

A modern frontend for an AI-powered code review platform that lets developers upload source code, explore their codebase, request structured AI-generated code reviews, browse review history, generate documentation, analyze architecture, and chat with their codebase.

The frontend is built with **Next.js 14, TypeScript, Tailwind CSS, and the App Router** and communicates with a separate NestJS backend API.

The application supports **any OpenAI-compatible AI provider** through the backend, including OpenAI, OpenRouter, Groq, LM Studio, Ollama, or a custom endpoint.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 |
| Routing | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| API Communication | REST API |
| Authentication | JWT-based authentication through backend API |
| Code Explorer | File-tree based source code explorer |
| Syntax Highlighting | Syntax-highlighted code preview |
| AI Features | Provider-agnostic through backend API |

---

## Features

### Authentication

The frontend provides the user interface for:

- User registration
- User login
- User logout
- Protected application routes
- JWT-based authenticated API requests
- Persistent authentication state

Authentication itself is handled by the backend API, while the frontend manages the authenticated user experience and communicates with protected endpoints.

---

### Projects

Users can manage their code-review projects through the frontend:

- Create projects
- View projects
- List projects
- Delete projects
- Open a project's code explorer
- Upload source-code ZIP archives
- Access project-specific reviews and AI features

Each project is scoped to the authenticated user.

---

### Code Upload

The frontend provides a ZIP upload interface for importing source-code projects.

The uploaded archive is sent to the backend API, where it is safely extracted and indexed.

The frontend then displays the resulting project structure through the Code Explorer.

> ZIP extraction and path-traversal protection are handled by the backend.

---

## Code Explorer

The Code Explorer provides an interactive way to navigate uploaded source code.

Features include:

- Folder-tree navigation
- File browsing
- File preview
- Syntax highlighting
- Project-wide file navigation
- Selecting files for AI operations
- Viewing source code before requesting a review

The explorer is designed to make large uploaded codebases easier to inspect without leaving the application.

---

## AI Code Review

The frontend provides an interface for requesting structured AI-powered code reviews.

Reviews can be performed on:

- A single file
- A selection of files
- The entire project

### Review Templates

The application supports focused review templates:

- **Security**
- **Performance**
- **Code Quality**

The selected review template determines the type of analysis requested from the AI.

The frontend displays structured review results rather than simply displaying raw model output.

Review results include:

- Summary
- Issues
- Severity
- Recommendations
- Review metadata

The actual AI request and provider communication are handled by the backend API.

---

## Review History

The frontend includes a searchable review-history interface.

Users can:

- Browse previous reviews
- Search review history
- Filter reviews
- View review details
- Navigate through paginated results

Review history can be searched using information such as:

- Summary
- Issue text
- Review mode
- Severity

Review records are persisted by the backend.

---

## AI Chat With Code

The frontend provides a chat interface for asking questions about an uploaded codebase.

Example questions include:

- How does authentication work?
- Where is the database connection configured?
- What does this service do?
- Where are API requests handled?
- How does file upload work?
- Which files are responsible for authentication?

The backend performs keyword-based context retrieval and selects the most relevant files for each question.

The frontend is responsible for:

- Chat interface
- Conversation display
- Sending questions
- Displaying AI responses
- Managing chat sessions
- Displaying conversation history

Conversation history is persisted by the backend.

---

## Documentation Generator

The application includes a documentation-generation interface.

Documentation can be generated from the uploaded project for:

- README
- Setup Guide
- API Documentation

The generated documentation is based on the actual uploaded source code.

The frontend provides the UI for selecting the documentation type, starting generation, and displaying the generated result.

---

## Architecture Analysis

The frontend also provides an interface for AI-powered architecture analysis.

Architecture analysis generates an overview of the uploaded codebase based on:

- Project file tree
- Representative source files
- Project structure
- Detected relationships between components

The generated architecture information can be used to understand how the project is organized and how its major components interact.

---

## AI Provider Configuration

AI provider configuration is available through the application's **AI Providers** interface.

The frontend allows users to configure:

- Provider name
- Base URL
- API key
- Model
- Default provider

Supported OpenAI-compatible providers include:

| Provider | Base URL | API key | Model example |
|---|---|---|---|
| OpenRouter | `https://openrouter.ai/api/v1` | Your key | `meta-llama/llama-3.1-8b-instruct:free` |
| Groq | `https://api.groq.com/openai/v1` | Your key | `llama-3.1-8b-instant` |
| LM Studio | `http://localhost:1234/v1` | None | Whatever model is loaded |
| Ollama | `http://localhost:11434/v1` | None | `llama3.1` |

A provider can be marked as the **default provider**.

Reviews, chat, documentation generation, and architecture analysis automatically use the default provider unless a specific `providerId` is supplied.

> Provider credentials are configured through the application and are handled by the backend. They should not be hardcoded into the frontend.

---

