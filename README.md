# @modmyiqos/reverse-engineering

Reverse Engineering Repository

## Requirements

- Node.js v14.x (v14+ is supported but probably will work on older versions)
- Yarn

## Install packages

```bash
yarn install
# or just type `yarn`
```

### Java Applications decompilation

- JRE 1.8+

## Structure

### `./utils`

Utils is used for decompilation and automated processes related with private binaries.

We cannot keep [decompiled PMI code in repository](https://github.com/modmyiqos/iqossdk) so [you can use these commands to get it locally](#private-sdks-automated-decompilation)

## Private SDK's (automated decompilation)

### Get `com.pmi.iqossdk`

```bash
yarn get:iqossdk
```

Will download and decompile iQOS Connect application into `iqossdk` directory
