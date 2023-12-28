# Stylelint Value No Unknown Custom Properties [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![test][test-badge]][test-url]
[![Discord][discord-badge]][discord]

[Stylelint Value No Unknown Custom Properties] is a [stylelint] rule to disallow usage of
unknown custom properties.

## Usage

Add [stylelint] and [Stylelint Value No Unknown Custom Properties] to your project.

```bash
npm install stylelint stylelint-value-no-unknown-custom-properties --save-dev
```

Add [Stylelint Value No Unknown Custom Properties] to your [stylelint configuration].

```js
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "csstools/value-no-unknown-custom-properties": true || null
  }
}
```

## Options

### true

If the first option is `true`, then [Stylelint Value No Unknown Custom Properties]
requires all custom properties to be known, and the following patterns are
_not_ considered violations:

```css
:root {
  --brand-blue: #33f;
}

.example {
  color: var(--brand-blue);
}
```

```css
.example {
  color: var(--brand-blue);
}

.some-other-class {
  --brand-blue: #33f;
}
```

```css
:root {
  --brand-blue: #33f;
  --brand-color: var(--brand-blue);
}
```

While the following patterns are considered violations:

```css
.example {
  color: var(--brand-blue);
}
```

```css
:root {
  --brand-color: var(--brand-blue);
}
```

Custom Properties can be imported using the second option.

### `null`

If the first option is `null`, then
[Stylelint Value No Unknown Custom Properties] does nothing.

---

### importFrom

When the first option is `true`, then the second option can specify sources
where Custom Properties should be imported from by using an `importFrom` key.
These imports might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "csstools/value-no-unknown-custom-properties": [true, {
      "importFrom": [
        "path/to/file.css", // => :root { --brand-blue: #33f; }
        "path/to/file.json" // => { "custom-properties": { "--brand-blue": "#33f" } }
      ]
    }]
  }
}
```

### resolver

Use this option to configure how the rule solve paths of `@import` rules.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "csstools/value-no-unknown-custom-properties": [true, {
      "resolver": {
        "extensions": [".css"], // => default to [".css"]
        "paths": ["./assets/css", "./static/css"] // => paths to look for files, default to []
        "moduleDirectories": ["node_modules"] // => modules folder to look for files, default to ["node_modules"]
      }
    }]
  }
}
```

[discord]: https://discord.gg/bUadyRwkJS
[discord-badge]: https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white
[test-badge]: https://github.com/csstools/stylelint-value-no-unknown-custom-properties/actions/workflows/test.yml/badge.svg
[test-url]: https://github.com/csstools/stylelint-value-no-unknown-custom-properties/actions/workflows/test.yml
[npm-img]: https://img.shields.io/npm/v/stylelint-value-no-unknown-custom-properties.svg
[npm-url]: https://www.npmjs.com/package/stylelint-value-no-unknown-custom-properties

[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://stylelint.io/user-guide/configure/
[Stylelint Value No Unknown Custom Properties]: https://github.com/csstools/stylelint-value-no-unknown-custom-properties
