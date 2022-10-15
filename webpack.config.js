const path = require('path');
module.exports = {
    entry: {
        maze3d: './ts/Maze3D.ts',
        maze2d: './ts/Maze2D.ts',
        maze: './ts/Maze.ts'
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
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}