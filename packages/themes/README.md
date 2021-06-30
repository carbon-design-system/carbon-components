# @carbon/themes

> Themes for applying color in the Carbon Design System

## Getting started

To install `@carbon/themes` in your project, you will need to run the following
command using [npm](https://www.npmjs.com/):

```bash
npm install -S @carbon/themes
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command
instead:

```bash
yarn add @carbon/themes
```

## Usage

You can use `@carbon/themes` in JavaScript or Sass by including this package in
your project. By default, `@carbon/themes` provides a set of color tokens that
are pre-defined for a specific theme. Currently, we offer the following color
themes: white, gray 10, gray 90, gray 100 .

You can preview all of the token values for this on the
[Carbon Design System website](https://www.carbondesignsystem.com/guidelines/color/usage)
.

### Sass

If your project is using Sass, you can include this package and the
corresponding default theme by writing the following in your Sass file:

```scss
@import '@carbon/themes/scss/themes';
```

By default, the white theme will be initialized. If you would like to include
another theme, you can do so by setting the global theme variable and then
calling our mixin. For example:

```scss
@import '@carbon/themes/scss/themes';

$carbon--theme: $carbon--theme--g10;

// Use the gray 10 theme
@include carbon--theme();
```

Inline theming can be done by using the mixin. For example:

```scss
@import '@carbon/themes/scss/themes';

// Use the default white theme here

.my-dark-theme {
  @include carbon--theme($carbon--theme--g90) {
    // Use the dark theme here
  }
}

.my-darker-theme {
  @include carbon--theme($carbon--theme--g100) {
    // Use the darker theme here
  }
}
```

### JavaScript

If you're looking to use these themes in JavaScript, we export a variety of
bindings for you to use, including:

```js
import {
  // An object of all themes
  themes,

  // Direct theme values
  white,
  g10,
  g90,
  g100,

  // Specific token values
  interactive01,
  interactive02,
} from '@carbon/themes';
```

## 📚 Examples

If you're looking for more examples on how to use `@carbon/themes`, we have some
examples that you can check out:

- [preview-v11](./examples/preview-v11)
- [sass-modules](./examples/sass-modules)

## 🙌 Contributing

We're always looking for contributors to help us fix bugs, build new features,
or help us improve the project documentation. If you're interested, definitely
check out our [Contributing Guide](/.github/CONTRIBUTING.md)! 👀

## 📝 License

Licensed under the [Apache 2.0 License](/LICENSE).
