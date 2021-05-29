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
  },
  {
    path: '/data/:id',
    component: () => import('./views/Data.vue')
  },
  {
    path: '/batch',
    component: () => import('./views/Batch.vue')
  },
  {
    path: '/msg',
    component: () => import('./views/Msg.vue')
  },
  {
    path: '/preset',
    component: () => import('./views/Preset.vue')
  },
  {
    path: '/photo',
    component: () => import('./views/Photo.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router