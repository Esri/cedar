import config from './base';
import uglify from 'rollup-plugin-uglify';

config.dest = 'dist/cedar.min.js';
config.sourceMapFile = 'dist/cedar.js';
config.sourceMap = 'dist/cedar.min.js.map';

// Use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
