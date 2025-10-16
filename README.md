# Convex Todo App

A minimal, user-friendly todo list application built with modern web technologies. Users can authenticate via email/password, create tasks, mark them as complete or incomplete, and delete them. Each user has a private todo list visible only to them.

## 🏗️ Architecture

This project follows the **four-layer Convex architecture pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations with typed functions
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations (if needed)
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions

## 🧰 Tech Stack

### Backend
- **Convex** - Backend-as-a-Service with real-time database
- **Better Auth** - Modern authentication with email/password
- **Rate Limiter** - API endpoint protection
- **Agent** - AI assistant orchestration
- **Resend** - Transactional email sending

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible React components
- **Radix UI** - Unstyled, accessible primitives

## 📦 Detected Convex Components

This project uses the following Convex Components:

### ✅ Better Auth (`@convex-dev/better-auth`)
- **Purpose**: User authentication and session management
- **Features**: Email/password authentication, JWT tokens, secure session handling

### ✅ Rate Limiter (`@convex-dev/rate-limiter`)
- **Purpose**: Protect API endpoints from abuse
- **Features**: Token bucket and fixed window algorithms, per-user rate limiting

### ✅ Agent (`@convex-dev/agent`)
- **Purpose**: AI agent orchestration and multi-step reasoning
- **Features**: Conversation threads, message history, AI-powered task assistance

### ✅ Resend (`@convex-dev/resend`)
- **Purpose**: Send transactional emails
- **Features**: Welcome emails, task reminders, email notifications

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Convex Account** ([Sign up](https://convex.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jn7agm02tf5q7xnzs3esvhz0c97sknhc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex project (or link to existing)
   - Generate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
   - Start the Convex development server

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and fill in the required values:
   - `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `RESEND_API_KEY` - Get from [resend.com](https://resend.com/)
   - `OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/)

5. **Install Convex Components**
   ```bash
   npx convex components install @convex-dev/better-auth --save
   npx convex components install @convex-dev/rate-limiter --save
   npx convex components install @convex-dev/agent --save
   npx convex components install @convex-dev/resend --save
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

   This runs both Convex and Next.js concurrently.

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Development Scripts

```bash
# Start both Convex and Next.js
pnpm dev

# Start only Next.js
pnpm web:dev

# Start only Convex
pnpm convex:dev

# Build for production
pnpm build

# Run setup (install + initialize Convex)
pnpm setup

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 🗂️ Project Structure

```
.
├── convex/                    # Convex backend
│   ├── schema.ts             # Database schema
│   ├── convex.config.ts      # Component configuration
│   ├── auth.ts               # Better Auth setup
│   ├── http.ts               # HTTP routes
│   ├── db/                   # Database layer (Phase 2)
│   ├── endpoints/            # Endpoint layer (Phase 2)
│   ├── workflows/            # Workflow layer (Phase 2)
│   └── helpers/              # Helper utilities (Phase 2)
├── apps/
│   └── web/                  # Next.js frontend (Phase 2)
│       ├── app/              # Next.js App Router
│       ├── components/       # React components
│       ├── lib/              # Utilities & auth clients
│       └── providers/        # React context providers
├── packages/                 # Shared packages (optional)
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # pnpm workspace config
└── README.md                 # This file
```

## 🔐 Authentication

This app uses **Better Auth** with the Convex plugin. Key features:

- **Email/Password**: Users sign up and log in with email/password
- **JWT Tokens**: Sessions are managed with JWT tokens (30-day expiration)
- **User Scoping**: All operations are automatically scoped to the authenticated user
- **No Email Verification**: Disabled for development (enable in production)

## 🛡️ Rate Limiting

Rate limiting is configured for all mutation endpoints:

- **Create Task**: 10 requests/minute (burst capacity: 3)
- **Update Task**: 50 requests/minute
- **Delete Task**: 30 requests/minute

## 🤖 AI Assistant

The app includes an AI-powered assistant (using Agent component) for:

- Task creation suggestions
- Task prioritization advice
- Deadline recommendations
- Natural language task input

## 📧 Email Notifications

The app can send emails via Resend for:

- Welcome emails on signup
- Task deadline reminders
- Weekly task summaries

## 🎨 Design System

The app uses a custom design system based on the provided theme:

- **Primary Color**: Indigo (#6366f1)
- **Font**: Inter Variable
- **Tone**: Neutral
- **Density**: Balanced
- **Components**: shadcn/ui + Radix UI

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 🚢 Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

### Deploy Next.js Frontend

Deploy to Vercel, Netlify, or any hosting platform that supports Next.js.

**Environment Variables**: Make sure to set all variables from `.env.local.example` in your hosting platform.

## ✅ Implementation Status

- ✅ **Phase 1**: Infrastructure setup complete
  - Schema defined (tasks, threads, messages)
  - Components configured (Better Auth, Rate Limiter, Agent, Resend)
  - Environment variables documented

- ✅ **Phase 2**: Implementation complete
  - Database layer implemented (`convex/db/`)
  - Endpoint layer implemented (`convex/endpoints/`)
  - Helper layer implemented (`convex/helpers/`)
  - Component configuration (rateLimiter, agent, email)
  - Next.js app structure complete
  - Authentication pages (login/signup)
  - Main todo list interface with dashboard

## 🎯 What's Working

- ✅ User authentication (signup/login/logout)
- ✅ Create tasks with title, description, priority, due date
- ✅ View all tasks with filtering (all/active/completed)
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Dashboard with statistics and recent tasks
- ✅ Real-time updates across all users
- ✅ Rate limiting on all operations
- ✅ Input validation and error handling

## 🚧 Future Enhancements

1. **AI Assistant Integration**: Wire up the Agent component for chat-based task management
2. **Email Notifications**: Implement reminder emails and weekly digests
3. **Task Editing**: Add inline editing for tasks
4. **Categories/Tags**: Organize tasks with custom categories
5. **Search & Filters**: Advanced search and filtering options
6. **Dark Mode**: Toggle between light and dark themes

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Convex](https://convex.dev/) - Backend infrastructure
- [Better Auth](https://better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **Documentation**: [Convex Docs](https://docs.convex.dev/)
- **Community**: [Convex Discord](https://convex.dev/community)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

Built with ❤️ using Convex and Next.js
