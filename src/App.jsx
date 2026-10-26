import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main className="page">
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<p className="state">Página no encontrada.</p>} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  )
}
