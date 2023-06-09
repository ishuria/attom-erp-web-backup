import progress from 'vite-plugin-vitebar'

export function createProgress(env: Record<string, string>) {
  return progress({ env })
}
