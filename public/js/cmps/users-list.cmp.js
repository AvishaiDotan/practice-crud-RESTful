import { userService } from "../services/user.service.js"

import userPreview from "./user-preview.cmp.js"


export default {
  created() {
    this.loadUsers()
  },
  template: `
        <section>
            <user-preview @remove-user="removeUser" v-for="user in users" :user="user"></user-preview>
        </section>
    `,
  data() {
    return {
      users: []
    }
  },
  methods: {
    removeUser(userId) {
      userService.remove(userId)
        .then(() => {
          this.loadUsers()
        })
    },
    loadUsers() {
      userService.getUsers()
        .then(users => {
          this.users = users
        })
    }
  },
  components: {
    userPreview,
  }
}
