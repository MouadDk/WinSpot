# WinSpot Frontend Web Documentation

Welcome to the frontend documentation for the **WinSpot Web Application**. This project is built using modern web development practices, focusing on high performance, dynamic aesthetics, and a rich user experience.

## Tech Stack Overview

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

The codebase is organized in the `src/` directory as follows:

```text
src/
├── assets/         # Static assets like images and fonts
├── components/     # Reusable React components
│   ├── auth/       # Authentication related components (RoleGuard)
│   ├── dashboard/  # Dashboard-specific components (MetricCard, OfferCard)
│   ├── layout/     # Structural layouts (AuthLayout, DashboardLayout, PageTransition)
│   └── ui/         # Generic UI elements (Button, Input, Card, Badge, ThemeToggle, Logo3D)
├── contexts/       # React Context providers (AuthContext)
├── hooks/          # Custom React hooks (useDarkMode)
├── lib/            # Library utilities and API configuration (api.js)
├── pages/          # Full page components corresponding to routes
├── App.jsx         # Main application component and routing setup
├── index.css       # Global styles and Tailwind v4 theme configuration
└── main.jsx        # Application entry point
```

## Routing & Navigation

Routing is handled by `React Router DOM` inside `src/App.jsx`. The application has distinct sections:

1. **Public Routes**:
   - `/` - Landing Page
   - `/choose-role` - Role Selection Screen

2. **Authentication Routes**:
   - `/restaurant/login`, `/restaurant/register` - Merchant Auth Flow
   - `/customer/login`, `/customer/register` - Customer Auth Flow

3. **Protected Dashboards**:
   - `/restaurant-dashboard/*` - Protected by `RoleGuard` (role: merchant)
   - `/customer-dashboard/*` - Protected by `RoleGuard` (role: customer)

*Note: Legacy routes (`/influencer`, `/influencer-dashboard`) are gracefully redirected to customer equivalents.*

## State Management

Authentication state is managed globally using Context API (`src/contexts/AuthContext.jsx`).
- Uses `localStorage` to persist the JWT token (`pub2win_token`) and user object (`pub2win_user`).
- Exposes `user`, `token`, `login`, `logout`, and `isLoading` to the rest of the application via the `useAuth` hook.

## Theming & Styling

- **Tailwind CSS v4** is used for utility-first styling.
- Global theme variables and base fonts are defined in `src/index.css` (using Inter from Google Fonts).
- **Dark Mode**: Managed by the custom `useDarkMode` hook (`src/hooks/useDarkMode.js`). Toggled via the `<ThemeToggle />` component. Uses a custom class-based dark mode configuration for modern Tailwind aesthetics.

## API Integration

All backend communications are centralized in `src/lib/api.js`.
- Automatically extracts the `VITE_BACKEND_URL` from Vite's environment variables (`.env`).
- Exports robust utilities like `apiUrl(path)`, `authHeaders(token)`, and `parseApiResponse(response)` to ensure consistent error handling and simplified fetch requests across all components and pages.

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env` or `.env.local` file based on your backend configuration:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```
