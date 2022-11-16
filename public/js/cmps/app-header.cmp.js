import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/eventBus-service.js'

import loginSignup from '../cmps/login-signup.cmp.js'


export default {
    template: `
        <header>
            <h1>Miss Bug</h1>n>
        </header>
        <section v-if="user">
            <router-link to="/user"><p>Welcome {{user.fullname}}</p></router-link>

            
            <button @click="doLogout">Logout</button>
       </section>
       <section v-else>
            <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
       </section>
    `,
    data() {
        return {
            user: userService.getLoggedInUser()
        }
    },
    computed: {
        loggedInStateTxt() {
            return (this.user) ? 'Logout' : 'Login'
        }
    },
    methods: {
        doLogout() {
            userService.logout()
                .then(() => {
                    this.user = null
                    this.$router.push('/bug')
                })
                .catch((err) => {
                    showErrorMsg(err)
                })
        },
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
        },
    },
    components: {
        loginSignup
    }
}
