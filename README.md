# react-native-patina

This tiny theming library has two main parts:

- [A `ThemeContext` object](#using-themecontext) distributes the current theme througout your app.
- [A `cacheStyles` helper](#using-cachestyles) caches calls to `StyleSheet.create`.

You can use these parts either together or separately. Both come with deep, automatic support for both Flow & Typescript.

This library is unopinionated about what a theme should contain. A "theme" is just a plain Javascript object with whatever properties you like (including methods). Here is an example of a pair of themes:

```tsx
const darkTheme = {
  backgroundColor: '#000000',
  foregroundColor: '#ffffff',
  rem: (size: number) => Math.round(size * 16)
}

const lightTheme = {
  ...darkTheme,
  backgroundColor: '#ffffff',
  foregroundColor: '#000000'
}

type AppTheme = typeof darkTheme
```

## Using ThemeContext

The `ThemeContext` object can help distribute a theme object throughout your app. Compared to just using the React context API directly, `ThemeContext` adds a way for non-React code to also get access to the current theme. This can be important if you have Redux actions or other logic that might also care about appearances.

First, create a `ThemeContext` object based on your initial theme:

```tsx
import { makeThemeContext } from 'react-native-patina'

// The ThemeContext contains a bunch of methods your app
// can call directly:
export const {
  ThemeProvider,
  useTheme,
  withTheme,
  changeTheme,
  getTheme,
  watchTheme
} = makeThemeContext(darkTheme)
```

Next, use the `ThemeContext.ThemeProvider` component to inject the current theme into your React component tree:

```tsx
const YourApp = () => (
  <ThemeProvider>
    <AllYourScenes />
  </ThemeProvider>
)
```

The `ThemeContext.useTheme` hook lets your function-style components access the current theme:

```tsx
const HeaderText = props => {
  const theme = useTheme()

  // Note: See cacheStyles for how to optimize this:
  const style = {
    color: theme.foregroundColor,
    fontSize: theme.rem(1.2)
  }
  return <Text style={style}>{props.message}</Text>
}
```

Or, if you are using class-based components, use the `ThemeContext.withTheme` wrapper to inject a `theme` property into your component:

```tsx
class HeaderTextInner {
  render() {
    const { theme } = this.props

    // Note: See cacheStyles for how to optimize this:
    const style = {
      color: theme.foregroundColor,
      fontSize: theme.rem(1.2)
    }
    return <Text style={style}>{this.props.message}</Text>
  }
}

export const HeaderText = withTheme(HeaderTextInner)
```

To change the current theme, just call `ThemeContext.changeTheme`:

```tsx
changeTheme(lightTheme)
```

This will automatically re-render any React components that use the theme.

If non-React code needs to access the theme, use `ThemeContext.getTheme` to read the current theme:

```tsx
StatusBar.setBackgroundColor(getTheme().statusBarColor)
```

You can also use `ThemeProvider.watchTheme` to subscribe to updates:

```tsx
const unsubscribe = watchTheme(theme => {
  StatusBar.setBackgroundColor(theme.statusBarColor)
})

// Call unsubscribe() later if you want to clean up.
```

## Using cacheStyles

The examples above use inline React Native styles, which are slow. Your app will perform much better if it uses `StyleSheet.create` to build its style sheets ahead of time. On the other hand, just calling `StyleSheet.create` at startup won't work, because then the styles won't change when the theme changes.

The `cacheStyles` helper function solves this by memoizing (caching) calls to `StyleSheet.create`:

```tsx
import { cacheStyles } from 'react-native-patina'

export const getStyles = cacheStyles((theme: AppTheme) => ({
  header: {
    color: theme.foregroundColor,
    fontSize: theme.rem(1.2)
  },

  text: {
    color: theme.foregroundColor,
    fontSize: theme.rem(1)
  }
}))
```

This example uses `cacheStyles` to wrap a `getStyles` function with caching. This `getStyles` function accepts the current theme and returns a matching set of styles. From then on, as long as the theme doesn't change, `getStyles` will continue to return the same cached value:

```tsx
const HeaderText = props => {
  const theme = ThemeContext.useTheme()
  const styles = getStyles(theme)

  return <Text style={styles.header}>{props.message}</Text>
}
```

By default, `cacheStyles` will only remember the last-used theme. If your app frequently switches between several themes, you can increase the cache size to keep more than one style sheet around at once:

```tsx
import { setCacheSize } from 'react-native-patina'

setCacheSize(4) // Remember style sheets for the last 4 themes
```
