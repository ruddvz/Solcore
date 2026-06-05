import { describe, expect, it } from 'vitest'
import { calculateFinancials } from './finance'
import { fallbackSolar, resolveStateForCalculator } from './region'

const GOLDEN_DISTRICTS: { stateId: string; districtId: string; land: number; unit: 'acre' | 'hectare' }[] = [
  { stateId: 'gujarat', districtId: 'surat', land: 10, unit: 'acre' },
  { stateId: 'rajasthan', districtId: 'jaisalmer', land: 25, unit: 'acre' },
  { stateId: 'karnataka', districtId: 'bengaluru-urban', land: 5, unit: 'acre' },
  { stateId: 'tamil-nadu', districtId: 'chennai', land: 8, unit: 'acre' },
  { stateId: 'maharashtra', districtId: 'pune', land: 12, unit: 'acre' },
  { stateId: 'uttar-pradesh', districtId: 'lucknow', land: 15, unit: 'acre' },
  { stateId: 'punjab', districtId: 'ludhiana', land: 10, unit: 'acre' },
  { stateId: 'kerala', districtId: 'thiruvananthapuram', land: 4, unit: 'acre' },
  { stateId: 'west-bengal', districtId: 'kolkata', land: 6, unit: 'acre' },
  { stateId: 'madhya-pradesh', districtId: 'bhopal', land: 20, unit: 'acre' },
  { stateId: 'himachal-pradesh', districtId: 'shimla', land: 3, unit: 'hectare' },
  { stateId: 'assam', districtId: 'kamrup-metropolitan', land: 7, unit: 'acre' },
]

describe('financial golden scenarios', () => {
  for (const row of GOLDEN_DISTRICTS) {
    it(`${row.stateId}/${row.districtId} produces sane outputs`, () => {
      const state = resolveStateForCalculator(row.stateId, row.districtId, fallbackSolar(22))
      expect(state).not.toBeNull()
      const fin = calculateFinancials({
        state: state!,
        landValue: row.land,
        landUnit: row.unit,
        technologyId: 'topcon_bifacial',
      })

      expect(fin.systemKwp).toBeGreaterThan(0)
      expect(fin.totalCapexRs).toBeGreaterThan(0)
      expect(fin.year1UnitsLakh).toBeGreaterThan(0)
      expect(Number.isFinite(fin.netProfit25YrsRs)).toBe(true)
      if (fin.returnMultiple25 > 0) {
        expect(fin.netProfit25YrsRs).toBeGreaterThan(0)
      }
      if (fin.breakevenYear !== null) {
        expect(fin.breakevenYear).toBeGreaterThan(0)
        expect(fin.breakevenYear).toBeLessThanOrEqual(25)
      }
      expect(fin.subsidyAmountRs).toBeLessThanOrEqual(fin.totalCapexRs)
    })
  }

  it('high tariff state yields higher year-1 revenue than low tariff at same size', () => {
    const high = resolveStateForCalculator('rajasthan', 'jaisalmer', fallbackSolar(27))
    const low = resolveStateForCalculator('kerala', 'thiruvananthapuram', fallbackSolar(8))
    expect(high && low).toBeTruthy()
    const a = calculateFinancials({
      state: high!,
      landValue: 10,
      landUnit: 'acre',
      technologyId: 'topcon_bifacial',
    })
    const b = calculateFinancials({
      state: low!,
      landValue: 10,
      landUnit: 'acre',
      technologyId: 'topcon_bifacial',
    })
    const revA = a.yearly[0]?.grossRevenueRs ?? 0
    const revB = b.yearly[0]?.grossRevenueRs ?? 0
    if (high!.tariffMaxRs > low!.tariffMaxRs) {
      expect(revA).toBeGreaterThanOrEqual(revB)
    }
  })

  it('zero land yields zero capacity', () => {
    const state = resolveStateForCalculator('gujarat', 'surat', fallbackSolar(21))
    const fin = calculateFinancials({
      state: state!,
      landValue: 0,
      landUnit: 'acre',
      technologyId: 'topcon_bifacial',
    })
    expect(fin.systemKwp).toBe(0)
    expect(fin.year1UnitsLakh).toBe(0)
  })

  it('Gujarat Surat 10 acres snapshot', () => {
    const state = resolveStateForCalculator('gujarat', 'surat', fallbackSolar(21))
    const fin = calculateFinancials({
      state: state!,
      landValue: 10,
      landUnit: 'acre',
      technologyId: 'topcon_bifacial',
    })
    expect({
      systemKwp: fin.systemKwp,
      totalCapexRs: fin.totalCapexRs,
      year1UnitsLakh: fin.year1UnitsLakh,
      breakevenYear: fin.breakevenYear,
    }).toMatchInlineSnapshot(`
      {
        "breakevenYear": null,
        "systemKwp": 2000,
        "totalCapexRs": 138528000,
        "year1UnitsLakh": 33.16,
      }
    `)
  })
})
