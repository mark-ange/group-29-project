# LuxeStay – Luxury Vacation Rentals & 3D Tours

> Extraordinary homes with five-star everything. Airbnb Luxe standard with 300+ point inspection certification,
> dedicated trip designers, split map discovery, and interactive 3D spatial tours.

## Project Structure

This monorepo is organized into two clearly separated halves:

```
luxestay/
├── frontend/          # Vue 3 + Vite + TypeScript + Tailwind CSS SPA
│   ├── index.html           # HTML entry point
│   ├── vite.config.ts       # Vite build/dev server config
│   ├── tsconfig.json        # TypeScript config
│   ├── server.ts            # Express dev server with mock API (tsx)
│   ├── package.json         # Frontend dependencies & scripts
│   ├── .env.example         # Environment template
│   └── src/
│       ├── App.vue          # Root Vue component
│       ├── main.ts          # App bootstrap
│       ├── index.css        # TailwindCSS entry
│       ├── types.ts         # Shared TypeScript interfaces
│       ├── env.d.ts         # Type declarations
│       ├── components/      # Vue single-file components
│       ├── stores/          # Pinia state stores (auth, properties, bookings)
│       ├── services/        # API client
│       ├── data/            # Mock data
│       └── server/          # Express dev-server routes & mock database
├── backend/           # Laravel 10 + PostgreSQL API
│   ├── artisan          # Laravel CLI
│   ├── composer.json    # PHP dependencies
│   ├── app/             # Models, Controllers, Middleware, Requests, Resources, Services
│   ├── routes/          # API routes (api.php)
│   ├── config/          # Laravel configuration files
│   ├── database/        # Migrations, factories, seeders
│   └── bootstrap/       # Framework bootstrapping
├── metadata.json       # AI Studio config
├── .gitignore
└── README.md
```

## Quick Start

### Frontend (Vue SPA)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
# → http://127.0.0.1:8000
```

## Development Notes

- The frontend SPA proxies `/api` requests to the Laravel backend during development.
- The Express `server.ts` provides a mock API for development when the Laravel backend is not running.
- Duplicate `.tsx` (React) component files have been removed — the project uses Vue 3 SFCs (`.vue`).
