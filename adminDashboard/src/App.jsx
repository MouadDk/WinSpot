import { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:4000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dashboard state
  const [merchants, setMerchants] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [circulatingCoins, setCirculatingCoins] = useState(0);
  const [platformRevenue, setPlatformRevenue] = useState(0);
  const [totalRedemptions, setTotalRedemptions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState({});
  const [activeTab, setActiveTab] = useState('merchants');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      fetchData(savedToken).then(() => {
        setIsAuthenticated(true);
      }).catch(() => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setError('');
        fetchData(data.token);
      } else {
        setError(data.message || 'Identifiants incorrects.');
      }
    } catch (err) {
      console.error('Auth error', err);
      setError('Erreur de connexion au serveur Backend. Vérifiez qu\'il tourne sur le port 4000.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const fetchData = async (token) => {
    const authToken = token || localStorage.getItem('adminToken');
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const [merchRes, custRes, withRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/merchants`, { headers }),
        fetch(`${API_URL}/admin/customers`, { headers }),
        fetch(`${API_URL}/admin/withdrawals/pending`, { headers }),
        fetch(`${API_URL}/admin/stats`, { headers })
      ]);

      // If any response is 401, token is expired
      if ([merchRes, custRes, withRes, statsRes].some(r => r.status === 401)) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        throw new Error('Session expired');
      }

      const merchData = await merchRes.json();
      const custData = await custRes.json();
      const withData = await withRes.json();
      const statsData = await statsRes.json();

      if (merchData.success) setMerchants(merchData.merchants);
      if (custData.success) setCustomers(custData.customers);
      if (withData.success) setWithdrawals(withData.transactions);
      if (statsData.success) {
        setCirculatingCoins(statsData.stats?.circulatingWinCoins ?? 0);
        setPlatformRevenue(statsData.stats?.platformRevenue ?? 0);
        setTotalRedemptions(statsData.stats?.totalRedemptions ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      throw err;
    }
    setLoading(false);
  };

  const handleTopUp = async (merchantId) => {
    const amount = topUpAmount[merchantId];
    if (!amount || amount <= 0) return alert('Montant invalide');

    const authToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ merchantId, amount: Number(amount) })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Succès! Nouveau solde: ${data.newBalance}`);
        fetchData();
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

    const authToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Utilisateur supprimé avec succès.');
        fetchData();
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

    const authToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/withdrawals/${transactionId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(`Retrait ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès.`);
        fetchData();
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
          <img src="/winspot-logo.png" alt="WinSpot" style={{ height: '80px', display: 'block', margin: '0 auto 2rem auto', objectFit: 'contain' }} />
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
        <div style={{ padding: '0 1rem 2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/winspot-logo.png" alt="WinSpot" style={{ height: '56px', objectFit: 'contain' }} />
          <span 
            style={{ 
              fontFamily: 'cursive', 
              fontStyle: 'italic', 
              color: '#a855f7', 
              fontSize: '13px',
              alignSelf: 'flex-end',
              marginRight: '2rem',
              marginTop: '-5px',
              transform: 'rotate(-4deg)',
              opacity: 0.9
            }}
          >
            Admin
          </span>
        </div>

        <div
          className={`nav-item ${activeTab === 'merchants' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchants')}
        >
          <span style={{ marginRight: '10px' }}>🏪</span> Merchants
        </div>

        <div
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <span style={{ marginRight: '10px' }}>👤</span> Customers
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
                {activeTab === 'customers' && 'Gestion des Clients'}
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
                <div className="stat-title">Total Customers</div>
                <div className="stat-value" style={{ color: '#3b82f6' }}>{customers.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">QR Redemptions</div>
                <div className="stat-value" style={{ color: '#a78bfa' }}>
                  {totalRedemptions}
                  <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>📱</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-title">WinCoins en circulation</div>
                <div className="stat-value" style={{ color: '#f59e0b' }}>
                  {Number(circulatingCoins || 0).toLocaleString()}
                  <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>🪙</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Platform Revenue (Fees)</div>
                <div className="stat-value" style={{ color: '#10b981' }}>
                  {Number(platformRevenue || 0).toFixed(1)} WC
                  <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>💰</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Demandes en attente</div>
                <div className="stat-value" style={{ color: '#ef4444' }}>
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

              {activeTab === 'customers' && (
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
                    {customers.map(c => (
                      <tr key={c._id}>
                        <td>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{c.firstName || 'Nom inconnu'} {c.lastName || ''}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>ID: {c._id.substring(0, 12)}...</div>
                        </td>
                        <td style={{ color: '#cbd5e1' }}>{c.email}</td>
                        <td><span className="badge-blue">{c.winCoinsBalance} 🪙</span></td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(c._id, 'Customer')}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          Aucun client trouvé.
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
                      <th>Montant (Net)</th>
                      <th>Fee (1.5%)</th>
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
                          <span className="badge-green" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                            {w.fee} 🪙
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
                        <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
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
