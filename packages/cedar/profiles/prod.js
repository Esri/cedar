import config from './base';
import { uglify } from 'rollup-plugin-uglify';

config.output.file = 'dist/umd/cedar.min.js';
config.output.sourcemapFile = 'dist/umd/cedar.js';
config.output.sourcemap = 'dist/umd/cedar.min.js.map';

// Use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
