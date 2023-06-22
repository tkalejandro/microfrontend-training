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