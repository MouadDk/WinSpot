import { useAuth } from '../../context/AuthContext.jsx';
import { Crown, Check, Shield, Zap, Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { restaurantNav } from '../../config/navigation.js';

const navItems = restaurantNav.map(item => ({
  ...item,
  active: item.href === '/restaurant-dashboard/subscriptions',
}));

const plans = [
  {
    name: 'Delta',
    price: 'Free',
    description: 'Perfect for testing the platform.',
    features: ['1 Active Campaign', 'Basic Analytics', 'Standard Support'],
    color: 'from-slate-500 to-slate-600',
    icon: Shield,
  },
  {
    name: 'Beta',
    price: '€49/mo',
    description: 'Great for small local businesses.',
    features: ['3 Active Campaigns', 'Advanced Analytics', 'Priority Support', 'Access to Micro-influencers'],
    color: 'from-[var(--brand-primary)] to-[var(--brand-highlight)]',
    icon: Zap,
    recommended: true,
  },
  {
    name: 'Alpha',
    price: '€99/mo',
    description: 'For growing establishments.',
    features: ['10 Active Campaigns', 'Full Analytics Dashboard', 'Dedicated Account Manager', 'Access to Macro-influencers'],
    color: 'from-[var(--brand-secondary)] to-[var(--brand-highlight)]',
    icon: Star,
  },
  {
    name: 'Omega',
    price: 'Custom',
    description: 'Enterprise solution for franchises.',
    features: ['Unlimited Campaigns', 'Custom Integrations', 'White-glove Service', 'API Access'],
    color: 'from-[var(--brand-primary)] to-[var(--brand-gradient-end)]',
    icon: Crown,
  },
];

export default function PremiumSubscriptions() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Abonnements Premium
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Choisissez le plan adapté à votre établissement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-sm border flex flex-col ${
                plan.recommended
                  ? 'border-[var(--brand-highlight)] shadow-[0_24px_60px_-30px_rgba(123,47,255,0.45)]'
                  : 'border-slate-200 dark:border-slate-800'
              } overflow-hidden transition-all hover:shadow-lg`}
            >
              {plan.recommended && (
                <div className="absolute top-0 inset-x-0 bg-[var(--brand-highlight)] text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${plan.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
                    plan.recommended
                      ? 'bg-[var(--brand-highlight)] hover:bg-[var(--brand-primary)] text-white shadow-md shadow-[rgba(123,47,255,0.25)]'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contacter les ventes' : 'Sélectionner ce plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
