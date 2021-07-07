// @flow

import * as React from 'react'

/**
 * A callback passed to watchTheme.
 */
export type WatchCallback<Theme> = (theme: Theme) => void

/**
 * Undoes the effect of `watchTheme`.
 */
export type Unsubscribe = () => void

export type ThemeProviderProps = {
  children?: React.Node
}

type RemoveTheme<Theme, Props: { theme: Theme }> = $Diff<
  Props,
  { theme: Theme }
>

/**
 * A set of tools for listening to theme changes.
 */
export type ThemeContext<Theme> = {
  // Direct theme access:
  +getTheme: () => Theme,
  +changeTheme: (theme: Theme) => void,
  +watchTheme: (callback: WatchCallback<Theme>) => Unsubscribe,

  // React component access:
  +ThemeProvider: React$StatelessFunctionalComponent<ThemeProviderProps>,
  +useTheme: () => Theme,
  +withTheme: <Props: { theme: Theme }>(
    Component: React.ComponentType<Props>
  ) => React$StatelessFunctionalComponent<RemoveTheme<Theme, Props>>
}

declare export function makeThemeContext<Theme>(
  theme: Theme
): ThemeContext<Theme>

declare export function cacheStyles<Theme, Styles: Object>(
  callback: (theme: Theme) => Styles
): (theme: Theme) => Styles
