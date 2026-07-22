import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App bootstrap', () => {
  it('renderiza el shell base del MVP', async () => {
    render(<App />)

    expect(await screen.findByText('MVP Web POS')).toBeInTheDocument()
  })
})
