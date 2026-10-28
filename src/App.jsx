import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Header />
        <main className="page">
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  )
}
