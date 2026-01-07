# 🧘 Wellnesstal - Premium Wellness & Headspa Website

Modern, enterprise-level wellness center website built with Next.js, Supabase, and deployed on Vercel.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Database:** [Supabase](https://supabase.com) (PostgreSQL)
- **Deployment:** [Vercel](https://vercel.com)
- **Styling:** Tailwind CSS
- **Authentication:** Custom admin auth with Supabase
- **Content Management:** Custom admin panel with TipTap editor

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account
- Vercel account (for deployment)

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/CodaxaPro/wellnesstal.git
cd wellnesstal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory. See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

### 4. Supabase Database Setup

Run the database migrations in Supabase Dashboard:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Open SQL Editor
4. Run migrations from `supabase/migrations/` folder in order

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## 📁 Project Structure

```
wellnesstal/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and Supabase client
│   └── contexts/         # React contexts
├── supabase/
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase config
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🚀 Deployment

### Vercel Deployment

The project is configured for automatic deployment on Vercel:

1. Push to `main` branch → Automatic deployment
2. Or manually deploy: `vercel --prod`

See [VERCEL_DEPLOYMENT_STATUS.md](./VERCEL_DEPLOYMENT_STATUS.md) for deployment status.

**Production URL:** https://www.wellnesstal.de

## 📚 Documentation

- [Environment Variables Setup](./ENV_SETUP.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Vercel Deployment Status](./VERCEL_DEPLOYMENT_STATUS.md)
- [Local-Production Sync Guide](./SYNC_LOCAL_PRODUCTION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Documentation](./COMPONENT_DOCUMENTATION.md)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔐 Admin Panel

Access the admin panel at `/admin` after setting up the admin user.

Default credentials are set via `ADMIN_PASSWORD` environment variable.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Production:** https://www.wellnesstal.de
- **GitHub:** https://github.com/CodaxaPro/wellnesstal
- **Vercel Dashboard:** https://vercel.com/treuepays-projects/wellnesstal
