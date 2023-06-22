import React from 'react'
import { mount } from 'marketing/MarketingApp'
import MarketingApp from './components/MarketingApp'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName({
    productionPrefix: 'app'
})
console.log(mount)
const App = () => {

    return (

        <BrowserRouter>
            <StylesProvider generateClassName={generateClassName}>
                <Header />
                <MarketingApp />
            </StylesProvider>
        </BrowserRouter>

    )
}

export default App