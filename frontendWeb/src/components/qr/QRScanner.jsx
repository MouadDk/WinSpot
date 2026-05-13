import { useState, useEffect, useRef } from 'react';
import { QrCode, Loader2, CheckCircle2, AlertCircle, KeyRound, Clock, RefreshCw, Upload, Image as ImageIcon, Info } from 'lucide-react';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

export default function QRScanner({ token }) {
  const [mode, setMode] = useState('manual'); // 'manual' only on web; camera on mobile
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { success, message, transaction, qrVisit }
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [uploadingFor, setUploadingFor] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-fill from URL ?token= (for when merchant shares QR link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setManualToken(t);
  }, []);

  const loadHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(apiUrl('/api/qr/pending'), { headers: authHeaders(token) });
      const data = await parseApiResponse(res);
      if (data.success) setHistory(data.qrVisits || []);
    } catch {
      // Silent
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleScan = async () => {
    if (!manualToken.trim()) return;
    setScanning(true);
    setResult(null);

    try {
      const res = await fetch(apiUrl('/api/qr/scan'), {
        method: 'POST',
        headers: authHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ token: manualToken.trim() }),
      });

      let data;
      try {
        data = await parseApiResponse(res);
      } catch (err) {
        data = { success: false, message: err.message };
      }

      setResult(data);
      if (data.success) {
        setManualToken('');
        await loadHistory();
      }
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setScanning(false);
    }
  };

  const triggerUpload = (transactionId) => {
    setUploadingFor(transactionId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('transactionId', uploadingFor);

    try {
      const res = await fetch(apiUrl('/api/ai/verify-scan'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        if (data.status === 'approved') {
          alert('✅ Uploaded! Your image is now in review.');
        } else {
          alert('✅ Uploaded! Your image is now in review.');
        }
        await loadHistory();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <QrCode className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">QR Visit Check-In</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Scan at the venue to prove presence & earn WinCoins</p>
        </div>
      </div>

      {/* Manual entry panel */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
          <KeyRound className="w-4 h-4 text-purple-500" />
          Enter QR token manually (or scan with your phone camera)
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="Paste the QR token here…"
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
          />
          <button
            type="button"
            onClick={handleScan}
            disabled={!manualToken.trim() || scanning}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 font-bold text-white text-sm shadow-lg shadow-purple-500/20 transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            {scanning ? 'Verifying…' : 'Verify'}
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          💡 On your phone, use your camera app to scan the QR code displayed by the merchant — the link will auto-fill the token.
        </p>
      </div>

      {/* Scan result */}
      {result && (
        <div
          className={`rounded-2xl border p-5 flex items-start gap-4 ${
            result.success
              ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10'
              : 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-bold text-sm ${result.success ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
              {result.success ? '✅ Presence verified!' : '❌ Scan failed'}
            </p>
            <p className={`text-sm mt-1 ${result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.message}
            </p>
            {result.success && result.transaction && (
              <div className="mt-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/20 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Amount</span>
                  <span className="text-sm font-bold text-amber-500">🪙 {result.transaction.amount} WinCoin{result.transaction.amount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide bg-amber-100 dark:bg-amber-500/15 rounded-full px-2 py-0.5">
                    ⏳ {result.transaction.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Venue</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">{result.qrVisit?.label}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* My visit history */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" />
            My Visit History
          </p>
          <button
            type="button"
            onClick={loadHistory}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-500 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading history…
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            No venue check-ins yet. Scan a merchant's QR code to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((qr) => {
              const txStatus = qr.transactionId?.status || 'pending';
              const txId = qr.transactionId?._id;
              const isUploadingThis = uploadingFor === txId;

              return (
                <div
                  key={qr._id}
                  className="flex flex-col gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {qr.label || qr.offerId?.establishmentName || 'Visit'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(qr.scannedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-extrabold text-amber-500">🪙 {qr.winCoins}</span>
                      {txStatus === 'pending' && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15 rounded-full px-2 py-0.5 uppercase tracking-wider">
                          PENDING
                        </span>
                      )}
                      {txStatus === 'in_review' && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/15 rounded-full px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> WAITING AI
                        </span>
                      )}
                      {txStatus === 'completed' && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 rounded-full px-2 py-0.5 uppercase tracking-wider">
                          APPROVED
                        </span>
                      )}
                      {txStatus === 'failed' && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/15 rounded-full px-2 py-0.5 uppercase tracking-wider">
                          DENIED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions depending on status */}
                  {txStatus === 'in_review' && (
                    <div className="mt-1 flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[80%] leading-relaxed">
                        Your image has been uploaded and is waiting for AI and admin validation.
                      </p>
                    </div>
                  )}
                  {txStatus === 'pending' && (
                    <div className="mt-1 flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[60%] leading-relaxed">
                        Upload your publication photo for AI verification to receive your WinCoins.
                      </p>
                      <button
                        onClick={() => txId && triggerUpload(txId)}
                        disabled={isUploadingThis}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm shadow-purple-500/20"
                      >
                        {isUploadingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        {isUploadingThis ? 'Analyzing...' : 'Upload Image'}
                      </button>
                    </div>
                  )}

                  {txStatus === 'failed' && (
                    <div className="mt-1 flex items-center justify-between pt-3 border-t border-red-100 dark:border-red-900/20">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                        <p className="text-xs text-red-600 dark:text-red-400 max-w-[80%] leading-relaxed">
                          Your image did not meet the requirements or was missing the required tag.
                        </p>
                      </div>
                      <button
                        onClick={() => alert("Please send an email to support@pub2win.com or use the contact form.")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Contact Support
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
