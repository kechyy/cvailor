# Cvailor Frontend

> Next.js 14 frontend for Cvailor — AI-powered CV builder, ATS analysis, GPT-4 CV tailoring, and PDF export.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | TailwindCSS 3.4 + Tailwind Merge |
| Animations | Framer Motion |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| UI Primitives | Radix UI |
| Icons | lucide-react |
| File Upload | react-dropzone |
| Auth | next-auth 4.24 |

---

## Features

- **Landing page** — hero, animated AI illustration, 4-step feature showcase
- **Authentication** — sign in, sign up, email verification, password reset flows
- **5-step CV Builder** — personal info, experience (with inline AI rewrite), education & skills, certifications, job description context
- **Advanced CV Editor** — live A4 preview, auto-save with debouncing, resume upload
- **8 CV Templates** — Classic, Modern, Professional, Executive, Creative, Academic, Healthcare, Minimal
- **AI CV Tailor** — paste a job description, GPT-4 rewrites your CV; side-by-side diff view of changes
- **ATS Score** — animated score meter, matched/missing keyword chips, actionable tips
- **PDF Export** — async download with job polling
- **Dashboard** — stats overview, recent CVs, AI insights panel

---

## Project Structure

```
cvailor-frontend/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── auth/                    # Sign in, sign up, verify email, reset password
│   └── dashboard/
│       ├── page.tsx             # Dashboard overview
│       ├── cvs/                 # CV list
│       ├── cv/                  # new | preview | upload
│       ├── editor/              # Advanced CV editor with live preview
│       ├── templates/           # Template gallery
│       ├── tailor/              # AI tailoring + ATS score
│       ├── download/            # PDF export
│       ├── jobs/                # Job tracking
│       └── settings/            # User settings
├── components/
│   ├── home/                    # Landing page sections
│   ├── auth/                    # Auth UI components
│   ├── dashboard/               # Dashboard widgets (AtsScoreMeter, KeywordChips, CVCard, etc.)
│   ├── dashboard/cv-builder/    # 5-step builder (StepPersonal, StepExperience, etc.)
│   ├── dashboard/cv-templates/  # 8 template React components
│   └── ui/                      # Base UI (Button, FormField, SelectField, TagInput, etc.)
├── store/
│   ├── cvBuilderStore.ts        # CV builder state (cv data, template selection, tailor result)
│   └── homeUiStore.ts           # Landing page UI state
├── lib/
│   ├── api/                     # API client functions (auth, cvs, ai, ats, exports, resumes)
│   └── utils/                   # Shared utilities
├── mock/                        # Mock data for UI development
├── types/                       # Shared TypeScript types
├── public/                      # Static assets
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cvailor backend running (see `cvailor-backend/README.md`)

### Install & Run

```bash
cd cvailor-frontend

npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

---

## Page Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth/signin` | Login |
| `/auth/signup` | Registration |
| `/auth/verify-email` | Email verification |
| `/auth/reset-password` | Password reset request |
| `/auth/new-password` | Set new password |
| `/dashboard` | Overview stats and insights |
| `/dashboard/cvs` | CV list management |
| `/dashboard/cv/new` | Start 5-step CV builder |
| `/dashboard/cv/preview` | Preview before saving |
| `/dashboard/cv/upload` | Upload resume |
| `/dashboard/editor` | Advanced editor with live A4 preview |
| `/dashboard/templates` | Template gallery |
| `/dashboard/tailor` | AI tailoring + ATS score |
| `/dashboard/download` | PDF export |
| `/dashboard/jobs` | Job application tracking |
| `/dashboard/settings` | User account settings |

---

## Run with Docker

From the repo root:

```bash
docker-compose up
```

The frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`.
