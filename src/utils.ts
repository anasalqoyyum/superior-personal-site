export function toWordCase(str: string): string {
  return str.replace(/\w\S*/g, word => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  })
}
