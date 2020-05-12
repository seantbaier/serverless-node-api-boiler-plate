export default function properCase(value) {
  const safeValue = (value || '').trim()
  if (safeValue.length === 0) {
    return ''
  }

  const parts = safeValue
    .split(' ')
    .map((v) => v[0].toUpperCase() + v.substring(1).toLowerCase())

  return parts.join(' ')
}
