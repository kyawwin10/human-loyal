export function localDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = localDate(value)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function formatDate(value: string) {
  return localDate(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function addMonths(date: Date, months: number) {
  const result = new Date(date)
  const day = date.getDate()
  result.setDate(1)
  result.setMonth(result.getMonth() + months)
  result.setDate(Math.min(day, new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()))
  return result
}

export function relationshipDuration(start: string, now = new Date()) {
  const date = localDate(start)
  if (now < date) return [0, 0, 0, 0, 0, 0]
  let months = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth()
  if (addMonths(date, months) > now) months--
  const cursor = addMonths(date, months)
  let days = 0
  let next = new Date(cursor)
  next.setDate(next.getDate() + 1)
  while (next <= now) {
    cursor.setDate(cursor.getDate() + 1)
    days++
    next = new Date(cursor)
    next.setDate(next.getDate() + 1)
  }
  const seconds = Math.floor((now.getTime() - cursor.getTime()) / 1000)
  return [Math.floor(months / 12), months % 12, days, Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
}

export function birthdayCountdown(birthday: string, now = new Date()) {
  const birth = localDate(birthday)
  const occurrence = (year: number) => new Date(year, birth.getMonth(), Math.min(birth.getDate(), new Date(year, birth.getMonth() + 1, 0).getDate()))
  let target = occurrence(now.getFullYear())
  const endOfDay = new Date(target)
  endOfDay.setDate(endOfDay.getDate() + 1)
  if (now >= endOfDay) target = occurrence(now.getFullYear() + 1)
  const seconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
  return { today: now >= target && now < endOfDay, values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60] }
}