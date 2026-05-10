import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DarkModeProvider } from './hooks/useDarkMode.jsx'
import './index.css'

const app = (
  <BrowserRouter>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
)