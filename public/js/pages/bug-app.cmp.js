'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <h3>{{ pages }}</h3>
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="downloadPdf">Download PDF</button>
        <button @click="setPage(1)">Next</button>
        <button @click="setPage(-1)">Prev</button>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0
      },
      totalPages: null
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    setPage(diff) {
      this.filterBy.page += diff

      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1

      this.loadBugs()
    },
    downloadPdf() {
      bugService.downloadPdf()
        .then(() => { console.log('Success') })
        .catch(() => { console.log('Failure') })
    },
    loadBugs() {
      bugService.query(this.filterBy).then(({ filteredBugs, totalPages }) => {
        this.bugs = filteredBugs
        this.totalPages = totalPages
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title) return this.bugs

      const regex = new RegExp(this.filterBy.title, 'i')
      return this.bugs.filter((bug) => regex.test(bug.title))
    },
  },
  components: {
    bugList,
    bugFilter,
  },
}
