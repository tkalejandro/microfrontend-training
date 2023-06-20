module.exports = {
    module: {
        rules: [
            //Loader to tell webpack to process something
            {
                test: /\.m?js$/,
                //Avoid node mdoules
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            }
        ]
    }
}