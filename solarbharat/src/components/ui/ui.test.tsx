import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AppCard } from '@/components/ui/AppCard'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataSourceBadge } from '@/components/ui/DataSourceBadge'
import { StepIndicator } from '@/components/ui/StepIndicator'

afterEach(() => cleanup())

describe('UI components', () => {
  it('renders AppCard with children', () => {
    render(<AppCard>Hello card</AppCard>)
    expect(screen.getByText('Hello card')).toBeTruthy()
  })

  it('renders primary Button', () => {
    render(<Button type="button">Calculate</Button>)
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeTruthy()
  })

  it('renders ButtonLink', () => {
    render(<ButtonLink href="/calculator">Open calculator</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Open calculator' })).toBeTruthy()
  })

  it('renders EmptyState with actions', () => {
    render(
      <EmptyState
        title="No report yet"
        body="Run the calculator first."
        primaryAction={{ href: '/calculator', label: 'Open calculator' }}
      />,
    )
    expect(screen.getByText('No report yet')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open calculator' })).toBeTruthy()
  })

  it('renders DataSourceBadge', () => {
    render(
      <DataSourceBadge
        source="nasa_power"
        label="NASA POWER"
        confidence="medium confidence"
      />,
    )
    expect(screen.getByText(/NASA POWER/)).toBeTruthy()
  })

  it('renders StepIndicator progress', () => {
    render(
      <StepIndicator steps={4} current={2} labels={['Location', 'Site', 'System', 'Map']} />,
    )
    expect(screen.getByLabelText('Progress')).toBeTruthy()
    expect(screen.getByText('Site')).toBeTruthy()
  })
})
