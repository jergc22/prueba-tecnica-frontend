import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('renderiza el título', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /tienda de móviles/i })).toBeInTheDocument()
  })
})
