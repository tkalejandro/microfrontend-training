import React, {lazy, Suspense} from 'react'
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

    return (

        <BrowserRouter>
            <StylesProvider generateClassName={generateClassName}>
                <Header />
                <Suspense fallback={<Progress />}>
                <Switch>
                    <Route path="/auth" component={AuthLazy} />
                    <Route path="/" component={MarketingLazy} />
                </Switch>
                </Suspense>
            </StylesProvider>
        </BrowserRouter>

    )
}

export default App