import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, RefreshCw, Clock, CheckCircle2, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

// QR code scanner URL base — influencer will open this link or scan it with camera
const SCAN_BASE = `${window.location.origin}/scan-qr`;

export default function QRGenerator({ offers = [], token }) {
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [currentQR, setCurrentQR] = useState(null); // { token, label, winCoins, expiresAt }
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeOffers = offers.filter((o) => o.isActive);

  // Load existing QR history
  const loadHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(apiUrl('/api/qr/mine'), { headers: authHeaders(token) });
      const data = await parseApiResponse(res);
      if (data.success) setHistory(data.qrVisits || []);
    } catch {
      // Silent — history is supplementary
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleGenerate = async () => {
    if (!selectedOfferId) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch(apiUrl('/api/qr/generate'), {
        method: 'POST',
        headers: authHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ offerId: selectedOfferId, winCoins: 1 }),
      });
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message || 'Failed to generate QR');
      setCurrentQR(data.qrVisit);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const qrUrl = currentQR ? `${SCAN_BASE}?token=${currentQR.token}` : '';

  const copyToken = async () => {
    if (!currentQR?.token) return;
    await navigator.clipboard.writeText(currentQR.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m left`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <QrCode className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">QR Visit Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate a code — influencer scans at your venue</p>
        </div>
      </div>

      {/* Generator Panel */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select offer to verify presence for
          </span>
          <select
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          >
            <option value="">— Choose an active offer —</option>
            {activeOffers.map((o) => (
              <option key={o._id} value={o._id}>
                {o.establishmentName} ({o.winCoinsPerPublication ?? o.winCoinsReward} WinCoins)
              </option>
            ))}
          </select>
        </label>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!selectedOfferId || generating}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
          {generating ? 'Generating…' : 'Generate QR Code'}
        </button>
      </div>

      {/* Active QR Display */}
      {currentQR && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 p-6 flex flex-col items-center gap-4 shadow-xl shadow-cyan-500/10">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Active QR Code</p>

          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <QRCodeSVG
              value={qrUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="text-center space-y-1">
            <p className="text-white font-bold text-base">{currentQR.label}</p>
            <p className="text-cyan-300 text-sm font-semibold">
              🪙 {currentQR.winCoins} WinCoin{currentQR.winCoins !== 1 ? 's' : ''} pending on scan
            </p>
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {timeLeft(currentQR.expiresAt)}
            </div>
          </div>

          {/* Copy token button */}
          <button
            type="button"
            onClick={copyToken}
            className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 hover:bg-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy token for manual entry'}
          </button>

          <p className="text-slate-500 text-xs text-center max-w-xs">
            Show this QR code to the influencer at your venue. Once scanned, a <strong className="text-white">pending</strong> WinCoin transfer will appear on both sides.
          </p>
        </div>
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent QR Activity</p>
          <button
            type="button"
            onClick={loadHistory}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-500 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            No QR codes generated yet
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <span className="col-span-1">Offer</span>
              <span className="col-span-1 text-center">Coins</span>
              <span className="col-span-1 text-center">Scanned by</span>
              <span className="col-span-1 text-center">Transaction</span>
            </div>

            {history.slice(0, 10).map((qr, i) => {
              const isExpired = !qr.scanned && new Date(qr.expiresAt) < Date.now();
              const isScanned = qr.scanned;

              return (
                <div
                  key={qr._id}
                  className={`grid grid-cols-4 gap-2 px-4 py-3 items-center text-sm ${
                    i % 2 === 0
                      ? 'bg-white dark:bg-slate-900/20'
                      : 'bg-slate-50/50 dark:bg-slate-800/20'
                  } border-t border-slate-100 dark:border-slate-700/30`}
                >
                  {/* Offer name */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isScanned ? 'bg-emerald-400' : isExpired ? 'bg-red-400' : 'bg-amber-400 animate-pulse'}`} />
                    <span className="truncate text-slate-700 dark:text-slate-200 text-xs font-medium">
                      {qr.label}
                    </span>
                  </div>

                  {/* WinCoins */}
                  <div className="col-span-1 text-center">
                    <span className="text-amber-500 font-bold text-xs">🪙 {qr.winCoins}</span>
                  </div>

                  {/* Scanned by — shows influencer full name */}
                  <div className="col-span-1 text-center">
                    {isScanned ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs font-semibold truncate max-w-[80px]">
                            {qr.scannedByName || 'Influencer'}
                          </span>
                        </div>
                        {qr.scannedAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(qr.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    ) : isExpired ? (
                      <span className="text-xs text-red-400 font-medium">Expired</span>
                    ) : (
                      <span className="text-xs text-amber-500 font-medium flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        Waiting
                      </span>
                    )}
                  </div>

                  {/* Transaction status — real value from DB */}
                  <div className="col-span-1 text-center">
                    {isScanned && qr.transactionStatus ? (
                      <span
                        className={`inline-block text-xs font-semibold rounded-full px-2 py-0.5 uppercase tracking-wide ${
                          qr.transactionStatus === 'completed'
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15'
                            : qr.transactionStatus === 'failed'
                            ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/15'
                            : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15'
                        }`}
                      >
                        {qr.transactionStatus === 'pending' && '⏳ '}
                        {qr.transactionStatus === 'completed' && '✅ '}
                        {qr.transactionStatus === 'failed' && '❌ '}
                        {qr.transactionStatus}
                      </span>
                    ) : isScanned ? (
                      <span className="inline-block text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15 rounded-full px-2 py-0.5 uppercase tracking-wide">
                        ⏳ pending
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {history.some((q) => q.scanned) && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
            🤖 Pending transactions will be verified and approved by AI automatically.
          </p>
        )}
      </div>
    </div>
  );
}
