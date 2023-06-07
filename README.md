# microfrontend-training
Selftraining notes

# Section 1 - The Basics of Microfrontends

## Understanding a Microfrontend

What needs to be understand is when we are building a Project with microfrontend we will need the Number of MiniApps  +  Container project. The container is the one who will take each part of the project and unify them. This is called "Integration".

## Type of integration

### Build Time Integration

- In a nutshell is like generating npm packages. one team send app1 as npm package and then the other team download it and publish their app2. 
- The problem with this, everytime app1 is updated , app2 needs to be redeploy again (app2 is the container).

### Run Time Integration

- Updates are deployed independently.
- When container app is loaded, it will fetch the information from app1. Biggest advantage.
- Is really hard to setup.

### Server Integration
- Server makes the decision of what content to load. 

## Basic Vanilla Project layout

```
Container
- src
-- index.js
- public
-- index.html
- package.json
- webpack.config.js

Cart
- src
-- index.js
- public
-- index.html
- package.json
- webpack.config.js

ProductList
- src
-- index.js
- public
-- index.html
- package.json
- webpack.config.js
```

Installation for Products: 
```
npm install webpack@5.68.0 webpack-cli@4.10.0 webpack-dev-server@4.7.4 faker@5.1.0 html-webpack-plugin@5.5.0
```

Then create webpack and update the scripts to `npm start` whill will initialize `webpack`. Webpack should be `development | production | none`

Installation for Container:

````
npm install webpack@5.68.0 webpack-cli@4.10.0 webpack-dev-server@4.7.4 html-webpack-plugin@5.5.0 nodemon
````


# Section 2 - The Basics of Module Federation

## Implementing Module Federation Plugin

This is a plugin from web `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')` . This will allow us to be able to connect the microfrontends.

What is important to know, each microfrontend should provide a "root" to be able to be call. all this configs are done in webpack.

This is ProductsApp webpack config:

````
...
module.exports = {
   ...
    plugins: [
        new ModuleFederationPlugin({
            name: 'products',
            filename: 'remoteEntry.js',
            exposes: {
                './ProductsIndex': './src/index'
            }
        }),
        ...
    ]
};


 
 
````
This the container and how is called.
````
...
module.exports = {
    ...
    plugins:  [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                products: 'products@http://localhost:8081/remoteEntry.js'
            }
        }),
        ...
    ]
}
````

## Understanding Module Federation Plugin

### In Products

- We stil can access individually to this project on the main.js.
- But also we can access using the Module Federation plugin. This will create the following files:
    - remoteEntry.js -> containts the list of files available to load form the current project
    - src_index.js -> is the version that is safe to browser.
    - faker.ks -> the safe version of faker.

### In Container
- Index give the instruccion to import first "some more code" from bootstrap.js.  Thats the main reason.
- Index what it mainly does is fetch data.
- main.js still can be open invidually.