/** URL-safe slug from a title or label (ASCII fallback for edge cases). */
export function slugify(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
  return s.length > 0 ? s : 'item'
}
