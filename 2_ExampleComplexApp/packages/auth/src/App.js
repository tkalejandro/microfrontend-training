import React from "react";
import { Switch, Route, Router } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import Signup from "./components/Signup";
import Signin from './components/Signin'


const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
})

const App = ({ history, onSignIn }) => {
    
    return (
        <StylesProvider generateClassName={generateClassName} >
            {/* This means history path */}
            <Router history={history}>
                <Switch>
                    <Route path="/auth/signin">
                        <Signin onSignIn={onSignIn} />
                    </Route>
                    <Route path="/auth/signup">
                        <Signup onSignIn={onSignIn} />
                    </Route>
                </Switch>
            </Router>
        </StylesProvider>
    )
}

export default App