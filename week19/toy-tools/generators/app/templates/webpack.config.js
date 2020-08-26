const HtmlWebpackPlugin  = require('html-webpack-plugin')
module.exports = {
    entry: "./src/main.js",
    module: {
        rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", { pragma: "create" }]
                        ]
                    }
                }
            }
        ]
    },
    mode: "development",
    optimization: {
        minimize: false
    },
    plugins:[
        new HtmlWebpackPlugin()
    ],
    devServer: {
        open: true,
        compress: false,
        contentBase: "./src"
    }
}