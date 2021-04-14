<template>
  <div class="box m-3">
    <h1 class="title">Test Editor</h1>
    <p class="subtitle">only <code>piece</code> component is supported</p>
    <editor v-model="content" :key="key"></editor>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { md5 } from '../plugins/convention.js'
import Editor from '../components/Editor.vue'
ref: content = '123'
const key = computed(() => md5(content))
</script>