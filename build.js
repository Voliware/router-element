const Fs = require('fs');
const NodeBuild = require('@voliware/node-build');
const version = require('./package.json').version;

// Wipe the output folder first (www)
Fs.rmdirSync('./dist', {recursive: true});

const css = new NodeBuild.FileBuilder({
    name: 'CSS',
    type: 'css',
    version: version,
    input: './src/routerElement.css',
    output: './dist/router-element.min.css',
    minify: true
});

const js = new NodeBuild.FileBuilder({
    name: 'JS',
    type: 'js',
    version: version, 
    input: [
        './src/routeElement.js',
        './src/routerElement.js'
    ],
    output: './dist/router-element.min.js',
    minify: true
});

new NodeBuild.Build([css, js]).run();