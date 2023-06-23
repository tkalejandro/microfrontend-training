import { mount } from 'auth/AuthApp';
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

const AuthApp = () => {
    const ref = useRef(null)
    const history = useHistory()

    useEffect(() => {
        const { onParentNavigate } = mount(ref.current, {
            // This is a function that I add dhere expecting some information this case history from the application marketing

            // This is to avoid a bug, this will help us to react immeditaly when changing pages.
            initialPathname: history.location.pathname,
            // this is custom. pathname is destructured and change name by using nextPathname.
            onNavigate: ({ pathname: nextPathname }) => {
                //After Marketing now are back here waiting for action!
                const { pathname } = history.location
                if (pathname === nextPathname) return
                history.push(nextPathname)
            }
        })

        history.listen(onParentNavigate)
    }, [])
    return (
        <div ref={ref}></div>
    )
}

export default AuthApp