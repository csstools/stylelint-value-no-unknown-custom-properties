# Stylelint Value No Unknown Custom Properties [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

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
    "csstools/value-no-unknown-custom-properties": true || false || null
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

### false

If the first option is `false` or `null`, then
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

[cli-img]: https://img.shields.io/travis/csstools/stylelint-value-no-unknown-custom-properties.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-value-no-unknown-custom-properties
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-value-no-unknown-custom-properties.svg
[npm-url]: https://www.npmjs.com/package/stylelint-value-no-unknown-custom-properties

[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Stylelint Value No Unknown Custom Properties]: https://github.com/csstools/stylelint-value-no-unknown-custom-properties
