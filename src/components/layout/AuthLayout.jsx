import './AuthLayout.css';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  brandTitle,
  brandSubtitle,
  brandIcon: BrandIcon,
  children,
  backLink = '/choose-role',
}) {
  return (
    <div className="auth-layout">
      {/* ── Left: Branded Panel ── */}
      <div className="auth-panel-brand">
        {/* Decorative orbs */}
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />

        {/* Subtle grid pattern overlay */}
        <div className="auth-grid-overlay" />

        <div className="auth-brand-content">
          {BrandIcon && (
            <div className="auth-brand-icon">
              <BrandIcon size={48} />
            </div>
          )}
          <h1>{brandTitle}</h1>
          <p>{brandSubtitle}</p>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="auth-panel-form">
        {/* Mobile brand header (visible < lg) */}
        <div className="auth-mobile-header">
          {BrandIcon && (
            <div className="auth-mobile-icon">
              <BrandIcon size={32} />
            </div>
          )}
          <h1>{brandTitle}</h1>
          <p>{brandSubtitle}</p>
        </div>

        <div className="auth-form-container">{children}</div>

        {/* Back link */}
        <Link to={backLink} className="auth-back-link">
          <ArrowLeft size={16} />
          Retour au choix du rôle
        </Link>
      </div>
    </div>
  );
}
