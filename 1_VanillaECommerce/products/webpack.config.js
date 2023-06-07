const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')


module.exports = {
    mode: 'development',
    devServer: {
        port: 8081
    },
    plugins: [
        new ModuleFederationPlugin({
            /**
             * Remote Name
             */
            name: 'products',
            /**
             * Name keeps the same
             */
            filename: 'remoteEntry.js',
            /**
             * Files available to access
             */
            exposes: {
                './ProductsIndex': './src/index'
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};


 
 