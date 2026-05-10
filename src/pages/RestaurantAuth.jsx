import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Mail, Lock, User, Building } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext.jsx';

export default function RestaurantAuth({ isSignUp }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    restaurantName: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      role: 'restaurant',
      name: formData.name || formData.restaurantName || 'Restaurant',
      email: formData.email,
    });
    navigate('/restaurant-dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout
      brandTitle="Boostez votre Restaurant"
      brandSubtitle="Attirez des influenceurs locaux, générez du buzz authentique sur les réseaux sociaux, et transformez les posts en clients réels avec WinCoins."
      brandIcon={UtensilsCrossed}
    >
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>{isSignUp ? 'Créer un compte partenaire' : 'Connexion Partenaire'}</h2>
          <p>{isSignUp ? 'Rejoignez P2Win et boostez votre visibilité' : 'Gérez vos campagnes et récompenses'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="auth-form-group">
                <label>Nom complet</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="name" placeholder="Jean Dupont" value={formData.name} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <div className="auth-form-group">
                <label>Nom de l'établissement</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="restaurantName" placeholder="Mon Super Restaurant" value={formData.restaurantName} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label>Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" name="email" placeholder="contact@restaurant.com" value={formData.email} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
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
              Déjà un compte ? <Link to="/restaurant/login">Connectez-vous</Link>
            </>
          ) : (
            <>
              Pas encore de compte ? <Link to="/restaurant/register">Inscrivez-vous</Link>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
