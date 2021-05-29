<template>
  <component :is="c" :p="p">视图不存在</component>
</template>

<script setup>
import { defineAsyncComponent, shallowRef } from 'vue'
import Loading from './components/Loading.vue'

const N = Math.floor(window.innerWidth / 400) || 1
ref: win = []

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
const load = (w) => views[w] ? defineAsyncComponent(views[w]) : Loading

const c = shallowRef(load('home'))
ref: p = undefined
window.show = (view, params) => {
  c.value = load(view)
  p = params
}
</script>

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
