<template>
  <div class="app">
    <component style="box-shadow: 4px 0px 4px #eee;" v-for="(w, i) in win" @mouseenter="focus = i" :is="w.c" :p="w.p">视图不存在</component>
  </div>
</template>

<script setup>
import { defineAsyncComponent, markRaw } from 'vue'
import Loading from './components/Loading.vue'

ref: win = []
ref: I = 0
ref: focus = -1
let N = Math.floor(window.innerWidth / 360) || 1
window.onresize = () => {
  N = Math.floor(window.innerWidth / 360) || 1
  while (win.length > N) win.pop()
  I %= N
}

const views = {
  'affair': () => import('./views/Affair.vue'),
  'batch': () => import('./views/Batch.vue'),
  'data': () => import('./views/Data.vue'),
  'group': () => import('./views/Group.vue'),
  'home': () => import('./views/Home.vue'),
  'msg': () => import('./views/Msg.vue'),
  'photo': () => import('./views/Photo.vue'),
  'preset': () => import('./views/Preset.vue'),
  'user': () => import('./views/User.vue')
}
const load = (w) => markRaw(views[w] ? defineAsyncComponent(views[w]) : Loading)
const next = () => { I++; I %= N }

window.show = (view, params = {}) => {
  const w = { c: load(view), p: params }
  if (I == -1) {
    win = [w]
    I = 0
    return
  }
  if (view == 'affair' || view == 'data') {
    win = [w]
    I = -1
    return
  }
  if (view == 'home') {
    win.unshift(w)
    if (win.length > N) win.pop()
    next()
    return
  }
  if (I == focus && N > 1) next()
  win[I] = w
  next()
}

window.show('home')
</script>

<style scoped>
div.app {
  display: flex;
  min-height: 100vh;
}
</style>

<style>
.code {
  background-color: #eee;
  font-family: monospace;
  font-weight: bold;
  outline: none;
  border: none;
  padding: 8px;
  width: 100%;
  font-size: 0.75rem;
}
.code::placeholder {
  color: #aaa;
}
</style>
