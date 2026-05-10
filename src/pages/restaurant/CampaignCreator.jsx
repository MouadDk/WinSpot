import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Calendar, Clock, Image as ImageIcon, Video, AlignLeft, Send } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { restaurantNav } from '../../config/navigation.js';

const navItems = restaurantNav.map(item => ({
  ...item,
  active: item.href === '/restaurant-dashboard/campaigns',
}));

export default function CampaignCreator() {
  const { user } = useAuth();
  const [contentType, setContentType] = useState('story'); // story, post, reel

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Créer une Campagne
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Définissez vos exigences et votre budget pour attirer les bons créateurs.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Titre de la Campagne
              </label>
              <input
                type="text"
                placeholder="ex. Brunch offert pour une Story Instagram"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description et Exigences
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez ce que vous attendez de l'influenceur..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors dark:text-white resize-none"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Type de Contenu Requis
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'story', label: 'IG Story', icon: Clock },
                  { id: 'post', label: 'IG Post', icon: ImageIcon },
                  { id: 'reel', label: 'IG Reel', icon: Video },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setContentType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        contentType === type.id
                          ? 'border-[var(--brand-highlight)] bg-[rgba(123,47,255,0.08)] dark:bg-[rgba(123,47,255,0.12)] text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="font-semibold text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Date de Visite
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Heure Préférée
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Reward */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Récompense (WinCoins)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-amber-500">
                  WC
                </span>
                <input
                  type="number"
                  placeholder="200"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-colors dark:text-white font-medium"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                1 WinCoin = 1€. Nous recommandons au moins 150 WC pour un Reel.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Enregistrer le brouillon
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[var(--brand-highlight)] hover:bg-[var(--brand-primary)] shadow-md shadow-[rgba(123,47,255,0.25)] transition-all"
              >
                <Send className="w-4 h-4" />
                Publier la Campagne
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
