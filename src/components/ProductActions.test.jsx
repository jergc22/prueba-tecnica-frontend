import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductActions from './ProductActions.jsx'

const oneColor = [{ code: 1000, name: 'Black' }]
const twoStorages = [
  { code: 2000, name: '16 GB' },
  { code: 2001, name: '32 GB' },
]

describe('ProductActions', () => {
  it('selecciona por defecto la opción cuando solo hay una', () => {
    render(<ProductActions colors={oneColor} storages={[{ code: 2000, name: '16 GB' }]} onAdd={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Black' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '16 GB' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeEnabled()
  })

  it('no selecciona nada por defecto si hay varias opciones y obliga a elegir', async () => {
    const user = userEvent.setup()
    render(<ProductActions colors={oneColor} storages={twoStorages} onAdd={() => {}} />)

    expect(screen.getByRole('radio', { name: '16 GB' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: '32 GB' }))
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeEnabled()
  })

  it('envía los códigos seleccionados al añadir', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ProductActions colors={oneColor} storages={twoStorages} onAdd={onAdd} />)

    await user.click(screen.getByRole('radio', { name: '32 GB' }))
    await user.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(onAdd).toHaveBeenCalledWith({ colorCode: 1000, storageCode: 2001 })
  })
})
