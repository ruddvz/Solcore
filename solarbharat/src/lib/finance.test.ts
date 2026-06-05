import { describe, expect, it } from 'vitest'
import { acresToMwAc, landToAcres } from './finance'

describe('landToAcres', () => {
  it('converts hectare to acres', () => {
    expect(landToAcres(1, 'hectare')).toBeCloseTo(2.4711, 3)
  })
})

describe('acresToMwAc', () => {
  it('uses 0.2 MW per acre', () => {
    expect(acresToMwAc(10)).toBe(2)
  })
})
