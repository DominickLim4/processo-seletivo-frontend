import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// busca a div root no index e injeta o html
createRoot(document.getElementById('root')).render(

  // ajudar a encontrar bugs
  <StrictMode>
    <App />
  </StrictMode>,
)
