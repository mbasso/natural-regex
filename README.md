# natural-regex

[![Build Status](https://travis-ci.org/mbasso/natural-regex.svg?branch=master)](https://travis-ci.org/mbasso/natural-regex)
[![npm version](https://img.shields.io/npm/v/natural-regex.svg)](https://www.npmjs.com/package/natural-regex)
[![npm downloads](https://img.shields.io/npm/dm/natural-regex.svg?maxAge=2592000)](https://www.npmjs.com/package/natural-regex)
[![Coverage Status](https://coveralls.io/repos/github/mbasso/natural-regex/badge.svg?branch=master)](https://coveralls.io/github/mbasso/natural-regex?branch=master)
[![Join the chat at https://gitter.im/mbasso/natural-regex](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mbasso/natural-regex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Create regex from natural language

---

**Attention - This project isn't completed yet. There might be breaking changes until version 1.0.0. Feel free to contribute, see [TODO](https://github.com/mbasso/natural-regex/blob/master/TODO.md) to get started.**
---

[natural-regex](https://github.com/mbasso/natural-regex) is a parser that allows you to write regular expressions in natural language.
This means that you can write self documentating regex using a simpler syntax that can be undestood by anyone.
No more pain with validations and other stuff.

---

## Installation

You can install natural-regex using [npm](https://www.npmjs.com/package/natural-regex):

```bash
npm install --save natural-regex
```

If you aren't using npm in your project, you can include `NaturalRegex` using UMD build in the dist folder with `<script>` tag.

## Usage

Once you have installed natural-regex, supposing a CommonJS environment, you can import and immediately use it:

```js
import NaturalRegex from 'natural-regex';
const LoremFooOrBar = NaturalRegex.from('starts with "Lorem", then space and then "foo" or "bar"');
LoremFooOrBar.test('Lorem bar'); // this evaluates true
LoremFooOrBar.test('Lorem text'); // this evaluates false
```

NaturalRegex also includes a [command line tool](https://github.com/mbasso/natural-regex-cli), check [this](https://github.com/mbasso/natural-regex/wiki/Getting-Started) for more information.

## Documentation

Visit the [Wiki](https://github.com/mbasso/natural-regex/wiki) for the full documentation.

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/mbasso/natural-regex/releases) page.

## Authors
**Matteo Basso**
- [github/mbasso](https://github.com/mbasso)
- [@Teo_Basso](https://twitter.com/Teo_Basso)

## Copyright and License
Copyright (c) 2016, Matteo Basso.

natural-regex source code is licensed under the [MIT License](https://github.com/mbasso/natural-regex/blob/master/LICENSE.md).
