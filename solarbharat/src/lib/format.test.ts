import { describe, expect, it } from 'vitest'
import { formatCr, formatInr, formatRsLakh } from './format'

describe('formatInr', () => {
  it('formats with Indian grouping', () => {
    expect(formatInr(125000)).toBe('1,25,000')
  })
})

describe('formatCr', () => {
  it('uses crore for large values', () => {
    expect(formatCr(2.5e7)).toBe('2.50 Cr')
  })

  it('uses lakh for smaller values', () => {
    expect(formatCr(5e5)).toBe('5.00 L')
  })
})

describe('formatRsLakh', () => {
  it('shows lakh suffix', () => {
    expect(formatRsLakh(1e5)).toContain('L')
  })
})
