import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const accentStyles = {
  purple: {
    gradient: 'from-purple-900 via-purple-700 to-purple-800',
    blob1: 'bg-purple-400',
    blob2: 'bg-fuchsia-400',
    textMuted: 'text-purple-200',
  },
  cyan: {
    gradient: 'from-blue-600 via-cyan-500 to-blue-700',
    blob1: 'bg-cyan-300',
    blob2: 'bg-blue-300',
    textMuted: 'text-cyan-100',
  },
};

export default function AuthLayout({
  brandTitle,
  brandSubtitle,
  brandIcon: BrandIcon,
  accentColor = 'purple',
  children,
  backLink = '/choose-role',
}) {
  const accent = accentStyles[accentColor];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left: Branded Panel ── */}
      <div
        className={`
          hidden lg:flex lg:w-1/2 xl:w-[45%]
          bg-gradient-to-br ${accent.gradient}
          relative overflow-hidden flex-col items-center justify-center p-12
        `}
      >
        {/* Decorative orbs */}
        <div
          className={`absolute top-20 -left-20 w-80 h-80 ${accent.blob1} opacity-10 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-20 -right-20 w-96 h-96 ${accent.blob2} opacity-10 rounded-full blur-3xl`}
        />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          {BrandIcon && (
            <div className="w-24 h-24 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <BrandIcon className="w-12 h-12 text-white" />
            </div>
          )}
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            {brandTitle}
          </h1>
          <p className={`text-lg ${accent.textMuted} leading-relaxed`}>
            {brandSubtitle}
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 relative min-h-screen lg:min-h-0">
        {/* Mobile brand header (visible < lg) */}
        <div className="lg:hidden mb-8 text-center">
          {BrandIcon && (
            <div
              className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${accent.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <BrandIcon className="w-8 h-8 text-white" />
            </div>
          )}
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
            {brandTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {brandSubtitle}
          </p>
        </div>

        <div className="w-full max-w-md">{children}</div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
