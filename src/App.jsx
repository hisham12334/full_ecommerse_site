import './styles/index.css';


function App() {
  const sampleProducts = [
    { id: 1, title: "Cotton Shirt", price: 799, image: "https://via.placeholder.com/300" },
    { id: 2, title: "Slim Fit Jeans", price: 1299, image: "https://via.placeholder.com/300" },
    { id: 3, title: "Sneakers", price: 1999, image: "https://via.placeholder.com/300" },
  ]

  return (
    <HMHome
      products={sampleProducts}
      heroImageUrl="https://via.placeholder.com/1200x600"
      brandLogoUrl="https://via.placeholder.com/100x40"
    />
  )
}

export default App
