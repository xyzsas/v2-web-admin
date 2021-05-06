<template>
  <h2 class="title is-5">事务组件</h2>
  <loading v-if="!A">正在载入...</loading>
  <template v-else>
    <p v-if="!Object.keys(A.pieces).length">暂无组件</p>
    <p class="mb-2" v-for="(v, k) in A.pieces"><code>{{ k }}</code>&nbsp;{{ name(v.T) }}</p>
  </template>
</template>

<script setup>
import Loading from '../components/Loading.vue'
import { A } from '../plugins/state.js'
import { type } from '../pieces/index.js'
const name = T => (T == 'simple' ? '简单组件' : type[T] || '未定义')
</script>