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
  getTheme: () => Theme
  changeTheme: (theme: Theme) => void
  watchTheme: (callback: WatchCallback<Theme>) => Unsubscribe

  // React component access:
  ThemeProvider: (props: ThemeProviderProps) => JSX.Element
  useTheme: () => Theme
  withTheme: <Props extends { theme: Theme }>(
    Component: React.ComponentType<Props>
  ) => (props: RemoveTheme<Props>) => JSX.Element
}

/**
 * Constructs a unique ThemeContext.
 * Several of these can coexist within an application.
 */
export function makeThemeContext<Theme>(
  initialTheme: Theme
): ThemeContext<Theme> {
  let callbacks: Array<WatchCallback<Theme>> = []
  let theme: Theme = initialTheme
  const Context = React.createContext(theme)

  function getTheme(): Theme {
    return theme
  }

  function changeTheme(nextTheme: Theme): void {
    theme = nextTheme
    for (let i = 0; i < callbacks.length; ++i) callbacks[i](theme)
  }

  function watchTheme(callback: WatchCallback<Theme>): Unsubscribe {
    callbacks.push(callback)
    return () => {
      callbacks = callbacks.filter(item => item !== callback)
    }
  }

  function ThemeProvider(props: ThemeProviderProps): JSX.Element {
    const [themeState, setThemeState] = React.useState(theme)
    React.useEffect(
      () => {
        if (theme !== themeState) setThemeState(theme)
        return watchTheme(setThemeState)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    return (
      <Context.Provider value={themeState}>{props.children}</Context.Provider>
    )
  }

  function useTheme(): Theme {
    return React.useContext(Context)
  }

  function withTheme<Props extends { theme: Theme }>(
    Component: React.ComponentType<Props>
  ): (props: RemoveTheme<Props>) => JSX.Element {
    function WithTheme(props: RemoveTheme<Props>): JSX.Element {
      const theme = React.useContext(Context)
      // @ts-expect-error
      return <Component {...props} theme={theme} />
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
