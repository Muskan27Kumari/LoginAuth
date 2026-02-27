import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ls from 'localstorage-slim'
import './index.css'
import App from './App.tsx'

ls.config.encrypt = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
