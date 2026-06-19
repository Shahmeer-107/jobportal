import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

     <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
      theme="light"
      gap={10}
      toastOptions={{
        style: { fontFamily: "inherit" },
      }}
    />

  </StrictMode>,
)
