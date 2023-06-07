import faker from 'faker'

let products = '';

for (let i = 0; i < 5; i++) {
    const name = faker.commerce.productName()
    products += `<div>${name}</div>`
}

// Printo to browser
document.querySelector('#dev-products').innerHTML = products