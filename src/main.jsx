import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1b2435',
              color: '#e9eef5',
              border: '1px solid #344768',
            },
            success: { iconTheme: { primary: '#2faa57', secondary: '#11161f' } },
            error: { iconTheme: { primary: '#e23b2e', secondary: '#11161f' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
