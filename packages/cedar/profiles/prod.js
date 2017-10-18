import config from './base';
import uglify from 'rollup-plugin-uglify';

config.dest = 'dist/umd/cedar.min.js';
config.sourceMapFile = 'dist/umd/cedar.js';
config.sourceMap = 'dist/umd/cedar.min.js.map';

// Use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
