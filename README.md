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

```
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
```

Tip: Make sure you update expose file to share inside the `webpack.config.js`, since isnt anymore the `index.html` but the `bootstrap.js`

Inside container, what we do now, is to call those mount functions.

```
import { mount as productsMount } from '../../products/src/bootstrap'
import {mount as cartMount } from '../../cart/src/bootstrap' 
import 'products/ProductsIndex'
import 'cart/CartShow'

productsMount(document.querySelector('#my-products'))
cartMount(document.querySelector('#my-cart'))
```


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

## Create React App problem (My be an old problem)

In a nutshell there are some problems with webpack Module plugin and create-react-app command. To fix this, we will need to create a react app from scratch. 

- Classic react:
```
import React from "react";
import ReactDOM from "react-dom";

// Here is always main code. 

//Mount fucntion to start up the app
const mount = (el) => {
    ReactDOM.render(
        <h1>Hi there</h1>,
        el
    )
}

//If we are in the development and in isolation. Call mount
if(process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#_marketing-dev-root')

    if(devRoot) {
        mount(devRoot)
    }
}

// We are running throught container and we should export the mount function
export { mount }
```

##  Config folder

We will need to use 3 types of config. One when is common and the other 2 when the enviroment is  `development` and the other one when is `production`

````
config
- webpack.common.js
- webpack.dev.js
- webpack.prod.js

Please check the code of these files for more info.
````


# Section 5 - Generic Ties Between Projects

## General knowlegde
- What is important here, is just we start the react project in  the `App.js` and call it in the `bootstrap.js` file.
- Inside container we dont care about checking if development or not, since container it will render all microfrontends anyway.

## Regarding share dependencies
Also if we would like that ModuleFederationPlugin do all the work for us of share dependencies and we dont do it manually, then we have to do the following inside `webpack` configurations:

```
...
const packageJson = require('../package.json')

const devConfig = {
    ...
    plugins: [
        new ModuleFederationPlugin({
            ...
            shared: packageJson.dependencies
        }),
        ...
    ]
}

```



Please take in count, is always better to have control of it , than giving all the power to the plugin.

# Section 6 - Implementing a CI / CD Pipeline

Frontend deployment currently is very easy. We have some apps such as Heroku or Vervel where this is possible. However they all assume you are trying to publish just 1 project and not multiple projects. Thats why we have to host our site in AWS.

- The idea at the end, is that AWS will know what part of our code has change andd it will deploy just the piece of code that need to be deployed.
- We will need to use Amazon CloudFront and Amazon S3

## Webpack Production Configurations

Example of container:

```
const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')

const domain = process.env.PRODUCTION_DOMAIN
const prodConfig = {
    //It will minifize the file
    mode: 'production',
    output: {
        // This is how it will detect what type of file to use.
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                marketing: `marketing@${domain}/marketing/remoteEntry.js`
            },
            shared: packageJson.dependencies
        })
    ]
}

module.exports = merge(commonConfig, prodConfig)
```

Example of Marketing:

```
const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')

const productionConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "marketing",
            filename: 'remoteEntry.js',
            exposes: {
                './MarketingApp': './src/bootstrap'
            },
            shared: packageJson.dependencies
        }),
    ]
}

//Function to merge all common configs with the dev configs.
// Dev configs is second, to make sure it overwrite the common ones.
module.exports = merge(commonConfig, productionConfig)
```

### Regarding HTMLWebpackPlugin in Container

In this case we move this plugin to common because it will be the same for development as production.

Updated common config:

```
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}
```

## Set up the CI / CD Piepline (Github)

For this we need to use Github Actions. The flow of todos are the following:

### Deploying container

- Whenever code is pushed to main branch and this commit containts a change to the `container` folder.
- Change into the `container` folder
- Install dependencies
- Createa a production build using webpack
- Upload the result to AWS S3

Note: ` - uses: shinyinc/action-aws-cli@v1.2` 


To be able to do this scripts we can use the platform on Github "Actions". They have editor and also examples.
Also its possible to do in your own.

Starting at root a folder `.github/workflows`

Here we will create YAML file. This si the one that make it possible.

```
# name of action
name: deploy-container

on:
  # This action mean after git push
  push:
    branches:
      # Only look for this branch changes
      - main
    paths:
    # This means it will look for any change in the container
    - 'packages/container/**'
    

defaults:
  run: 
    # Location where is should run
    working-directory: packages/container

# we can have multiple  jobs
jobs: 
  build:
    # Virtual Machine where it would load
    runs-on: ubuntu-latest

    steps:
      # USe Actions and Install dependencies and build.
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build 

      # Access to AWS CLI and run AWS S3
      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME}}/container/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: eu-central-1

      

```
# Section 7 - Deployment to Amazon Web Services

## S3 Bucket Creation and Configuration

1. First you need an account AMS. For this you can try to login here `console.aws.amazon.com`. You will need a credit card.
2. Once the account is ready, go to search and look for Bucket.
3. Click on Create Bucket
4. write a Bucket name (It should be unique)
5. Select a region and make sure you remember the identifier. For example: EU Frankfurt, the identifiert is `eu-central-1`.

As you noted. Buckets are suppose to be safe and no one should have access to it.  But in our case we need it public. So we need to change those configurations

1. First we need to click in our bucket
2. Go to `Properties` and look `Static website hosting`
3. Enable it and write index.html
4. Save changes.
5. Visit now Block Public Access options and make sure to uncheck everything. Amazon will wry to warn you of your changes.

The next steps work with is regarding the Policy. This are the policy of how all amazon web services can communicate to each one. 

1. Find the policy options and click to add one. A new site will be open.
2. Select type of policy Amazon S3.
3. Select the actionv `get object`
4. Add your ARN (this you can find inside the Policy options)
5. Then make sure you copy paste the `ARN + "/*"`
6. Option Principal you need to `*`
7. Click Add Statement.
8. Generate Policy and then paste in the Policy options and save.

## CloudFront setup

1. Go to AWS Management Console and use the search bar to find CloudFront
2. Click Create distribution
3. Set Origin domain to your S3 bucket
4. Find the Default cache behavior section and change Viewer protocol policy to Redirect HTTP to HTTPS
5. Scroll down and click Create Distribution
6. After Distribution creation has finalized click the Distribution from the list, find its Settings and click Edit
7. Scroll down to find the Default root object field and enter /container/latest/index.html
8. Click Save changes
9. Click Error pages
10. Click Create custom error response
11. Change HTTP error code to 403: Forbidden
12. Change Customize error response to Yes
14. Set Response page path to /container/latest/index.html
15. Set HTTP Response Code to 200: OK

## Creating and Assigning Access Keys

1. Search for "IAM"

2. Click "Create Individual IAM Users" and click "Manage Users"

3. Click "Add User"

4. Enter any name you’d like in the "User Name" field.

5. Click "Next"

6. Click "Attach Policies Directly"

7. Use the search bar to find and tick AmazonS3FullAccess and CloudFrontFullAccess

8. Click "Next"

9. Click "Create user"

10. Select the IAM user that was just created from the list of users

11. Click "Security Credentials"

12. Scroll down to find "Access Keys"

13. Click "Create access key"

14. Select "Command Line Interface (CLI)"
15. Scroll down and tick the "I understand..." check box and click "Next"

16. Copy and/or download the Access Key ID and Secret Access Key to use for deployment.

### Back to Github 

Now you will need to copy paste the Access and secret key in Github.

1. Settings
2. Secrets and variables
3. Add all env that `container.yml` needs

### Small error fix (white screen)

If is white screen, that means app deploy but somehow the main.js file is not been call.
Therefore we need to do some fix in our webpack production on container.

- First we need to at the public path in container webpack for production `/container/latest`.

```
...
const prodConfig = {
    //It will minifize the file
    mode: 'production',
    output: {
        ...
        // This is to refer a public path.  Without this it refers directly.
        publicPath: '/container/latest/'
    },
    ...
}

module.exports = merge(commonConfig, prodConfig)
```

# Section 8 - Microfrontend-Specific AWS Config

Now the script is possible.  However S3 Bucket has the problem it can only upload new files, if you upload the same file it wont update.
So now we have to fix that in CloudFront

1. Visit Distributions
2. Visit invalidations
3. Create a new invalidation for the index.html which is the one not updating. The other filers are updating because the hash is always different. Add this now : `container/latest/index.html`

We could the Invalidation automatic directly in the `container.yml` file. We need to add one more run.

```
# name of action
name: deploy-container

on:
  ...
jobs: 
  build:
    ...
    steps:
      ...
        # This is to create an automatic invalidation via CLI instead of doing it manually. 
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --path "/container/latest/index.html"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: eu-central-1
      
```

## Deploying Marketing

For this we need to create a new configuration, this time we will create the marketing.yml . Lucky for us the configuration is not so different.
This is the final exmaple: 

```
# name of action
name: deploy-marketing

on:
  # This action means after git push
  push:
    branches:
      # Only look for this branch changes
      - main
    paths:
    # This means it will look for any change in the container
    - 'packages/marketing/**'
    

defaults:
  run: 
    # Location where is should run
    working-directory: packages/marketing

# we can have multiple  jobs
jobs: 
  build:
    # Virtual Machine where it would load
    runs-on: ubuntu-latest

    steps:
      # USe Actions and Install dependencies and build.
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build 

      # Access to AWS CLI and run AWS S3
      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME}}/marketing/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: eu-central-1
        # This is to create an automatic invalidation via CLI instead of doing it manually. 
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --path "/marketing/latest/remoteEntry.js"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: eu-central-1
      

```

## PRO TIPS - Workflow insights

- Create local branches
- Push changes from your local branch
- Ask for Pull request
- With current configurations everything will be updated automatic.

# Section 9 - Handling CSS in Microfrontends

Witht the current configurations all CSS files are stacking for each microfrontend. This can lead to undesirables styles.
So how to solve it?

We need to scope our CSS for each microfrontend.

1. Custom CSS Solutions

- We could use CSS-In-JS. it will generate random CSS class names on production.
- Vue and Angular is already automatic.
- Use Namespace the css. `.container h1`, `.marketing h1`. This is very easy but leads to possible human error.

2. CSS from Framework

- Use a library that has internally a CSS-in-js.  For example Material UI. 
- Manually build the css library.

We could possible mention to use the same library for all projects, but this lead to unflexibility. This is to avoid.

Regarding the bug. Even tho each project is using MAterial UI (CSS-In-Js) , the same header is receiving 2 unique css styles giving the same properties, this only happen in production because the building time, the code is trying to optimize the css files.

## How to fix?

We need to use generateClassName.

This is solution fot MAterial UI 4.

```
...
import { ..., createGenerateClassName } from '@material-ui/core/styles'

...

const generateClassName = createGenerateClassName({
    productionPrefix: 'ma' // This will be indentifier. 
})

const App = () => {
    return(
        <StylesProvider generateClassName={generateClassName} >
           ...
        </StylesProvider>
    )
}

export default App
```

# Section 10 - Implementing Multi-Tier Navigation

For this section this will be our unflexible requirements

1. Container + Indivual SubAApps, both they have their own navigation.
2. SubApps need to provide many page routes. We want to avoid redeploying the container to add the pages.
3. We need to show 2 Microfront ends at the same time.
4. Use library for navigation. Avoid doing custom
5. Should work in production and also in isolation.
6. The communication between app should be always in Generic.


## History 

For navigation is very important that: 

- Use browser History for container
- Memory History for the microfrontends
- In Development and for isolation is the only reason we will use browserHistory 

To make it possible the communication between Container and Marketing, we need to update all core files to this:

### In Container
src/components/MarketingApp.js

```
import { mount } from 'marketing/MarketingApp';
import React, {useRef, useEffect} from 'react'
import { useHistory } from 'react-router-dom';

const MarketingApp = () => {
    const ref = useRef(null)
    const history = useHistory()
    
    useEffect(() => {
        const { onParentNavigate } = mount(ref.current, {
            // This is a function that I ad dhere expecting some information this case history from the application marketing
            
            // this is custom. pathname is destructured and change name by using nextPathname.
            onNavigate: ({ pathname: nextPathname}) => {
                //After Marketing now are back here waiting for action!
                const {pathname} = history.location
                if(pathname === nextPathname) return
                history.push(nextPathname)
            }
        })

        history.listen(onParentNavigate)
    }, [])
    return (
        <div ref={ref}></div>
    )
}

export default MarketingApp
```

### In Marketing

src/App.js
```
import React from "react";
import { Switch, Route, Router } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

import Landing from './components/Landing'
import Pricing from './components/Pricing'

const generateClassName = createGenerateClassName({
    productionPrefix: 'ma'
})

const App = ({ history }) => {
    console.log(history)
    return (
        <StylesProvider generateClassName={generateClassName} >
            {/* This means history path */}
            <Router history={history}>
                <Switch>
                    <Route exact path="/pricing" component={Pricing} />
                    <Route exact path="/" component={Landing} />
                </Switch>
            </Router>
        </StylesProvider>
    )
}

export default App
```

src/bootstrap.js
```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createMemoryHistory , createBrowserHistory} from 'history'

// Here is always main code. 

//Mount fucntion to start up the app

// On Navigate is the function that is already in container waiting to be trigger
const mount = (el, { onNavigate, defaultHistory }) => {
    // History created
  
    const history = defaultHistory || createMemoryHistory()

    //Whenever the path change, this will be call.
    // It changes first in Marketing and then we need it to change in Container.
    // Here are are providing some information related to navigation.
    // Now go back to the container.
    if (onNavigate) {
        history.listen(onNavigate)
    }

    ReactDOM.render( <App history={history}/>,el)

    return {
        onParentNavigate({pathname: nextPathname}) {
             //After Clicking on container but viewing Marketing, this will go back to container and show me something
             const {pathname} = history.location
             if(pathname === nextPathname) return
             history.push(nextPathname)
        }
    }
}

//If we are in the development and in isolation. Call mount
if(process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#_marketing-dev-root')
    // This is to make it possible to see the path correctly when doing in isolation.
    if(devRoot) {
        mount(devRoot, { defaultHistory : createBrowserHistory()})
    }
}

// We are running throught container and we should export the mount function
export { mount }
```

