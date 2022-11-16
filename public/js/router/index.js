import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import userDetails from '../cmps/user-details.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/bug', component: bugApp },
  { path: '/user', component: userDetails },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
  
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
