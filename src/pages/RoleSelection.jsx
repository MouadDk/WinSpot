import './RoleSelection.css';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, ArrowLeft } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="role-selection-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="role-header">
        <h1>Sélectionnez votre rôle</h1>
        <p>
          Choisissez votre expérience : attirer des clients dans votre établissement ou gagner des récompenses en tant qu’influenceur.
        </p>
      </div>

      <div className="role-cards-container">
        {/* Restaurant Card */}
        <div className="role-card">
          <div className="role-icon-wrapper restaurant-icon">
            <UtensilsCrossed size={36} />
          </div>
          <h2>Pour les restaurants</h2>
          <p>
            Attirez des influenceurs locaux, générez un buzz authentique et augmentez la fréquentation grâce à des campagnes WinCoins ciblées.
          </p>
          <div className="role-actions">
            <Link to="/restaurant/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Connexion
            </Link>
            <Link to="/restaurant/register" className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Influencer Card */}
        <div className="role-card">
          <div className="role-icon-wrapper influencer-icon">
            <Sparkles size={36} />
          </div>
          <h2>Pour les influenceurs</h2>
          <p>
            Découvrez des lieux branchés, partagez vos expériences et gagnez des WinCoins sur chaque publication authentique.
          </p>
          <div className="role-actions">
            <Link to="/influencer/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Connexion
            </Link>
            <Link to="/influencer/register" className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
