# react-native-patina

## 0.1.2 (2020-08-06)

- Fix more Typescript type definitions:
  - Export `ThemeProviderProps`.
  - Tighten `cacheStyles` to require valid React Native styles as its return type.
- Switch to hooks internally for shorter code.

## 0.1.1 (2020-07-02)

- Fix the user-facing type definitions:
  - `cacheStyles` no longer turns the style types into `unknown`.
  - `ThemeProvider` and `withTheme` use `React.ComponentType` now.

## 0.1.0 (2020-06-27)

- Initial release.
