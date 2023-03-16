import progress from 'vite-plugin-vitebar'

export function createProgress(env: any) {
  return progress({ env })
}
