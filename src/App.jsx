import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="*" element={<p className="state">Página no encontrada.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
