# @carbon/icons-react

> React components for icons in digital and software products using the Carbon
> Design System

## Getting started

To install `@carbon/icons-react` in your project, you will need to run the
following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @carbon/icons-react
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command
instead:

```bash
yarn add @carbon/icons-react
```

## Usage

Icons in this package support the following sizes: `16`, `20`, `24`, and `32`
pixels. These sizes refer to the width and height of the icon. You can import an
icon component into your project by referring to its name and size:

```jsx
import { Add24 } from '@carbon/icons-react';
```

We also provide CommonJS and UMD files in the `lib` and `umd` directories,
respectively.

To import using CommonJS, you can do the following:

```js
const { Add24 } = require('@carbon/icons-react');
```

_Note: if you would like to find the import path for an icon, you can reference
our
[Icon Library](https://www.carbondesignsystem.com/guidelines/iconography/library)_

### Icon fill

All icons from the library support being styled by the `fill` property. You can
change the color of an icon by passing in a custom class name that sets this
property (preferred), or by passing in an inline style. For example:

```css
// CSS custom class name to set the fill of the icon to `rebeccapurple`
svg.my-custom-class {
  fill: rebeccapurple;
}
```

```jsx
import { Add16 } from '@carbon/icons-react';

function MyComponent() {
  return (
    <button>
      <Add16 aria-label="Add" className="my-custom-class" />
    </button>
  );
}
```

#### Two-tone icons

Certain icons in the library support two distinct fill colors. You can target
the inner path by using the `[data-icon-path="inner-path"]` attribute selector.
For example:

```scss
// CSS custom class name to set the fill of the icon to `yellow`
svg.my-custom-class {
  fill: yellow;
}

// Use the `data-icon-path` attribute selector to target the inner path
// where we want to set the fill to `black`. We also set `opacity` to `1` so
// that this inner-path is visible.
svg.my-custom-class [data-icon-path='inner-path'] {
  fill: black;
  opacity: 1;
}
```

```jsx
import { WarningFilled16 } from '@carbon/icons-react';

function MyComponent() {
  return <WarningFilled16 aria-label="Add" className="my-custom-class" />;
}
```

### Focus and `aria-label`

By default, the icon components from `@carbon/icons-react` are treated as
decorative content. This means that we set `aria-hidden="true"` unless certain
props are passed to the component.

If you would like the icon to be announced by a screen reader, you can supply an
`aria-label` or `aria-labelledby`. For example:

```jsx
import { Add16 } from '@carbon/icons-react';

function MyComponent() {
  return (
    <button>
      <Add16 aria-label="Add" />
    </button>
  );
}
```

Doing this will add the appropriate `role` to the `<svg>` node, as well.

If you would like the `<svg>` to receive focus, you will need to pass in a
`tabIndex` value. For example:

```jsx
import { Add16 } from '@carbon/icons-react';

function MyComponent() {
  return <Add16 aria-label="Add" tabIndex="0" />;
}
```

Including `tabIndex` and `aria-label` (or `aria-labelledby`) will set the
corresponding `tabindex` on the underlying `<svg>` and verify support in older
browsers like Internet Explorer 11 by setting `focusable` to `true`.

## 🙌 Contributing

We're always looking for contributors to help us fix bugs, build new features,
or help us improve the project documentation. If you're interested, definitely
check out our [Contributing Guide](/.github/CONTRIBUTING.md)! 👀

## 📝 License

Licensed under the [Apache 2.0 License](/LICENSE).
