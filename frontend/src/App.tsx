import { useEffect, useState } from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

type HealthResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      try {
        const response = await fetch(`${backendUrl}/health`);
        if (!response.ok) {
          throw new Error('Health check failed');
        }

        const data = (await response.json()) as HealthResponse;
        if (isMounted) {
          setHealth(data);
          setStatus('ready');
        }
      } catch {
        if (isMounted) {
          setStatus('error');
        }
      }
    }

    loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">WinSpot</p>
          <h1>One codebase for web, API, mobile, and auth.</h1>
          <p className="lede">
            React on the frontend, Node.js + MongoDB in the backend, Expo for mobile, and Clerk at the app entry point.
          </p>

          <header className="auth-bar">
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>

          <div className="actions">
            <a href="#stack" className="primary-button">View stack</a>
            <a href={backendUrl} className="secondary-button" target="_blank" rel="noreferrer">
              Open backend
            </a>
          </div>
        </div>

        <aside className="status-card">
          <div className={`status-badge ${status}`}>
            {status === 'loading' ? 'Checking backend' : status === 'ready' ? 'Backend online' : 'Backend unavailable'}
          </div>
          <h2>{health?.service ?? 'WinSpot API'}</h2>
          <p>{health ? `Last checked at ${new Date(health.timestamp).toLocaleTimeString()}` : 'Waiting for the API health response.'}</p>
          <pre>{JSON.stringify(health ?? { ok: false }, null, 2)}</pre>
        </aside>
      </section>

      <section id="stack" className="stack-grid">
        <article>
          <span>Frontend</span>
          <h3>React + Vite</h3>
          <p>Fast local development, modern JSX, and a clean UI foundation.</p>
        </article>
        <article>
          <span>Backend</span>
          <h3>Node.js + Express</h3>
          <p>REST-ready API layer with MongoDB connection already wired in.</p>
        </article>
        <article>
          <span>Mobile</span>
          <h3>React Native + Expo</h3>
          <p>Native mobile app starter with the same product language as the web app.</p>
        </article>
      </section>
    </main>
  );
}
