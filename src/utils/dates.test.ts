import { describe, expect, it } from 'vitest'
import { birthdayCountdown, isValidDate, localDate, relationshipDuration } from './dates'
import { loveStory } from '../config/loveStory'

describe('editable anniversary date', () => {
  it('accepts valid date-picker values including leap days', () => {
    expect(isValidDate('2024-03-15')).toBe(true)
    expect(isValidDate('2024-02-29')).toBe(true)
  })
  it('rejects empty, malformed, and impossible saved dates', () => {
    for (const value of ['', '15/03/2024', '2025-02-29', '2024-02-30', '2024-13-01']) {
      expect(isValidDate(value)).toBe(false)
    }
  })
})

describe('relationship duration', () => {
  it('uses the anniversary from the central configuration and advances in seconds', () => {
    const now = localDate(loveStory.dates.anniversary)
    expect(relationshipDuration(loveStory.dates.anniversary, now)).toEqual([0, 0, 0, 0, 0, 0])
    now.setSeconds(1)
    expect(relationshipDuration(loveStory.dates.anniversary, now)).toEqual([0, 0, 0, 0, 0, 1])
  })
  it('recalculates all units when a different anniversary date is supplied', () => {
    expect(relationshipDuration('2024-03-15', new Date(2026, 9, 8, 13, 24, 50))).toEqual([2, 6, 23, 13, 24, 50])
  })
  it('uses complete calendar years and months with live time units', () => {
    expect(relationshipDuration('2024-03-01', new Date(2026, 9, 8, 13, 24, 50))).toEqual([2, 7, 7, 13, 24, 50])
  })
  it('clamps end-of-month anniversaries to short months', () => {
    expect(relationshipDuration('2024-01-31', new Date(2024, 1, 29))).toEqual([0, 1, 0, 0, 0, 0])
  })
  it('does not show negative elapsed time for a future anniversary', () => {
    expect(relationshipDuration('2030-01-01', new Date(2026, 9, 8))).toEqual([0, 0, 0, 0, 0, 0])
  })
})

describe('birthday countdown', () => {
  it('celebrates the entire birthday', () => {
    expect(birthdayCountdown('2000-05-20', new Date(2026, 4, 20, 12))).toEqual({ today: true, values: [0, 0, 0, 0] })
  })
  it('rolls forward after the birthday has passed', () => {
    const result = birthdayCountdown('2000-05-20', new Date(2026, 4, 21))
    expect(result.today).toBe(false)
    expect(result.values[0]).toBeGreaterThan(360)
  })
  it('observes February 29 on February 28 in non-leap years', () => {
    expect(birthdayCountdown('2000-02-29', new Date(2025, 1, 28, 10)).today).toBe(true)
  })
  it('parses dates at local midnight', () => {
    expect(localDate('2024-03-01').getHours()).toBe(0)
    expect(localDate('2024-03-01').getDate()).toBe(1)
  })
})