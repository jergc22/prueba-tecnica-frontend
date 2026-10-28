import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { safeStorage } from '../lib/storage.js'

// jsdom no implementa scrollTo.
window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
  safeStorage.clear()
})
