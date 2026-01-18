// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ProductProvider } from './context/ProductContext' // Import the provider
import './styles/index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider> {/* Wrap App with the provider */}
      <App />
    </ProductProvider>
  </React.StrictMode>,
)