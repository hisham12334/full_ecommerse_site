import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import Home from './pages/Home'

const products = [
  { id: 1, title: "Casual Shirt", price: 999, image: "https://via.placeholder.com/300" },
  { id: 2, title: "Summer Dress", price: 1499, image: "https://via.placeholder.com/300" },
  { id: 3, title: "Jeans", price: 1999, image: "https://via.placeholder.com/300" },
  { id: 4, title: "T-Shirt", price: 799, image: "https://via.placeholder.com/300" },
  { id: 5, title: "Sneakers", price: 2499, image: "https://via.placeholder.com/300" },
  { id: 6, title: "Jacket", price: 2999, image: "https://via.placeholder.com/300" }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home 
      products={products} 
      heroImageUrl="" 
      brandLogoUrl="" 
    />
  </React.StrictMode>,
)
