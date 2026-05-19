import { useEffect, useState, useCallback } from 'react';
import {
  Loader2, Plus, RefreshCw, Megaphone, QrCode,
  Pencil, Trash2, ToggleLeft, ToggleRight, X,
  Copy, Check, Coins,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../contexts/AuthContext';
import OfferCard from '../../components/dashboard/OfferCard';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

// ─── QR Modal (same as RestaurantDashboard) ─────────────────────────────────
function QRModal({ qrData, onClose }) {
  const [copied, setCopied] = useState(false);
  const expiresAt = new Date(qrData.expiresAt);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = expiresAt - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); clearInterval(interval); }
      else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const handleCopy = () => { navigator.clipboard.writeText(qrData.token); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-4 bg-white p-2 rounded-xl flex items-center justify-center">
            <QRCodeSVG value={qrData.token} size={176} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">QR Code Generated</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Show this to the customer to scan</p>
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-dashed border-cyan-300 dark:border-cyan-500/30 p-4 mb-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Token</p>
            <p className="font-mono text-xs text-slate-800 dark:text-white break-all">{qrData.token}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3"><p className="text-xs text-slate-500">Item</p><p className="font-semibold text-slate-800 dark:text-white">{qrData.itemName}</p></div>
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3"><p className="text-xs text-slate-500">Price</p><p className="font-semibold text-slate-800 dark:text-white">{qrData.price} MAD</p></div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3"><p className="text-xs text-emerald-600">Cashback</p><p className="font-semibold text-emerald-700 dark:text-emerald-300">{qrData.cashbackPercent}% = {qrData.cashbackMAD} MAD</p></div>
            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3"><p className="text-xs text-amber-600">WinCoins</p><p className="font-semibold text-amber-700 dark:text-amber-300">{qrData.cashbackCoins} WC</p></div>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold mb-4 ${timeLeft === 'Expired' ? 'bg-red-100 dark:bg-red-500/15 text-red-600' : 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600'}`}>
            ⏱ {timeLeft === 'Expired' ? 'Expired' : `Expires in ${timeLeft}`}
          </div>
          <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Token'}
          </button>
        </div>
      </div>
    </div>
  );
}

const initialForm = { establishmentName: '', category: 'Restaurant', itemName: '', description: '', price: '', cashbackPercent: '', totalWinCoinsBudget: '', address: '', city: '' };

/**
 * MerchantOffersPage — extracted from RestaurantDashboard.
 * Full create / edit / delete / toggle / generate-QR offer management.
 */
export default function MerchantOffersPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [qrModalData, setQrModalData] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadOffers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/offers/mine'), { headers: authHeaders(token) });
      const data = await parseApiResponse(res);
      setOffers(data.offers ?? []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const resetForm = () => { setEditingId(null); setForm(initialForm); setShowForm(false); };

  const buildPayload = () => ({
    establishmentName: form.establishmentName.trim(),
    category: form.category,
    itemName: form.itemName.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    cashbackPercent: Number(form.cashbackPercent),
    totalWinCoinsBudget: Number(form.totalWinCoinsBudget),
    location: { type: 'Point', coordinates: [0, 0], address: form.address.trim(), city: form.city.trim() },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError(null);
    try {
      const res = await fetch(
        editingId ? apiUrl(`/api/offers/${editingId}`) : apiUrl('/api/offers'),
        { method: editingId ? 'PUT' : 'POST', headers: authHeaders(token, { 'Content-Type': 'application/json' }), body: JSON.stringify(buildPayload()) }
      );
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message);
      resetForm();
      await loadOffers();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setForm({ establishmentName: offer.establishmentName || '', category: offer.category || 'Restaurant', itemName: offer.itemName || '', description: offer.description || '', price: offer.price?.toString() || '', cashbackPercent: offer.cashbackPercent?.toString() || '', totalWinCoinsBudget: (offer.totalWinCoinsBudget ?? 0).toString(), address: offer.location?.address || '', city: offer.location?.city || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (offer) => {
    if (!window.confirm(`Delete "${offer.itemName}"?`)) return;
    setError(null);
    try {
      const res = await fetch(apiUrl(`/api/offers/${offer._id}`), { method: 'DELETE', headers: authHeaders(token) });
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message);
      await loadOffers();
    } catch (err) { setError(err.message); }
  };

  const handleToggle = async (offer) => {
    try {
      await fetch(apiUrl(`/api/offers/${offer._id}`), { method: 'PUT', headers: authHeaders(token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ isActive: !offer.isActive }) });
      await loadOffers();
    } catch (err) { setError(err.message); }
  };

  const handleGenerateQR = async (offer) => {
    if (!token) return;
    setGeneratingQR(true); setError(null);
    try {
      const res = await fetch(apiUrl('/api/qr/generate'), { method: 'POST', headers: authHeaders(token, { 'Content-Type': 'application/json' }), body: JSON.stringify({ offerId: offer._id }) });
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message);
      setQrModalData(data.qr);
    } catch (err) { setError(err.message); }
    finally { setGeneratingQR(false); }
  };

  const activeCount = offers.filter((o) => o.isActive).length;

  return (
    <div className="space-y-8">
      {qrModalData && <QRModal qrData={qrModalData} onClose={() => setQrModalData(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Offers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {activeCount} active · {offers.length} total offers
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadOffers} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setShowForm((v) => !v); if (editingId) resetForm(); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 transition-all">
            <Plus className="w-4 h-4" />
            New Offer
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-500" />
              {editingId ? 'Edit Offer' : 'Create Offer'}
            </h2>
            <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-semibold">Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Establishment Name</span>
                <input value={form.establishmentName} onChange={(e) => setForm((f) => ({ ...f, establishmentName: e.target.value }))} required className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</span>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500">
                  {['Restaurant', 'Bar', 'Café', 'Hotel', 'Other'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</span>
              <input value={form.itemName} onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))} required placeholder="e.g. Pizza Combo, Lunch Special" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (MAD)</span>
                <input type="number" min="1" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required placeholder="100" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cashback %</span>
                <input type="number" min="1" max="50" step="0.5" value={form.cashbackPercent} onChange={(e) => setForm((f) => ({ ...f, cashbackPercent: e.target.value }))} required placeholder="8" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WinCoins Budget</span>
                <input type="number" min="1" step="0.1" value={form.totalWinCoinsBudget} onChange={(e) => setForm((f) => ({ ...f, totalWinCoinsBudget: e.target.value }))} required className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
            </div>
            {form.price && form.cashbackPercent && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 text-sm">
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  💰 Customer gets <strong>{(Number(form.price) * Number(form.cashbackPercent) / 100).toFixed(0)} MAD</strong> cashback ({(Number(form.price) * Number(form.cashbackPercent) / 100 / 10).toFixed(2)} WinCoins per scan)
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</span>
                <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</span>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </label>
            </div>
            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-70">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'Update Offer' : 'Publish Offer')}
            </button>
          </form>
        </section>
      )}

      {/* Offer List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading offers…
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-6 py-16 text-center">
          <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No offers yet. Click <strong>New Offer</strong> to create your first cashback offer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              showMerchantControls
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggle}
              onGenerateQR={handleGenerateQR}
            />
          ))}
        </div>
      )}
    </div>
  );
}
