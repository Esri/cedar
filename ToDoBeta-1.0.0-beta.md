## Proposed Changes
- es2016 Refactor + Modules
- Offload more of chart visual appearance to Vega / Vega-lite
- Builds via rollup
- Refactor away Grunt to NPM scripts
- unit tests via AVA
- Expose methods for:
  - Esri query generation
  - Build chart with vega
  - Build chart with vega-lite


## Roadmap
- [ ] Refactor grunt to npm
- [ ] set up rollup
- [ ] set up ava
- [ ] Plan structure of modularized cedar
- [ ] ???


## Concerns

- Handle both library build & docs build?
- Keep docs as they are / just handle building with npm scripts or do a docs refactor eventually as well?

- Lots of edge cases with regards to vega / vega-lite where difficulties could occur
