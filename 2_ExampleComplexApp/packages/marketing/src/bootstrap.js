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