import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import {AuthProvider} from "./context/AuthContext.jsx"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#ffffff",
              color: "#111827",
              padding: "14px 16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
    </AuthProvider>
  </BrowserRouter>
)
