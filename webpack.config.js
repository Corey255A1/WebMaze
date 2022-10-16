const path = require('path');
module.exports = {
    entry: {
        maze2d: './ts/Maze2D.ts',
    },
    output: {
        path: path.resolve(__dirname, 'www/scripts/'),
        filename: '[name].js',
        library: '[name]'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    mode:'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}