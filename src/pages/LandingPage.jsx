import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import {
  Sun, Moon, MapPin, Share2, Wallet,
  Gift, TrendingUp, Star, Award, Shield,
  ArrowRight, ChevronRight, Smartphone
} from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode.jsx';
import Logo3D from '../components/ui/Logo3D.jsx';
import p2wLogo from '../assets/logo-p2w.png';
import './LandingPage.css';

const LandingPage = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={p2wLogo} alt="P2W Logo" style={{ width: '160px', height: 'auto', objectFit: 'contain', transform: 'scale(1.2)', transformOrigin: 'left center' }} />
        </Link>
        <nav className="header-nav">
          <a href="#how-it-works">Comment ça marche</a>
          <a href="#influencers">Influenceurs</a>
          <a href="#merchants">Commerçants</a>
          <a href="#wincoins">WinCoins</a>
        </nav>
        <div className="header-actions">
          <button 
            className="icon-btn" 
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/choose-role" className="btn-primary">
            Se connecter <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>⚡️</span> Marketing d'influence local
            </div>
            <h1 className="hero-title">
              Publie. <span className="highlight-purple">Gagne.</span><br />
              <span className="highlight-gold">WinCoins.</span>
            </h1>
            <p className="hero-desc">
              Connecte des micro-influenceurs avec des commerçants locaux. Fais une story Instagram, consomme au restaurant, et gagne des <strong>WinCoins</strong> échangeables en euros.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                Télécharger l'app <ArrowRight size={18} />
              </a>
              <a href="#how-it-works" className="btn-outline">
                Comment ça marche <ChevronRight size={18} />
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-val">500+</span>
                <span className="stat-label">Influenceurs actifs</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">200+</span>
                <span className="stat-label">Commerçants partenaires</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">50k+</span>
                <span className="stat-label">WinCoins distribués</span>
              </div>
            </div>
          </div>
          <div className="hero-showcase">
            <div className="hero-showcase-center">
              <div className="hero-logo-card">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1.5} />
                  <pointLight position={[-5, 2, 5]} intensity={1.3} />
                  <Suspense fallback={null}>
                    <Logo3D scale={1.2} autoRotateSpeed={1.1} />
                  </Suspense>
                </Canvas>
              </div>
              <div className="hero-showcase-text">
                <h3>Publie. <span className="highlight">Gagne.</span><br/>WinCoins.</h3>
                <p>Connecte des micro-influenceurs avec des commerçants locaux. Fais une story Instagram, consomme au restaurant, et gagne des WinCoins échangeables en euros.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="download-section">
        <div className="download-card">
          <div>
            <div className="download-card-top">
              <Smartphone size={24} />
              <span>Téléchargement</span>
            </div>
            <h3>Application P2Win bientôt disponible</h3>
            <p>Le lancement mobile arrive bientôt. Nous finalisons l’expérience pour Android et iOS avec une interface fluide, une navigation intelligente et un accès rapide aux WinCoins.</p>
          </div>
          <div className="download-badges">
            <div className="app-badge">App Store</div>
            <div className="app-badge">Google Play</div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="section">
        <div className="section-tag">PROCESSUS</div>
        <h2 className="section-title">Simple comme <span className="highlight-purple">bonjour</span></h2>
        <p className="section-desc">3 étapes suffisent pour commencer à gagner des WinCoins avec P2Win.</p>
        
        <div className="process-grid">
          <div className="process-card">
            <div className="process-step">01</div>
            <div className="process-icon-wrapper purple">
              <MapPin size={24} />
            </div>
            <h3>Choisis une offre</h3>
            <p>Parcours les restaurants et bars partenaires près de chez toi. Sélectionne une offre qui te correspond.</p>
          </div>
          <div className="process-card">
            <div className="process-step">02</div>
            <div className="process-icon-wrapper blue">
              <Share2 size={24} />
            </div>
            <h3>Poste ta story</h3>
            <p>Va au restaurant, consomme le montant minimum requis, puis publie une story Instagram pendant 24h pour promouvoir le commerce.</p>
          </div>
          <div className="process-card">
            <div className="process-step">03</div>
            <div className="process-icon-wrapper gold">
              <Wallet size={24} />
            </div>
            <h3>Gagne des WinCoins</h3>
            <p>Une fois validée, tu reçois tes WinCoins. Accumule-les et retire-les en euros directement sur ton compte bancaire.</p>
          </div>
        </div>
      </section>

      {/* Influencers Section */}
      <section id="influencers" className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="influencer-section">
          <div className="influencer-content">
            <div className="section-tag">POUR LES INFLUENCEURS</div>
            <h2 className="section-title">Ton audience vaut de <span className="highlight-blue">l'argent</span></h2>
            <p className="section-desc">
              Avec seulement 500 abonnés sur Instagram, tu es déjà un micro-influenceur. P2Win te connecte aux meilleurs restaurants et bars de ta ville et te récompense pour chaque publication.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon"><Gift size={18} /></div>
                <div className="feature-text">Accès aux offres de restaurants et bars locaux</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Award size={18} /></div>
                <div className="feature-text">Gagne des WinCoins pour chaque story validée</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><TrendingUp size={18} /></div>
                <div className="feature-text">500 abonnés minimum suffisent pour commencer</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Wallet size={18} /></div>
                <div className="feature-text">Retire tes gains en euros sur ton compte bancaire</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Star size={18} /></div>
                <div className="feature-text">Score de réputation pour décrocher plus d'offres</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Shield size={18} /></div>
                <div className="feature-text">Compte créateur Instagram requis — process simple</div>
              </div>
            </div>
          </div>
          
          <div className="influencer-mockup">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>TON WALLET</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(139, 92, 240, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>W</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>86 €</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>WinCoins disponibles</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Gift size={16} /> Échanger
              </button>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowRight size={16} /> Retirer
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Mission terminée — Néon Club</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aujourd'hui</div>
                </div>
                <div style={{ color: 'var(--brand-accent)', fontWeight: 'bold' }}>+3</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Avis soumis — Pub2Win</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>12 Mai</div>
                </div>
                <div style={{ color: 'var(--brand-accent)', fontWeight: 'bold' }}>+2</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Bonus de bienvenue</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>19 Mai</div>
                </div>
                <div style={{ color: 'var(--brand-gold)', fontWeight: 'bold' }}>+5</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merchants Section */}
      <section id="merchants" className="section">
        <div className="merchant-section">
          <div className="merchant-content">
            <div className="section-tag">POUR LES COMMERÇANTS</div>
            <h2 className="section-title">Attire plus de clients grâce à <span className="highlight-gold">P2Win</span></h2>
            <p className="section-desc">
              Augmente ta visibilité locale avec des offres ciblées pour les influenceurs. Transforme la promotion en résultats concrets et génère des visites réelles.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon"><MapPin size={18} /></div>
                <div className="feature-text">Plus de visibilité dans ton quartier</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><TrendingUp size={18} /></div>
                <div className="feature-text">Booste tes ventes avec des offres exclusives</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Star size={18} /></div>
                <div className="feature-text">Collecte des avis authentiques et fidélise</div>
              </div>
            </div>
          </div>
          <div className="merchant-visual">
            <div className="merchant-card">
              <div className="merchant-card-header">Offre spéciale</div>
              <div className="merchant-card-body">
                <h3>Happy hour influenceurs</h3>
                <p>+15% de trafic le soir grâce aux stories validées.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="wincoins" className="section">
        <div className="section-tag" style={{ color: 'var(--brand-gold)' }}>RÉCOMPENSES</div>
        <h2 className="section-title">Les <span className="highlight-gold">WinCoins</span> — ta monnaie</h2>
        <p className="section-desc">Chaque story publiée te rapporte des WinCoins. Accumule-les et convertis-les en euros.</p>

        <div className="rewards-grid">
          <div className="reward-card" style={{ background: 'rgba(123, 47, 255, 0.06)', borderColor: 'rgba(123, 47, 255, 0.18)' }}>
            <div className="reward-icon" style={{ background: 'rgba(123, 47, 255, 0.18)', color: 'var(--brand-highlight)' }}>
              <Share2 size={24} />
            </div>
            <h3>Earn</h3>
            <p>Poste une story Instagram taguant le commerçant. Notre API vérifie automatiquement que ta story a bien duré 24h.</p>
            <div className="reward-pill" style={{ background: 'rgba(123, 47, 255, 0.12)', color: 'var(--text-main)' }}>
              <span className="dot" style={{ background: 'var(--brand-gold)' }}></span> +3 à +10 WinCoins / story
            </div>
          </div>

          <div className="reward-card" style={{ background: 'rgba(157, 78, 221, 0.06)', borderColor: 'rgba(157, 78, 221, 0.18)' }}>
            <div className="reward-icon" style={{ background: 'rgba(157, 78, 221, 0.18)', color: 'var(--brand-highlight)' }}>
              <Wallet size={24} />
            </div>
            <h3>Accumulate</h3>
            <p>Retrouve tous tes WinCoins dans ton wallet intégré. Consulte l'historique complet de tes transactions.</p>
            <div className="reward-pill" style={{ background: 'rgba(157, 78, 221, 0.12)', color: 'var(--text-main)' }}>
              <span className="dot" style={{ background: 'var(--brand-gold)' }}></span> Suivi en temps réel
            </div>
          </div>

          <div className="reward-card" style={{ background: 'rgba(224, 184, 74, 0.05)', borderColor: 'rgba(224, 184, 74, 0.2)' }}>
            <div className="reward-icon" style={{ background: 'rgba(224, 184, 74, 0.2)', color: 'var(--brand-gold)' }}>
              <Award size={24} />
            </div>
            <h3>Withdraw</h3>
            <p>Convertis tes WinCoins en euros et retire l'argent directement sur ton compte bancaire enregistré.</p>
            <div className="reward-pill" style={{ background: 'rgba(224, 184, 74, 0.1)', color: 'var(--text-main)' }}>
              <span className="dot" style={{ background: 'var(--brand-gold)' }}></span> 1 WinCoin = 1 €
            </div>
          </div>
        </div>

        <div className="challenge-banner">
          <div className="challenge-icon">W</div>
          <h3>Challenge du mois 🏆</h3>
          <p>Complète 5 missions ce mois-ci et gagne un bonus de <strong>50 WinCoins</strong> supplémentaires !</p>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section">
        <div className="section-tag">TÉMOIGNAGES</div>
        <h2 className="section-title">Ce que disent nos <span className="highlight-purple">utilisateurs</span></h2>
        <p className="section-desc">Découvre les avis des influenceurs et commerçants qui utilisent P2Win.</p>
        
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"J'ai commencé avec 100 abonnés et j'ai déjà gagné 150€ en 2 semaines. P2Win c'est du gagnant!"</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))' }}>M</div>
              <div>
                <div className="review-name">Margot D.</div>
                <div className="review-role">Micro-influenceuse • 2.4k abonnés</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"Outil marketing extraordinaire! Nos ventes ont augmenté et on atteint une audience plus jeune grâce aux influenceurs."</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-gold))' }}>J</div>
              <div>
                <div className="review-name">Jean Dupont</div>
                <div className="review-role">Propriétaire Restaurant • Paris</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"Super facile à utiliser. J'aime que ce soit automatisé - l'app vérifie automatiquement ma story. Zéro stress!"</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-gold))' }}>L</div>
              <div>
                <div className="review-name">Lisa Chen</div>
                <div className="review-role">Créatrice • 5.8k abonnés</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"P2Win nous a permis de collaborer avec des créateurs locaux authentiques. Meilleur ROI marketing qu'on ait eu!"</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-accent))' }}>S</div>
              <div>
                <div className="review-name">Sophie Laurent</div>
                <div className="review-role">Directrice Marketing • Bar Paris 11e</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"Le système de WinCoins est génial. Pas besoin d'attendre des mois pour être payée, c'est immédiat!"</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-primary))' }}>C</div>
              <div>
                <div className="review-name">Camille Moreau</div>
                <div className="review-role">Influenceuse • 3.2k abonnés</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p className="review-text">"On a testé plein de plateformes, mais P2Win est la seule où on voit vraiment un impact sur nos ventes!"</p>
            <div className="review-author">
              <div className="review-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-gold))' }}>M</div>
              <div>
                <div className="review-name">Marc Fontaine</div>
                <div className="review-role">Gérant Café • Lyon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={p2wLogo} alt="WinSpot" className="footer-logo" />
            <p>La plateforme qui connecte les micro-influenceurs avec les meilleurs restaurants et bars locaux.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </a>
              <a href="#" aria-label="TikTok" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Plateforme</h4>
              <a href="#how-it-works">Comment ça marche</a>
              <a href="#influencers">Pour les influenceurs</a>
              <a href="#merchants">Pour les commercants</a>
              <a href="#wincoins">WinCoins</a>
            </div>
            <div className="footer-col">
              <h4>Connexion</h4>
              <a href="/influencer/login">Espace Influenceur</a>
              <a href="/restaurant/login">Espace Restaurant</a>
              <a href="/choose-role">Créer un compte</a>
            </div>
            <div className="footer-col">
              <h4>Légal</h4>
              <a href="#">Mentions légales</a>
              <a href="#">Politique de confidentialité</a>
              <a href="#">CGU</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WinSpot. Tous droits réservés.</p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 Paiements sécurisés</span>
            <span className="footer-badge">🇫🇷 Made in France</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;