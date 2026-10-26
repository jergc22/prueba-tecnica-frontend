import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { safeStorage } from '../lib/storage.js'

afterEach(() => {
  cleanup()
  safeStorage.clear()
})
