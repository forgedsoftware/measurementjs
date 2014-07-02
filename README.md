Measurement.js
==============

A measurement library for handling, converting, and manipulating quantities.

## [Documentation](http://measurementjs.com/)

## Changelog

### 0.0.1
Initial release

## Build Process

We use gulp to provide our build process with a couple of custom extensions to provide the custom behaviours. The build process completes these steps:

 1. Convert `./common/systems.json` into three files of varying levels of detail.
  - `./raw_systems/full.json` - Contains all systems and all units.
  - `./raw_systems/default.json` - Contains all systems and all that aren't listed as historical or rare.
  - `./raw_systems/minimal.json` - Contains a subset of systems and all units with the systems usCustomary, imperial, or si.
     - Does not include historical or rare units.
     - Systems: length, area, volume, speed, acceleration, pressure, mass, time, temperature, energy, density, and information.
 2. Convert each of the `./raw_systems/\*.json` files into JS syntax and insert into `measurement.js` file with the name `./built/measurement_\*.js`.
 3. Minify each of the built files into `./min/measurement_\*.min.js`.
 4. Convert each of the `./raw_systems/\*.json` files into JS syntax and wrap in a code block, save to `./systems/*.js`.

## License
Measurement JS is freely distributable under the terms of the MIT license.
