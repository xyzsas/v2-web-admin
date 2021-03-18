import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/user/:id',
    component: () => import('./views/User.vue')
  },
  {
    path: '/group/:id',
    component: () => import('./views/Group.vue')
  },
  {
    path: '/affair/:id',
    component: () => import('./views/Affair.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router