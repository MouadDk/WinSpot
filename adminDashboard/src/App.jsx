import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:4000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Dashboard state
  const [merchants, setMerchants] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState({});
  const [activeTab, setActiveTab] = useState('merchants');

  useEffect(() => {
    const savedSecret = localStorage.getItem('adminSecret');
    if (savedSecret) {
      checkAuth(savedSecret);
    }
  }, []);

  const checkAuth = async (secret) => {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'x-admin-secret': secret }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setError('');
        localStorage.setItem('adminSecret', secret);
        fetchData(secret);
      } else {
        localStorage.removeItem('adminSecret');
        setIsAuthenticated(false);
        setError('Mot de passe incorrect ou backend inaccessible.');
      }
    } catch (err) {
      console.error('Auth error', err);
      setError('Erreur de connexion au serveur Backend. Vérifiez qu\'il tourne sur le port 4000.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email !== 'mouad.wantedpubgm@gmail.com') {
      setError('Email non autorisé');
      return;
    }
    checkAuth(password);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSecret');
    setIsAuthenticated(false);
  };

  const fetchData = async (secret) => {
    setLoading(true);
    try {
      const headers = { 'x-admin-secret': secret };
      const [merchRes, infRes, withRes] = await Promise.all([
        fetch(`${API_URL}/admin/merchants`, { headers }),
        fetch(`${API_URL}/admin/influencers`, { headers }),
        fetch(`${API_URL}/admin/withdrawals/pending`, { headers })
      ]);
      const merchData = await merchRes.json();
      const infData = await infRes.json();
      const withData = await withRes.json();
      
      if (merchData.success) setMerchants(merchData.merchants);
      if (infData.success) setInfluencers(infData.influencers);
      if (withData.success) setWithdrawals(withData.transactions);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const handleTopUp = async (merchantId) => {
    const amount = topUpAmount[merchantId];
    if (!amount || amount <= 0) return alert('Montant invalide');

    const secret = localStorage.getItem('adminSecret');
    try {
      const res = await fetch(`${API_URL}/admin/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret
        },
        body: JSON.stringify({ merchantId, amount: Number(amount) })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Succès! Nouveau solde: ${data.newBalance}`);
        fetchData(secret);
        setTopUpAmount(prev => ({ ...prev, [merchantId]: '' }));
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  const handleDeleteUser = async (userId, role) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur (${role}) ?`)) {
      return;
    }

    const secret = localStorage.getItem('adminSecret');
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': secret
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Utilisateur supprimé avec succès.');
        fetchData(secret);
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (err) {
      alert('Erreur réseau lors de la suppression');
    }
  };

  const handleWithdrawalAction = async (transactionId, action) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action === 'approve' ? 'APPROUVER' : 'REJETER'} ce retrait ?`)) {
      return;
    }

    const secret = localStorage.getItem('adminSecret');
    try {
      const res = await fetch(`${API_URL}/admin/withdrawals/${transactionId}/${action}`, {
        method: 'POST',
        headers: {
          'x-admin-secret': secret
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(`Retrait ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès.`);
        fetchData(secret); // Refresh all data including balances
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>Pub2Win Admin</h2>
          {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Admin" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Mot de passe" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Pub2Win Admin</h2>
        
        <div 
          className={`nav-item ${activeTab === 'merchants' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchants')}
        >
          <span style={{ marginRight: '10px' }}>🏪</span> Merchants
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'influencers' ? 'active' : ''}`}
          onClick={() => setActiveTab('influencers')}
        >
          <span style={{ marginRight: '10px' }}>📱</span> Influencers
        </div>

        <div 
          className={`nav-item ${activeTab === 'cashouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('cashouts')}
        >
          <span style={{ marginRight: '10px' }}>💸</span> Cashouts
          {withdrawals.length > 0 && (
            <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {withdrawals.length}
            </span>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-sm btn-danger" style={{ width: '100%' }} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="glass-panel" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="header">
            <div>
            <h1 style={{ background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeTab === 'merchants' && 'Gestion des Merchants'}
              {activeTab === 'influencers' && 'Gestion des Influencers'}
              {activeTab === 'cashouts' && 'Demandes de Retrait'}
            </h1>
            <p>Gérez les comptes et les fonds en temps réel</p>
          </div>
        </div>

        {!loading && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Merchants</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{merchants.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Total Influencers</div>
              <div className="stat-value" style={{ color: '#3b82f6' }}>{influencers.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Demandes en attente</div>
              <div className="stat-value" style={{ color: '#f59e0b' }}>
                {withdrawals.length}
                <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>⏳</span>
              </div>
            </div>
          </div>
        )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#94a3b8' }}>
              Chargement des données...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              {activeTab === 'merchants' && (
                <table>
                  <thead>
                    <tr>
                      <th>Nom & Prénom</th>
                      <th>Email</th>
                      <th>WinCoins</th>
                      <th>Top Up</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchants.map(m => (
                      <tr key={m._id}>
                        <td>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{m.firstName || 'Nom inconnu'} {m.lastName || ''}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>ID: {m._id.substring(0, 12)}...</div>
                        </td>
                        <td style={{ color: '#cbd5e1' }}>{m.email}</td>
                        <td><span className="badge-green">{m.winCoinsBalance} 🪙</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <input 
                              type="number" 
                              className="input-field" 
                              style={{ margin: 0, width: '100px', padding: '0.5rem' }}
                              placeholder="Montant"
                              value={topUpAmount[m._id] || ''}
                              onChange={e => setTopUpAmount(prev => ({ ...prev, [m._id]: e.target.value }))}
                            />
                            <button className="btn btn-sm" onClick={() => handleTopUp(m._id)}>+</button>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteUser(m._id, 'Merchant')}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {merchants.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          Aucun merchant trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'influencers' && (
                <table>
                  <thead>
                    <tr>
                      <th>Nom & Prénom</th>
                      <th>Email</th>
                      <th>WinCoins (Solde)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {influencers.map(inf => (
                      <tr key={inf._id}>
                        <td>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{inf.firstName || 'Nom inconnu'} {inf.lastName || ''}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>ID: {inf._id.substring(0, 12)}...</div>
                        </td>
                        <td style={{ color: '#cbd5e1' }}>{inf.email}</td>
                        <td><span className="badge-blue">{inf.winCoinsBalance} 🪙</span></td>
                        <td>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteUser(inf._id, 'Influencer')}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {influencers.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          Aucun influenceur trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {activeTab === 'cashouts' && (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Utilisateur</th>
                      <th>Infos de Paiement</th>
                      <th>Montant Demandé</th>
                      <th>Actions (Virement)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map(w => (
                      <tr key={w._id}>
                        <td>
                          <div style={{ color: '#fff' }}>{new Date(w.createdAt).toLocaleDateString('fr-FR')}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(w.createdAt).toLocaleTimeString('fr-FR')}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600', color: '#fff' }}>
                            {w.userId?.firstName} {w.userId?.lastName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{w.userId?.email}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>ID: {w.userId?._id?.substring(0, 12)}...</div>
                        </td>
                        <td>
                          <div style={{ display: 'inline-block', background: w.paymentMethod === 'paypal' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: w.paymentMethod === 'paypal' ? '#60a5fa' : '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                            {w.paymentMethod === 'paypal' ? 'PayPal' : 'Virement Bancaire'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#fff', wordBreak: 'break-all' }}>
                            {w.paymentDetails || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <span className="badge-blue" style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
                            {w.amount} 🪙
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-sm" 
                              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', boxShadow: 'none' }}
                              onClick={() => handleWithdrawalAction(w._id, 'approve')}
                              title="Marquer comme payé (Approuver)"
                            >
                              ✅ Approuver
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleWithdrawalAction(w._id, 'reject')}
                              title="Rejeter et Rembourser"
                            >
                              ❌ Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
                          🎉 Aucune demande de retrait en attente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
