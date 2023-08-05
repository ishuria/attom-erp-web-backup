export const getImageUrl = (name: string): string => new URL(`../${name}`, import.meta.url).href
