<template>
  <h2 class="title is-5">事务组件</h2>
  <p v-if="!Object.keys(PS).length">暂无组件</p>
  <p class="mb-2" v-for="(v, k) in PS"><code>{{ k }}</code>&nbsp;{{ name(v.T) }}</p>
</template>

<script setup>
import { PS } from '../plugins/state.js'
import { type } from '../pieces/index.js'
const name = T => (T == 'simple' ? '简单组件' : type[T] || '未定义')
</script>