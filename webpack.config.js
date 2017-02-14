const path = require('path');

module.exports = {
    entry: './scripts/src/DynamicCollection.js',
    output: {
        path: './scripts/build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};