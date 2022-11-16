import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug-service.js'

import bugList from '../cmps/bug-list.cmp.js'
import usersList from './users-list.cmp.js'

export default {
    created() {
        this.user = userService.getUserDetails()
        this.loadBugs()
    },
    template: `
        <h1>User Name: {{user.fullname}}</h1>
        <pre>User ID: {{ user._id }}</pre>
        <bug-list :bugs="userBugs" @removeBug="removeBug"></bug-list>
        <users-list v-if="isAdmin"></users-list>    
    `,
    data() {
        return {
            user: null,
            userBugs: []
        }
    },
    methods: {
        loadBugs() {
            userService.getUserBugs()
                .then(bugs => this.userBugs = bugs)
        },
        removeBug(bugId) {
            bugService.remove(bugId).then(() => this.loadBugs())
        },
        isAdmin() {
            return (this.user.fullname === "ADMIN")
        }
    },
    components: {
        bugList,
        usersList
    }
}