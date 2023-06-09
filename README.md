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

# Section 3 - Sharing dependencies between apps

In other words. avoiding duplicating dependencies. In this example faker is 2 times. 
Module Federation Plugin will helps in this, since this is the one in charge of adding code.

### Uncaught Error: Shared module is not available for eager consumption

````
Uncaught Error: Shared module is not available for eager consumption: webpack/sharing/consume/default/faker/faker
````
What happens is, even in container is working, as an indiviual is having problems because now faker is async and when it load for first time, the code is no there yet.  To fix this: You need to create the `bootstrap` file with the main code, and an `index` files calling the `bootstrap` file, to have enough time to fix it.  Remember to use import as a function. `import('./bootstrap`)

### What happens when we have different versions?

- Module Federation Plugin is smart enoguh to detect different versions of dependencies. This behavior is totally expected. 
- When major version is the same (same first number) it will share the same dependencie. But you need to make sure the versions are written with this first character `^5.1.0`, 

### Singleton loading

Sometimes , there are some libraries that only requires to have 1 single copy and not multiple of it. One case for that is React.
To make sure it only staty one time we need to do in `webpack.config.js` :

```
...
plugins: [
    new ModulefederationPlugin({
        ...
        shared: {
            faker: {
                singleton: true
            }
        }
    })
]
```

Tips:
- `unsatisfied version xxx of shared single module xxx` : This mean we are trying to use 2 different version of a library but we are forcing to only have one copy.  So to fix this, we need to check really how we really want to have our rule. 
- If we want one copy, we need to have same  main version (first number). 

### Running the microfrontends independely and flexible

In a nutshell, how the current state of the code was, Produts and Cart were assumming the ID where to print the information was "known".  However this is dangerous because normally each team will have their own configuration. Therefore the microfrontends will need to create a mount function that can be exported to the container and then load the code. 

````
const mount = (element) => {
    const cartText = `<div> You have a ${faker.random.number()} items in your cart`

    element.innerHTML = cartText
}


if(process.env.NODE_ENV === 'development') {
    const el = document.querySelector('#cart-dev')

    if (el) {
        mount(el)
    }
}

export { mount }
````

Tip: Make sure you update expose file to share inside the `webpack.config.js`, since isnt anymore the `index.html` but the `bootstrap.js`

Inside container, what we do now, is to call those mount functions.

````
import { mount as productsMount } from '../../products/src/bootstrap'
import {mount as cartMount } from '../../cart/src/bootstrap' 
import 'products/ProductsIndex'
import 'cart/CartShow'

productsMount(document.querySelector('#my-products'))
cartMount(document.querySelector('#my-cart'))
`````


### Naming bug

Make sure the remote names never have the same ID of an element. This will provoke some errors. Because the ID will make a global variable, and  the remote code from webpack is already global variable. And oc, this makes problem.

# Section 4 - Linking Multiple Apps Together

In this section the main purpose of learning is how to link all microfrontends using frameworks. For this case we will have a fake company with Marketing , Authentication and Dashboard Team. DONT FORGET, the 4, the container

## Arquitecture decissions

Overall some great tips:
- Dont share states, components between projects. Keep them totally isolated, maybe in the future we change the framework. 
- To communicate maybe between projects, we need to use the container, but this container should never asumme what kind of framework the other project is using. For that, we will use callbacks and events. The logic should be very generic. 
- CSS should not affect other projects. Keep it isolated , scoped.
- Version control. It could be monorepo or separate repo.  At the it doesnt matter unless we keep the good practices.
- Container should have the power to use later version of an app or a specific version of the project.