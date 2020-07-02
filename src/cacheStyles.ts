import { StyleSheet } from 'react-native'

let cacheSize = 1

/**
 * Memoizes a theme-to-stylesheet conversion function.
 */
export function cacheStyles<Theme, Styles>(
  callback: (theme: Theme) => Styles
): (theme: Theme) => Styles {
  const cache: Array<{ theme: Theme; style: Styles }> = []

  return function styleCache(theme: Theme) {
    // Quickly try the first cache entry:
    if (cache.length > 0 && cache[0].theme === theme) return cache[0].style

    // If we have a deeper cache entry, recycle it to the front:
    for (let i = 1; i < cache.length; ++i) {
      if (cache[i].theme === theme) {
        const [row] = cache.splice(i, 1)
        cache.splice(0, 0, row)
        return cache[0].style
      }
    }

    // Ok, this our first time seeing this theme:
    const style = StyleSheet.create(callback(theme))
    cache.unshift({ theme, style })
    if (cache.length > cacheSize) cache.splice(-1, 1)
    return style
  }
}

/**
 * Adjusts the number of style objects `cacheStyles` should remember.
 */
export function setCacheSize(size: number): void {
  cacheSize = size
}
