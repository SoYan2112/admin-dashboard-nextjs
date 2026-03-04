# Modern Admin DashboardFull-stack User Management System with Next.js 15 & Drizzle ORMA sophisticated, high-performance Admin Dashboard designed for seamless user management. Built with a focus on UX/UI excellence, data integrity.
[Demo on Vercel](https://admin-dashboard-nextjs-pink.vercel.app/)

✨ Key Features
🔹 Intelligent User ManagementFull CRUD Operations: Create, Read, Update, and Delete users with an intuitive interface.Server-side Validation: Powered by Zod to ensure zero data corruption.Smart Duplicate Prevention: Automatically detects and blocks duplicate names/emails during creation and editing.Interactive Modals: Safe deletion process using Radix UI-based Alert Dialogs.
🔹 Advanced UX & PerformanceOptimized Loading: Custom-built Skeleton Screens that match the content structure to reduce perceived wait time.Responsive Layout: A fluid sidebar that transforms into a mobile drawer, ensuring accessibility on all devices.Smooth Transitions: Utilizing React's useTransition and router.refresh() for non-blocking UI updates.🔹 Activity & Audit LogsReal-time Timeline: Tracks every administrative action with detailed descriptions (e.g., "Admin John changed email to john@new.com").

🛠️ Tech Stack
* Framework: Next.js 15 (App Router)
* Language: TypeScript
* Database: PostgreSQL / SQLiteORMDrizzle ORM
* Styling: Tailwind CSS + Shadcn UI
* Validation: ZodIconsLucide
* ReactNotifications: Sonner Toast

📂 Project StructureBashadmin-dashboard/
├── app/
│   ├── admin/            # Core Dashboard & User Modules
│   │   ├── users/        # User CRUD (List, Create, Edit, Detail)
│   │   └── dashboard/    # Analytics Overview & Activity Timeline
│   └── api/              # Restful API Routes (Next.js Route Handlers)
├── components/           # Atomic Design Components
│   ├── ui/               # Base Shadcn/UI Components
│   └── users/            # Feature-Specific Business Logic Components
├── lib/                  # Database Config, API Helpers & Server Actions
└── types/                # Shared TypeScript Interfaces & Zod Schemas

🚀 Getting Started
1. Prerequisites
    * Node.js 18+
    * A Database instance (PostgreSQL recommended)

2. Installation
    * git clone https://github.com/your-username/admin-dashboard.git
    * cd admin-dashboard
    * npm install

3. Environment Setup
    * Create a .env file in the root directory:
    DATABASE_URL=your_database_connection_string

4. Database Migration
    * npx drizzle-kit push
5. Run Development Server
    * npm run dev
    * Navigate to http://localhost:3000/admin/dashboard to explore.