'use strict'

export default {
  props: ['user'],
  template: `<article className="bug-preview">
                <span>😎</span>
                <h4>{{user.username}}</h4>
                <button @click="onRemove(user._id)">X</button>
              </article>`,
  methods: {
    onRemove(userId) {
      this.$emit('remove-user', userId)
    },
  },
}
