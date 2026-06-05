import { describe, expect, it } from 'vitest'
import { parseLandInput, validateCalculatorInputs } from './calcValidation'

describe('parseLandInput', () => {
  it('parses Indian comma format', () => {
    expect(parseLandInput('1,25,000')).toBe(125000)
  })

  it('rejects invalid text', () => {
    expect(parseLandInput('abc')).toBeNull()
  })
})

describe('validateCalculatorInputs', () => {
  it('rejects missing district', () => {
    expect(validateCalculatorInputs('gujarat', '', 2, 'acre')).toEqual({
      ok: false,
      messageKey: 'calc.errorDistrict',
    })
  })

  it('rejects zero land', () => {
    expect(validateCalculatorInputs('gujarat', 'ahmedabad', 0, 'acre')).toEqual({
      ok: false,
      messageKey: 'calc.errorLand',
    })
  })

  it('accepts valid inputs', () => {
    expect(validateCalculatorInputs('gujarat', 'ahmedabad', 2, 'acre')).toEqual({ ok: true })
  })
})
