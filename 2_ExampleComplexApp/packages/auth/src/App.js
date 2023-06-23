import React from "react";
import { Switch, Route, Router } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import Signup from "./components/Signup";
import Signin from './components/Signin'

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
})

const App = ({ history }) => {
    console.log(history)
    return (
        <StylesProvider generateClassName={generateClassName} >
            {/* This means history path */}
            <Router history={history}>
                <Switch>
                    <Route path="/auth/signin" component={Signin} />
                    <Route path="/auth/signup" component={Signup} />
                </Switch>
            </Router>
        </StylesProvider>
    )
}

export default App