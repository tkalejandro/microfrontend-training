const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
    mode: 'development',
    devServer: {
        port: 8080
    },
    plugins:  [
        new ModuleFederationPlugin({
            // name is only require for REMOTE but convention to keep it here.
            name: 'container',
            remotes: {
                /**
                 * KEY: same name in bootstrap.
                 * Name: is the first part of the string before "@". This is the remote name 
                 * */
                products: 'products@http://localhost:8081/remoteEntry.js',
                /**
                 * Fetch Cart
                 */
                cart: 'cart@http://localhost:8082/remoteEntry.js',
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}