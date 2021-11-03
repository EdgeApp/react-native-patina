# react-native-patina

## 0.1.6 (2021-11-02)

- fixed: Close a race condition in `ThemeProvider`.

## 0.1.5 (2021-07-28)

- fixed: Fix the Flow component-type definitions, so props-checking works again.
- fixed: Stop including raw source code in the NPM package.

## 0.1.4 (2021-07-07)

- fixed: Be more explicit about component return types, to help Flow & Typescript return more accurate errors.

## 0.1.3 (2020-08-19)

- fixed: The `ThemeProvider` component would incorrectly provide the initial theme, even if the theme had been changed.

## 0.1.2 (2020-08-06)

- fixed: Fix more Typescript type definitions:
  - Export `ThemeProviderProps`.
  - Tighten `cacheStyles` to require valid React Native styles as its return type.
- changed: Switch to hooks internally for shorter code.

## 0.1.1 (2020-07-02)

- fixed: Fix the user-facing type definitions:
  - `cacheStyles` no longer turns the style types into `unknown`.
  - `ThemeProvider` and `withTheme` use `React.ComponentType` now.

## 0.1.0 (2020-06-27)

- Initial release.
