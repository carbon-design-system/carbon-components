# `@carbon/themes`

_Note: this documentation is used with the next version of `@carbon/themes`
which uses Sass Modules. It will not work in the current stable version of this
package_

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Usage](#usage)
- [FAQ](#faq)
  - [Why are the themes not exported in `@carbon/themes`?](#why-are-the-themes-not-exported-in-carbonthemes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Usage

There are several entrypoints that you can use with `@carbon/themes`, including:

| Filename                                     | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `@use '@carbon/themes';`                     | Package entrypoint                                     |
| `@use '@carbon/themes/scss/modules/config';` | Specify config options for the package                 |
| `@use '@carbon/themes/scss/modules/themes';` | Theme definitions for white, g10, g90, and g100        |
| `@use '@carbon/themes/scss/modules/theme';`  | Set the current theme, get token values from the theme |
| `@use '@carbon/themes/scss/modules/tokens';` | Access theme tokens                                    |
| `@use '@carbon/themes/scss/compat/themes';`  | v10 Theme definitions for white, g10, g90, and g100    |
| `@use '@carbon/themes/scss/compat/tokens';`  | v10 theme tokens                                       |

_Note: the white, g10, g90, and g100 themes are only available in the
`scss/modules/themes` file and are not re-exported in `@carbon/themes`. To learn
more, checkout our [FAQ](#why-are-the-themes-not-exported-in-carbonthemes)._

You can bring in `@carbon/themes` by using `@use`:

```scss
@use '@carbon/themes';

.my-component {
  // Use tokens from the theme, this will map to a CSS Custom Property
  color: themes.$token-01;
}

:root {
  // Emit CSS Custom Properties for the current theme
  @include themes.theme();
}

// Get the value of a specific token
$custom-variable: rgba(themes.get('token-01'), 0.25);
```

You can configure the current theme with the `$theme` option:

```scss
@use '@carbon/themes/scss/modules/themes';
@use '@carbon/themes' with (
  $theme: themes.$g100,
);
```

You can also extend the theme with your own custom tokens:

```scss
@use '@carbon/themes/scss/modules/themes';
@use '@carbon/themes' with (
  $fallback: themes.$g100,
  $theme: (
    token-01: #000000,
  ),
);
```

## Tokens

TODO

## FAQ

### Why are the themes not exported in `@carbon/themes`?

In order to support `@use '@carbon/themes' with` in Sass Modules, unfortunately
we cannot re-export the themes available in `scss/modules/themes`. If we
implemented the entrypoint at `@carbon/themes` to re-export that module, then
Sass would not compile when doing the following:

```scss
@use '@carbon/themes/scss/modules/themes';
@use '@carbon/themes' with (
  $theme: themes.$g100,
);
```

This is because the `scss/modules/themes` file will have been initialized twice
which is not allowed in the Sass Module system.
