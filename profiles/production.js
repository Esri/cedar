import config from './base';
import uglify from 'rollup-plugin-uglify';

config.dest = 'dist/cedar-test.js';
config.sourceMap = 'dist/cedar-test.js.map';

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
