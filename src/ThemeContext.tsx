import * as React from 'react'

/**
 * A callback passed to watchTheme.
 */
export type WatchCallback<Theme> = (theme: Theme) => void

/**
 * Undoes the effect of `watchTheme`.
 */
export type Unsubscribe = () => void

export interface ThemeProviderProps {
  children?: React.ReactNode
}

type RemoveTheme<Props> = 'theme' extends keyof Props
  ? Pick<Props, Exclude<keyof Props, 'theme'>>
  : Props

/**
 * A set of tools for listening to theme changes.
 */
export interface ThemeContext<Theme> {
  // Direct theme access:
  getTheme(): Theme
  changeTheme(theme: Theme): void
  watchTheme(callback: WatchCallback<Theme>): Unsubscribe

  // React component access:
  ThemeProvider: React.ComponentType<ThemeProviderProps>
  useTheme(): Theme
  withTheme<Props extends { theme: Theme }>(
    Component: React.ComponentType<Props>
  ): React.ComponentType<RemoveTheme<Props>>
}

/**
 * Constructs a unique ThemeContext.
 * Several of these can coexist within an application.
 */
export function makeThemeContext<Theme>(theme: Theme): ThemeContext<Theme> {
  let callbacks: Array<WatchCallback<Theme>> = []
  let currentTheme: Theme = theme

  function getTheme(): Theme {
    return currentTheme
  }

  function changeTheme(theme: Theme): void {
    currentTheme = theme
    for (let i = 0; i < callbacks.length; ++i) callbacks[i](theme)
  }

  function watchTheme(callback: WatchCallback<Theme>): Unsubscribe {
    callbacks.push(callback)
    return () => {
      callbacks = callbacks.filter(item => item !== callback)
    }
  }

  const Context = React.createContext(theme)

  /**
   * Provides the current theme to the React component tree.
   */
  const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = props => {
    const [currentTheme, setCurrentTheme] = React.useState(theme)
    React.useEffect(() => watchTheme(setCurrentTheme), [])

    return (
      <Context.Provider value={currentTheme}>{props.children}</Context.Provider>
    )
  }

  function useTheme(): Theme {
    return React.useContext(Context)
  }

  function withTheme<Props extends { theme: Theme }>(
    Component: React.ComponentType<Props>
  ): React.ComponentType<RemoveTheme<Props>> {
    const WithTheme: React.FunctionComponent<RemoveTheme<Props>> = props => {
      const currentTheme = React.useContext(Context)
      // @ts-expect-error
      return <Component {...props} theme={currentTheme} />
    }
    WithTheme.displayName = `WithTheme(${componentName(Component)})`
    return WithTheme
  }

  return {
    getTheme,
    changeTheme,
    watchTheme,
    ThemeProvider,
    useTheme,
    withTheme
  }
}

/**
 * Gets a component's display name.
 */
function componentName(Component: React.ComponentType<any>): string {
  if (Component.displayName != null) return Component.displayName
  if (Component.name != null) return Component.name
  return 'Component'
}
