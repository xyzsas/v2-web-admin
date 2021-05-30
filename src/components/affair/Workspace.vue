<template>
  <loading v-if="!A">正在载入事务... </loading>
  <template v-else>
    <h1 class="title m-0">{{ A.title || '创建新事务' }}</h1>
    <hr class="m-3">
    <textarea v-if="CS.code" class="code" style="flex-grow: 1;" v-model="A.content"></textarea>
    <editor v-else v-model="A.content" :key="key"></editor>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { md5 } from '../../plugins/convention.js'
import { CS, A } from '../../plugins/state.js'
import Loading from '../../components/Loading.vue'
import Editor from '../../components/Editor.vue'
const key = computed(() => md5(A.value.content))
</script>