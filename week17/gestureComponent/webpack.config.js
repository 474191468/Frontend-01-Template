module.exports = {
    entry: "./main.js",
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
            },
            {
                test: /\.view/,
                use: {
                    loader: require.resolve("./myLoader.js")
                }
            },
            {
                test: /\.css$/,
                use: {
                    loader:require.resolve("./cssLoader.js")
                }
            }
        ]
    },
    mode: "development",
    optimization: {
        minimize: false
    }
}