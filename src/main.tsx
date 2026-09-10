import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const el = document.getElementById('root')!
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered markup is hydrated; a cold dev boot mounts fresh.
if (el.hasChildNodes()) hydrateRoot(el, tree)
else createRoot(el).render(tree)
