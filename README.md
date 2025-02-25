# RogiSetu - Hospital OPD Management System

RogiSetu is a comprehensive web application built with Next.js that simplifies hospital OPD (Outpatient Department) management. It provides features for patients to book appointments, track tokens, and for hospital staff to manage departments and patient flow.

## Features

- Multi-role authentication system (Patient, Department Admin, Hospital Admin, Super Admin)
- OPD appointment booking and tracking
- Hospital and department management
- Real-time token status updates
- Responsive design with modern UI
- Dark/Light theme support

## Tech Stack

- Frontend: Next.js 15, React 19
- Backend: Supabase
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State Management: Redux Toolkit
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- Icons: Lucide Icons
- Form Handling: React Hook Form
- Notifications: Sonner

## Getting Started

Clone the repository:

```bash
git clone https://github.com/yourusername/rogisetu.git
cd rogisetu
```

Install dependencies:

```bash
npm install
    or
yarn install
```

Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
    or
yarn dev
```

Open `http://localhost:3000` with your browser to see the result.

## Project Structure

```javascript
src/
├── actions/      # Server actions
├── app/          # Next.js app router pages
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── store/        # Redux store configuration
├── types/        # TypeScript type definitions
└── utils/        # Helper utilities
```

## Key Features by User Role

### Patient

- Book OPD appointments
- Track token status
- View appointment history
- Manage profile

### Department Admin

- Manage tokens
- View queue status
- Handle patient flow

### Hospital Admin

- Manage departments
- Add/remove department admins
- Monitor hospital operations

### Super Admin

- Manage hospitals
- Create hospital admins
- Configure department types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
