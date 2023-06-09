

import faker from 'faker'

const mount = (element) => {
    const cartText = `<div> You have a ${faker.random.number()} items in your cart`

    element.innerHTML = cartText
}


if(process.env.NODE_ENV === 'development') {
    const el = document.querySelector('#cart-dev')

    if (el) {
        mount(el)
    }
}

export { mount }
