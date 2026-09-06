import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './components/ui/ToastContainer'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  </StrictMode>,
)