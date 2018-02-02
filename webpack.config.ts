import path = require('path');
import slsw = require('serverless-webpack');
import webpack = require('webpack');
import nodeExternals = require('webpack-node-externals');
const glob = require('glob');

const jsBasePath = __dirname.replace(/\\/g, '/');
const targetDirectories = ['todos'];

const targets = glob.sync(`${jsBasePath}/+(${targetDirectories.join('|')})/*.ts`);
const entries: {[key: string]: any} = {};

targets.forEach((value: any) => {
  const re = new RegExp(`${jsBasePath}/`);
  const key = value.replace(re, '').replace(/\.ts$/, '');
  entries[key] = value;
});

module.exports = {
	// entry: entries,
    entry: slsw.lib.entries,
	target: 'node',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules'),
        ],
    },
    externals: ['aws-sdk', nodeExternals()],
	module: {
		loaders: [{
			test: /\.ts$/,
			loader: 'ts-loader'
		}]
	},
	output: {
		libraryTarget: 'commonjs',
		path: __dirname + '/.webpack',
		filename: '[name].js'
	}
}
