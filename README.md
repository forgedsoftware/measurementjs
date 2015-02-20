Measurement.js
==============

A measurement library for handling, converting, and manipulating quantities.

## Documentation

### Getting Started

#### Node
In order to install `measurement` in your project, navigate to your projects directory and install with:

````
npm install measurejs
````
You can include `measurement` within a module in a standard way:
````javascript
var m = require('measurejs');
m(42, 'metre').format();
````

#### Browser
````html
<script src="measurement.js"></script>
<script>
	var m = window.measurement;
	m(42, 'metre').format();
</script>
````

#### Bower
````
bower install --save measurement
````

#### Require.js
````javascript
require.config({
    paths: {
        "measurement": "path/to/measurement",
    }
});
define(["measurement"], function (m) {
    m(42, 'metre').format();
});
````

#### NuGet
Coming Soon!

#### Basic Usage
You can use `measurement` to perform basic math:
````javascript
m(4).add(5).value; // 9
m(2).add(m(12)).value; // 14

m(2.7).subtract(1.2).value; // 1.5
m(16).subtract(m(2)).value; // 14

m(4).multiply(3).value; // 12
m(1.6).divide(m(4)).value; // 0.4
````
You can use `measurement` to perform unit conversions:
````javascript
m(2, 'minute').convert('second').value; // 120
m(12, 'metre').convert('foot').value; // 39.3701
````
You can perform math between quantities with different units:
````javascript
m(30, 'minute').add(m(2, 'hour')).value; // 150 [in minutes]
````
You can chain operations:
````javascript
m(10, 'minute').multiply(m(2)).add(4).minus(m(30, 'second')).value; // 23.5
````

### Units & Systems
Coming Soon!

### Quantities & Dimensions
Coming Soon!

### Format
Coming Soon!

### Uncertainity & Frequency Distribution
Coming Soon!

### Config Options
Coming Soon!

## Changelog

### 0.0.1
Initial release

## Build Process

We use gulp to provide our build process with a couple of custom extensions to provide the custom behaviours. The build process completes these steps:

 1. Convert `./common/systems.json` into three files of varying levels of detail.
  - `full` - Contains all systems and all units.
  - `default` - Contains all systems and all that aren't listed as historical or rare.
  - `minimal` - Contains a subset of systems and all units with the systems usCustomary, imperial, or si.
     - Does not include historical or rare units.
     - Systems: length, area, volume, speed, acceleration, pressure, mass, time, temperature, energy, density, and information.
 2. Convert each of the files into JS syntax and insert into `measurement.js` file with the name `./built/measurement_\*.js`.
 3. Minify each of the built files into `./min/measurement_\*.min.js`.

## License
Measurement JS is freely distributable under the terms of the MIT license.
