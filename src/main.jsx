import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
// Self-hosted Inter (no external font CDN → no CSP/privacy concerns).
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Respect the OS "reduce motion" setting across all Framer Motion animations. */}
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fffdf9',
                color: '#1d1b17',
                border: '1px solid #ddd7ca',
                boxShadow: '0 10px 22px -8px rgba(120,110,90,0.28)',
              },
              success: { iconTheme: { primary: '#2e9e5b', secondary: '#fffdf9' } },
              error: { iconTheme: { primary: '#e5484d', secondary: '#fffdf9' } },
            }}
          />
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
)
