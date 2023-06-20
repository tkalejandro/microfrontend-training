import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Here is always main code. 

//Mount fucntion to start up the app
const mount = (el) => {
    ReactDOM.render( <App />,el)
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