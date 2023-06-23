import { createApp} from 'vue'
import Dashboard from './components/Dashboard.vue'

// VUE EXCLUVSIVE
// Here is always main code. 

//Mount fucntion to start up the app

const mount = (el) => {
    // THIS IS VUE
    const app = createApp(Dashboard)
    app.mount(el)
  
}

//If we are in the development and in isolation. Call mount
if(process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#_dashboard-dev-root')
    // This is to make it possible to see the path correctly when doing in isolation.
    if(devRoot) {
        mount(devRoot)
    }
}

// We are running throught container and we should export the mount function
export { mount }