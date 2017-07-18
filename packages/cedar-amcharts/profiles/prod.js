import config from './base';
import uglify from 'rollup-plugin-uglify';

config.dest = 'dist/cedarAmCharts.min.js';
config.sourceMapFile = 'dist/cedarAmCharts.js';
config.sourceMap = 'dist/cedarAmCharts.min.js.map';

// Use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
