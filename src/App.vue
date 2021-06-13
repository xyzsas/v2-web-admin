<template>
  <bar/>
  <div class="app">
    <div v-for="(w, i) in win" class="win p-4" :key="w.k">
      <div class="buttons is-right p-0 m-0" style="opacity: 0.6;">
        <button class="button is-white is-small m-0" @click="w.pin = !w.pin">
          <span class="icon"><i class="mdi mdi-24px" :class="{ 'mdi-pin-outline': !w.pin, 'mdi-pin': w.pin }" /></span>
        </button>
        <button class="button is-white is-small m-0" @click="close(i)">
          <span class="icon"><i class="mdi mdi-24px mdi-close" /></span>
        </button>
      </div>
      <component :is="w.c" :p="w.p" :i="i" @click="w.t = Date.now()">视图不存在</component>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, markRaw, nextTick } from 'vue'
import Loading from './components/Loading.vue'
import Bar from './components/Bar.vue'

const views = {
  affair: () => import('./views/Affair.vue'),
  batch: () => import('./views/Batch.vue'),
  data: () => import('./views/Data.vue'),
  group: () => import('./views/Group.vue'),
  home: () => import('./views/Home.vue'),
  msg: () => import('./views/Msg.vue'),
  photo: () => import('./views/Photo.vue'),
  preset: () => import('./views/Preset.vue'),
  user: () => import('./views/User.vue')
}
const load = (w) => markRaw(views[w] ? defineAsyncComponent(views[w]) : Loading)

ref: win = []
ref: N = window.innerWidth / 320
window.onresize = async () => {
  N = window.innerWidth / 320
  await nextTick()
  if (win.length > 1 && space.value < 0) remove((-1) * space.value)
}

const spaces = {
  affair: 2.5,
  batch: 2,
  data: 2.5,
  photo: 2
}
const space = computed(() => {
  let occupied = 0
  for (const w of win) occupied += spaces[w.v] || 1
  return N - occupied
})

function remove (req) {
  let i = 0
  const focus = []
  for (let i = 0; i < win.length; i++) focus.push({ i, t: win[i].t })
  focus.sort((a, b) => a.t - b.t)
  const del = []
  for (const f of focus) {
    if (win[f.i].pin) continue
    req -= (spaces[win[f.i].v] || 1)
    del.push(f.i)
    if (req <= 0) break
  }
  del.sort().reverse()
  for (const i of del) window.close(i)
}

function close (i) {
  window.close(i)
  if (!win.length) window.show('home')
}
window.close = (i) => win.splice(i, 1)

window.show = (view, params = {}) => setTimeout(() => {
  const w = { c: load(view), p: params, v: view, k: Math.random(), t: Date.now(), pin: false }
  const req = (spaces[view] || 1) - space.value
  if (req > 0) remove(req)
  if (win.length > 0 && win[0].v == 'home' && view == 'home') win[0].k = Math.random()
  else if (view == 'home') win.unshift(w)
  else win.push(w)
})

window.show('home')
</script>

<style scoped>
div.app {
  display: flex;
  height: calc(100vh - 3.25rem);
  overflow-y: hidden;
  transition: all 0.5s ease;
}
div.win {
  overflow-y: auto;
  flex-grow: 1;
  min-height: 100%;
  box-shadow: 4px 0px 4px #eee;
  position: relative;
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
