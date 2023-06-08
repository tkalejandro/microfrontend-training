const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')


module.exports = {
    mode: 'development',
    devServer: {
        port: 8082
    },
    plugins: [
        new ModuleFederationPlugin({
            /**
             * Remote Name
             */
            name: 'cart',
            /**
             * Name keeps the same
             */
            filename: 'remoteEntry.js',
            /**
             * Files available to access
             */
            exposes: {
                './CartShow': './src/index'
            },
            /**
            * ALlow to share depencies if already have them.
            */
            shared: ['faker']
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};



