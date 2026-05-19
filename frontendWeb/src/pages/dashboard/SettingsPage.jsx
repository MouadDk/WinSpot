import { useState, useEffect } from 'react';
import { User, Lock, Trash2, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

/**
 * SettingsPage — shared by both merchant and customer dashboards.
 * Handles: profile update (firstName, lastName, phone, category for merchants),
 * password change, and a safe account deletion request section.
 *
 * Backend APIs used:
 *   GET  /api/users/me     — load current profile
 *   PUT  /api/users/me     — update profile fields
 *   POST /api/auth/login   — verify current password before change (re-auth)
 */
export default function SettingsPage() {
  const { user, token, login } = useAuth();
  const isMerchant = user?.role === 'merchant';

  // ── Profile form ────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', category: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text }

  // ── Password form ────────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  // Load current profile on mount
  useEffect(() => {
    if (!token) return;
    fetch(apiUrl('/api/users/me'), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.user) {
          setProfile({
            firstName: d.user.firstName || '',
            lastName: d.user.lastName || '',
            phone: d.user.phone || '',
            category: d.user.category || '',
          });
        }
      })
      .catch(() => {});
  }, [token]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const payload = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
        ...(isMerchant ? { category: profile.category } : {}),
      };
      const res = await fetch(apiUrl('/api/users/me'), {
        method: 'PUT',
        headers: authHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message);
      // Update local auth context so header name refreshes
      login(token, { ...user, ...payload });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.next.length < 8) {
      return setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
    }
    if (pwForm.next !== pwForm.confirm) {
      return setPwMsg({ type: 'error', text: 'New passwords do not match.' });
    }
    setPwSaving(true);
    try {
      // Re-authenticate with current password first
      const loginRes = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: pwForm.current }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success) throw new Error('Current password is incorrect.');

      // TODO: wire to a dedicated PUT /api/auth/change-password endpoint
      // For now, show informational message since the endpoint doesn't exist yet
      setPwMsg({ type: 'error', text: 'Password change endpoint not yet implemented on the backend. Add PUT /api/auth/change-password.' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwSaving(false);
    }
  };

  const merchantCategories = ['Restaurant', 'Bar', 'Café', 'Hotel', 'Other'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, security, and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ── Profile Section ── */}
        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information</p>
            </div>
          </div>

          {profileMsg && (
            <div className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              profileMsg.type === 'success'
                ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
            }`}>
              {profileMsg.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+212 6XX XXX XXX"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {isMerchant && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Category</label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {merchantCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-cyan-500 transition-all disabled:opacity-70"
            >
              {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </form>
        </section>

        {/* ── Security Section ── */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Password</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Change your login password</p>
              </div>
            </div>

            {pwMsg && (
              <div className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                pwMsg.type === 'success'
                  ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
              }`}>
                {pwMsg.type === 'success'
                  ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key: 'current', label: 'Current Password', showKey: 'current' },
                { key: 'next', label: 'New Password', showKey: 'next' },
                { key: 'confirm', label: 'Confirm New Password', showKey: 'next' },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[showKey] ? 'text' : 'password'}
                      value={pwForm[key]}
                      onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 pr-12 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                    {key !== 'confirm' && (
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => ({ ...s, [showKey]: !s[showKey] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPw[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-400 px-4 py-3 font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-600 hover:to-fuchsia-500 transition-all disabled:opacity-70"
              >
                {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Change Password
              </button>
            </form>
          </section>

          {/* ── Danger Zone ── */}
          <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-red-100 dark:border-red-500/20 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible account actions</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Deleting your account will permanently remove all your data including{' '}
              {isMerchant ? 'offers, redemption history, and wallet balance.' : 'cashback history and wallet balance.'}
              {' '}This action cannot be undone.
            </p>
            <button
              onClick={() => alert('To delete your account, please contact support@winspot.ma')}
              className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Request Account Deletion
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
