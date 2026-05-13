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
  const [influencers, setInfluencers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [finetuneItems, setFinetuneItems] = useState([]);
  const [circulatingCoins, setCirculatingCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState({});
  const [activeTab, setActiveTab] = useState('merchants');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      // Verify token is still valid by fetching data
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
      const [merchRes, infRes, withRes, statsRes, fineRes] = await Promise.all([
        fetch(`${API_URL}/admin/merchants`, { headers }),
        fetch(`${API_URL}/admin/influencers`, { headers }),
        fetch(`${API_URL}/admin/withdrawals/pending`, { headers }),
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/finetune`, { headers })
      ]);
      
      // If any response is 401, token is expired
      if ([merchRes, infRes, withRes, statsRes, fineRes].some(r => r.status === 401)) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        throw new Error('Session expired');
      }
      
      const merchData = await merchRes.json();
      const infData = await infRes.json();
      const withData = await withRes.json();
      const statsData = await statsRes.json();
      const fineData = await fineRes.json();
      
      if (merchData.success) setMerchants(merchData.merchants);
      if (infData.success) setInfluencers(infData.influencers);
      if (withData.success) setWithdrawals(withData.transactions);
      if (statsData.success) setCirculatingCoins(statsData.stats?.circulatingWinCoins ?? 0);
      if (fineData.success) setFinetuneItems(fineData.items);
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
        fetchData(); // Refresh all data including balances
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  const handleFinetuneAction = async (itemId, action) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action === 'approve' ? 'APPROUVER' : 'REJETER'} cette analyse IA ?`)) {
      return;
    }

    const authToken = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/admin/finetune/${itemId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Action enregistrée avec succès.');
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

        <div 
          className={`nav-item ${activeTab === 'finetune' ? 'active' : ''}`}
          onClick={() => setActiveTab('finetune')}
        >
          <span style={{ marginRight: '10px' }}>🤖</span> AI Review
          {finetuneItems.filter(i => i.adminStatus === 'pending').length > 0 && (
            <span style={{ marginLeft: 'auto', background: '#eab308', color: 'black', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {finetuneItems.filter(i => i.adminStatus === 'pending').length}
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
              {activeTab === 'finetune' && 'Validation des Analyses IA'}
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
            <div className="stat-card">
              <div className="stat-title">WinCoins en circulation</div>
              <div className="stat-value" style={{ color: '#a78bfa' }}>
                {Number(circulatingCoins || 0).toLocaleString()}
                <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>🪙</span>
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
                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
                          🎉 Aucune demande de retrait en attente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'finetune' && (
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Analyse IA (JSON)</th>
                      <th>Infos Transaction</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finetuneItems.map(item => {
                      const aiDataStr = item.conversations?.find(c => c.from === 'gpt')?.value || '{}';
                      let aiData = {};
                      try { aiData = JSON.parse(aiDataStr); } catch(e) {}
                      
                      const imageUrl = item.imageUrl.startsWith('/uploads') 
                        ? `${API_URL.replace('/api', '')}${item.imageUrl}` 
                        : item.imageUrl;

                      return (
                        <tr key={item._id}>
                          <td>
                            <a href={imageUrl} target="_blank" rel="noreferrer">
                              <img 
                                src={imageUrl} 
                                alt="AI Review" 
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #334155' }} 
                              />
                            </a>
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: '#1e293b', padding: '8px', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {JSON.stringify(aiData, null, 2)}
                            </div>
                          </td>
                          <td>
                            {item.transactionId ? (
                              <>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.transactionId.userId?.firstName} {item.transactionId.userId?.lastName}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.transactionId.userId?.email}</div>
                                <div style={{ color: '#f59e0b', fontWeight: 'bold', marginTop: '4px' }}>🪙 {item.transactionId.amount}</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '2px', color: item.transactionId.status === 'completed' ? '#34d399' : item.transactionId.status === 'failed' ? '#ef4444' : '#eab308' }}>
                                  Tx: {item.transactionId.status.toUpperCase()}
                                </div>
                              </>
                            ) : (
                              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Aucune transaction liée</div>
                            )}
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                              background: item.adminStatus === 'approved' ? 'rgba(16, 185, 129, 0.15)' : item.adminStatus === 'denied' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: item.adminStatus === 'approved' ? '#34d399' : item.adminStatus === 'denied' ? '#ef4444' : '#f59e0b'
                            }}>
                              {item.adminStatus}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <button 
                                className="btn btn-sm" 
                                style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', boxShadow: 'none' }}
                                onClick={() => handleFinetuneAction(item._id, 'approve')}
                                disabled={item.adminStatus === 'approved'}
                              >
                                ✅ Approuver (Forcer)
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleFinetuneAction(item._id, 'deny')}
                                disabled={item.adminStatus === 'denied'}
                              >
                                ❌ Rejeter (Forcer)
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {finetuneItems.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
                          Aucune donnée IA à valider.
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
