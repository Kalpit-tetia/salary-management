import { describe, it, expect } from 'vitest'
import { formatSalary, formatNumber, formatDate, STATUS_LABELS } from '../lib/utils'

describe('formatSalary', () => {
  it('formats USD by default', () => {
    expect(formatSalary(150000)).toBe('$150,000')
  })

  it('formats INR correctly', () => {
    const result = formatSalary(1500000, 'INR')
    expect(result).toContain('1,500,000')
  })

  it('formats zero salary', () => {
    expect(formatSalary(0)).toBe('$0')
  })
})

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(10000)).toBe('10,000')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2022-03-15T00:00:00.000Z')
    expect(result).toContain('2022')
    expect(result).toContain('Mar')
  })
})

describe('STATUS_LABELS', () => {
  it('maps all statuses to readable labels', () => {
    expect(STATUS_LABELS.ACTIVE).toBe('Active')
    expect(STATUS_LABELS.INACTIVE).toBe('Inactive')
    expect(STATUS_LABELS.ON_LEAVE).toBe('On Leave')
  })
})
