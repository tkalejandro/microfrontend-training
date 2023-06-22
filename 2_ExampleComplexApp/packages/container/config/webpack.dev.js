const { merge } = require('webpack-merge')

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')


const devConfig = {
    mode: 'development',
    devServer: {
        port: 8080,
        historyApiFallback: {
            index: '/index.html'
        }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "container",
            remotes: {
                marketing: 'marketing@http://localhost:8081/remoteEntry.js'
            },
            // shared: [
            //     'react', 'react-dom'
            // ]
            shared: packageJson.dependencies
        }),
        
    ]
}

//Function to merge all common configs with the dev configs.
// Dev configs is second, to make sure it overwrite the common ones.
module.exports = merge(commonConfig, devConfig)