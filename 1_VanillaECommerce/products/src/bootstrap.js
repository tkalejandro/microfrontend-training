import faker from 'faker'



const mount = (element) => {
    let products = '';

    for (let i = 0; i < 5; i++) {
        const name = faker.commerce.productName()
        products += `<div>${name}</div>`
    }

    // Print to browser
    element.innerHTML = products
}

// Context / Situation #1
//We are running this file in development in isolation
// we are using our local index.html file
// which DEFNITLEY has an element with an id of 'dev-products'
// We want to immedtialy render our app into that element

//This is automatic by Webpack "mode"
if(process.env.NODE_ENV === 'development') {
    const el = document.querySelector('#dev-products');
    if(el) {
        //Is in isolation
        mount(el)
    }
}

// COntext / Situation #2
//We are running this file in defvelopment or production
// thorught the CONTAINER app
// NO GURANTEE that an element with an id of 'dev-prodcuts'
// We do not want try to immediately render the app

export { mount };