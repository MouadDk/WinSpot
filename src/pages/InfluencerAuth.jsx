import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, AtSign } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext.jsx';

export default function InfluencerAuth({ isSignUp }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    instagramHandle: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      role: 'influencer',
      name: formData.name || formData.instagramHandle || 'Influenceur',
      email: formData.email,
    });
    navigate('/influencer-dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout
      brandTitle="Gagnez du Cashback"
      brandSubtitle="Visitez les meilleurs restaurants et bars, partagez votre expérience sur vos réseaux sociaux, et gagnez des WinCoins pour chaque publication."
      brandIcon={Sparkles}
    >
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>{isSignUp ? 'Créer un compte Influenceur' : 'Connexion Influenceur'}</h2>
          <p>{isSignUp ? 'Rejoignez la communauté et gagnez des WinCoins' : 'Suivez vos gains et découvrez de nouvelles offres'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="auth-form-group">
                <label>Nom ou Pseudo</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="name" placeholder="Alex" value={formData.name} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <div className="auth-form-group">
                <label>Pseudo Instagram</label>
                <div style={{ position: 'relative' }}>
                  <AtSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="instagramHandle" placeholder="@alex_foodie" value={formData.instagramHandle} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label>Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" name="email" placeholder="alex@example.com" value={formData.email} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            {isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignUp ? (
            <>
              Déjà un compte ? <Link to="/influencer/login">Connectez-vous</Link>
            </>
          ) : (
            <>
              Pas encore de compte ? <Link to="/influencer/register">Inscrivez-vous</Link>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
