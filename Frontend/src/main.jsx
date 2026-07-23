import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry } from './lib/sentry.js'

// Fire and forget: initSentry is a no-op when VITE_SENTRY_DSN is unset,
// and lazy-loads the SDK when it isn't. Errors during init should never
// block the app from rendering.
initSentry().catch(() => {})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
