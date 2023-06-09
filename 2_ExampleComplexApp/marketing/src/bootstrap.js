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