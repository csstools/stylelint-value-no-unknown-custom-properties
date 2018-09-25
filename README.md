# No Unknown Custom Properties [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[No Unknown Custom Properties] is a [stylelint] rule to disallow usage of unknown custom properties.

---

The following patterns are _not_ considered violations:

```pcss
:root {
  --brand-blue: #33f;
}

.example {
  color: var(--brand-blue);
}
```

```pcss
.example {
  color: var(--brand-blue);
}

.some-other-class {
  --brand-blue: #33f;
}
```

```pcss
:root {
  --brand-blue: #33f;
  --brand-color: var(--brand-blue);
}
```

---

The following patterns are considered violations:

```pcss
.example {
  color: var(--brand-blue);
}
```

```pcss
:root {
  --brand-color: var(--brand-blue);
}
```

## Usage

Add [No Unknown Custom Properties] as a [stylelint] plugin.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "value-no-unknown-custom-properties": true
  }
}
```

## Options

### importFrom

The `importFrom` option specifies sources where Custom Properties can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "value-no-unknown-custom-properties": {
      "importFrom": "path/to/file.css" // => :root { --color: red }
    }
  }
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace Custom Properties using the `customProperties` or
`custom-properties` key.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-value-no-unknown-custom-properties"
  ],
  "rules": {
    "value-no-unknown-custom-properties": {
      "importFrom": [
        "path/to/file.css",   // :root { --color: red; }
        "and/then/this.js",   // module.exports = { customProperties: { '--color': 'red' } }
        "and/then/that.json", // { "custom-properties": { "--color": "red" } }
        {
          customProperties: { "--color": "red" }
        },
        () => {
          const customProperties = { "--color": "red" };

          return { customProperties };
        }
      ]
    }
  }
}
```

See example imports written in [CSS](test/import.css), [JS](test/import.js),
and [JSON](test/import.json).

[cli-img]: https://img.shields.io/travis/csstools/stylelint-value-no-unknown-custom-properties.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-value-no-unknown-custom-properties
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/stylelint-value-no-unknown-custom-properties.svg
[npm-url]: https://www.npmjs.com/package/stylelint-value-no-unknown-custom-properties

[No Unknown Custom Properties]: https://github.com/csstools/stylelint-value-no-unknown-custom-properties
[stylelint]: https://stylelint.io/
