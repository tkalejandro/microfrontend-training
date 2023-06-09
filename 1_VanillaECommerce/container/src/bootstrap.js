import { mount as productsMount } from '../../products/src/bootstrap'
import {mount as cartMount } from '../../cart/src/bootstrap' 
import 'products/ProductsIndex'
import 'cart/CartShow'

productsMount(document.querySelector('#my-products'))
cartMount(document.querySelector('#my-cart'))