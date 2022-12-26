# Trousers platform for Plaid APIs

A hobby project to bootstrap fintech startups that specialize in modular JavaScript monorepos.

## Building Trousers

Trousers' monorepo and builds are managed by [Rush](https://rushjs.io/) and [pnpm](https://pnpm.io/).

`rush update` will install dependencies, including the pnpm version used by this project.  

```
npm install -g @microsoft/rush
rush update
rush build
```

Building is incremental and subsequent `rush build` commands will only rebuild modules with updated sources.
