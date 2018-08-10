import config from './base';
import { uglify } from 'rollup-plugin-uglify';

config.output.file = 'dist/umd/cedar-amcharts.min.js';
config.output.sourceMapFile = 'dist/umd/cedar-amcharts.js';
config.output.sourceMap = 'dist/umd/cedar-amcharts.min.js.map';

// Use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
