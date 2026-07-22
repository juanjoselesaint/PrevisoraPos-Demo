import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('@mocks/browser')

    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

enableMocking()
  .catch((error) => {
    // El demo debe iniciar aun si MSW falla; la fake API tiene fallback en memoria.
    console.error('No se pudo iniciar MSW. Se continua sin service worker mock.', error)
  })
  .finally(() => {
    renderApp()
})
