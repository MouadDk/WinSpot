import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

export default function InfluencerAuth({ isSignUp }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Register API Call
        const res = await fetch('http://localhost:4000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            role: 'influencer', // Automatically assign influencer role!
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Erreur lors de l\'inscription');
        
        // Auto-login after register
        const loginRes = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginData.success) throw new Error(loginData.message || 'Erreur lors de la connexion automatique');
        login(loginData.token, loginData.user);
        window.location.href = '/influencer-dashboard';
      } else {
        // Login API Call
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Email ou mot de passe incorrect');
        login(data.token, data.user);
        window.location.href = '/influencer-dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandTitle="Monetize Your Influence"
      brandSubtitle="Discover exclusive local offers, visit premium spots, and earn WinCoins for your authentic content."
      brandIcon={Sparkles}
      accentColor="violet"
      backLink="/choose-role"
    >
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-8 border border-slate-100 dark:border-slate-700/50 max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isSignUp ? 'Créer un compte Influenceur' : 'Espace Influenceur'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {isSignUp ? 'Rejoignez la communauté et gagnez des WinCoins.' : 'Connectez-vous pour découvrir de nouvelles missions.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prénom</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:text-white outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:text-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 dark:text-white outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:from-violet-600 hover:to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Créer mon compte' : 'Se connecter'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <a
            href={isSignUp ? '/influencer/login' : '/influencer/register'}
            className="text-violet-500 hover:text-violet-400 font-semibold transition-colors"
          >
            {isSignUp ? 'Connectez-vous' : 'Inscrivez-vous'}
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
