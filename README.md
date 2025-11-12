# Student Management System

A modern, full-stack student management system built with Next.js 14 (App Router), Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Full CRUD Operations**: Create, read, update, and delete student records
- **Modern UI**: Built with shadcn/ui and Tailwind CSS for a beautiful, responsive interface
- **Real-time Data**: Powered by Supabase for real-time database operations
- **Form Validation**: Comprehensive form validation using Zod and React Hook Form
- **Type Safety**: Full TypeScript support with auto-generated database types
- **Server Components**: Utilizes Next.js 14 App Router with React Server Components
- **Toast Notifications**: User-friendly feedback for all operations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Dev Tools**: dev3000 (AI-powered debugging)

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A Supabase account and project

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd student-management
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your database to be provisioned

#### Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `src/lib/supabase/schema.sql`
3. Paste and run it in the SQL Editor

This will create:
- A `students` table with all necessary fields
- Indexes for performance
- Row Level Security policies
- An automatic `updated_at` trigger

#### Get Your Supabase Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL and anon/public key

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Development Server

#### Standard Development Mode

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### With dev3000 (AI-Powered Debugging)

dev3000 provides AI-powered debugging with automatic error detection, screenshot capture, and network monitoring.

```bash
# Using pnpm
pnpm dev:d3k

# Or run directly with npx
npx d3k

# With custom port
npx d3k -p 3001

# With custom script
npx d3k -s "next dev --turbo"
```

**What dev3000 captures:**
- Console logs and errors
- Network requests and responses
- Page screenshots on errors
- Performance metrics
- React component tree

Learn more: [dev3000 Documentation](https://dev3000.ai/)

## Project Structure

```
student-management/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── layout.tsx           # Root layout with header
│   │   ├── page.tsx             # Home page (redirects to /students)
│   │   └── students/            # Students feature
│   │       ├── page.tsx         # Server component for data fetching
│   │       └── students-client.tsx  # Client component for interactivity
│   ├── components/
│   │   ├── layout/
│   │   │   └── header.tsx       # App header with navigation
│   │   ├── students/
│   │   │   ├── student-card.tsx     # Student display card
│   │   │   ├── student-dialog.tsx   # Modal wrapper
│   │   │   └── student-form.tsx     # Form with validation
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── use-toast.ts
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts        # Browser Supabase client
│       │   ├── server.ts        # Server Supabase client (SSR)
│       │   ├── database.types.ts # TypeScript types
│       │   ├── actions.ts       # Server actions
│       │   └── schema.sql       # Database schema
│       └── utils.ts             # Utility functions (cn)
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies and scripts
```

## Database Schema

The `students` table includes:

**Personal Information:**
- `first_name`, `last_name`
- `email` (unique)
- `phone`
- `date_of_birth`

**Academic Information:**
- `enrollment_date`
- `grade_level`
- `major`
- `gpa` (0.00 - 4.00)
- `status` (active, inactive, graduated, withdrawn)

**Address:**
- `address`, `city`, `state`, `zip_code`

**Emergency Contact:**
- `emergency_contact_name`
- `emergency_contact_phone`

**Metadata:**
- `id` (UUID, auto-generated)
- `created_at`, `updated_at` (timestamps)

## Usage

### Adding a Student

1. Click "Add Student" button
2. Fill in the required fields (marked with *)
3. Optionally add address and emergency contact information
4. Click "Add Student" to save

### Editing a Student

1. Click the edit icon on a student card
2. Update the desired fields
3. Click "Update Student" to save changes

### Deleting a Student

1. Click the trash icon on a student card
2. Confirm the deletion in the dialog
3. The student will be permanently removed

## Development

### Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add [component-name]
```

### Generating Supabase Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

### Building for Production

```bash
pnpm build
pnpm start
```

## Customization

### Changing the Theme

Edit `src/app/globals.css` to modify the color scheme. The project uses CSS variables for theming:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Adding New Fields

1. Update `src/lib/supabase/schema.sql`
2. Run the migration in Supabase SQL Editor
3. Update `src/lib/supabase/database.types.ts`
4. Update the form in `src/components/students/student-form.tsx`
5. Update the validation schema with Zod

### Modifying Student Status Options

Edit the status enum in:
- Database: `src/lib/supabase/schema.sql`
- Types: `src/lib/supabase/database.types.ts`
- Form: `src/components/students/student-form.tsx`

## Troubleshooting

### Supabase Connection Issues

- Verify your environment variables are correct
- Check that Row Level Security policies are set up correctly
- Ensure your Supabase project is active

### Type Errors

- Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` to regenerate types
- Restart your TypeScript server in your editor

### Build Errors

- Clear Next.js cache: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && pnpm install`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [Supabase documentation](https://supabase.com/docs)
- Read [shadcn/ui documentation](https://ui.shadcn.com)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database by [Supabase](https://supabase.com)
- Icons by [Lucide](https://lucide.dev)
- Debugging with [dev3000](https://dev3000.ai/)
