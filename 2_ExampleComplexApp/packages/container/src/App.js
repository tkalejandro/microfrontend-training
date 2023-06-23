import React, {lazy, Suspense, useState} from 'react'
import { mount } from 'marketing/MarketingApp'

import Header from './components/Header'
import Progress from './components/Progress'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName({
    productionPrefix: 'app'
})
console.log(mount)

const MarketingLazy = lazy(() => import('./components/MarketingApp'))
const AuthLazy = lazy(() => import('./components/AuthApp'))
const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false)
    return (

        <BrowserRouter>
            <StylesProvider generateClassName={generateClassName}>
                <Header isSignedIn={isSignedIn} onSignOut={() => setIsSignedIn(false)}/>
                <Suspense fallback={<Progress />}>
                <Switch>
                    <Route path="/auth">
                        <AuthLazy onSignIn={() => setIsSignedIn(true)} />
                    </Route>
                    <Route path="/" component={MarketingLazy} />
                </Switch>
                </Suspense>
            </StylesProvider>
        </BrowserRouter>

    )
}

export default App