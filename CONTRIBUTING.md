Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

Please take a look at [previous issues](https://github.com/Esri/cedar/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems.


##### More examples

The Esri Cedar website is written using http://assemble.io/ and can be found at https://github.com/Esri/cedar/tree/master/site/source. You can use the existing examples as a reference.

##### More tests

Esri Cedar has a fairly comprehensive test suite built with [Mocha](http://visionmedia.github.io/mocha/), [Chai](http://chaijs.com/), [Sinon](http://sinonjs.org), [Karma](http://karma-runner.github.io/0.12/index.html) and [Grunt](http://gruntjs.com/). Tests can be found in at https://github.com/Esri/cedar/tree/master/spec.

You can run the tests with the `grunt karma:watch` to watch files and rerun test automatically and `grunt karma:coverage` (to generate a code coverage report.)

##### Support for new chart types types

Support for new chart types is always needed.



### Setting up a dev environment

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone Esri Cedar](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `cedar` folder
5. Install the dependencies with `npm install`
5. run `grunt` from the command line. This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the source files and running linting and testing commands.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Linting

Please make sure your changes pass JS Hint. This will help make sure code is consistant throguh out Esri Cedar. You can run JS Hint with `grunt jshint`.

### Testing

Please make sure your changes dont break existing tests. Testing is essential for determining backward compatibility and catching breaking changes. You can run tests with `grunt karma:run`, `grunt karma:watch` or `grunt karma:coverage.`
