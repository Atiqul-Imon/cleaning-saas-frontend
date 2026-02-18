# Frontend - Clenvora

Next.js 16 frontend application for the Clenvora cleaning business management platform.

## 🚀 Features

- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Performance Optimized**: React Query for data fetching, code splitting, lazy loading
- **Mobile-First**: Fully responsive design with excellent mobile UX
- **Authentication**: Supabase Auth integration
- **Real-time Updates**: React Query with background refetching
- **Production Ready**: Optimized builds, compression, image optimization

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Backend API running (see backend README)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:5000`)

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment to Vercel

Vercel is the recommended hosting platform for Next.js applications.

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as the root (or configure it in settings)

3. **Configure Environment Variables**
   In Vercel project settings → Environment Variables, add all environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://iumurbkvgepbtszdqkwa.supabase.co` (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon key)
   - `NEXT_PUBLIC_API_URL` = (your production backend URL, e.g., `https://your-backend-domain.com`)
   - `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` = (optional, if using ImageKit)
   - `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` = (optional, if using ImageKit)
   
   **Important**: 
   - Add these for **Production**, **Preview**, and **Development** environments
   - After adding variables, you need to **redeploy** for changes to take effect

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts. For production deployment:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes optimized Next.js configuration for Vercel:
- Automatic compression
- Image optimization (AVIF, WebP)
- Package import optimization
- Production-ready builds

### Custom Domain Setup

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificates are automatically provisioned

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key | No |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | No |

**Note**: All `NEXT_PUBLIC_*` variables are exposed to the browser. Never include sensitive keys.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (Button, Input, etc.)
│   ├── clients/          # Client-related components
│   ├── jobs/             # Job-related components
│   └── invoices/         # Invoice-related components
├── lib/                   # Utilities and hooks
│   ├── hooks/            # Custom React hooks
│   ├── api-client.ts     # API client
│   └── supabase.ts       # Supabase client
└── public/               # Static assets
```

## 🧪 Development

- **Linting**: `npm run lint`
- **Type Checking**: TypeScript is checked during build
- **Hot Reload**: Automatic with `npm run dev`

## 🐛 Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is running and accessible

### Supabase Issues
- Verify Supabase credentials
- Check Supabase project is active
- Review Supabase dashboard for errors

## 📝 License

Private - All rights reserved
