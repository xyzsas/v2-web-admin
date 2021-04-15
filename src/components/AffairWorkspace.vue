<template>
  <loading v-if="!props.affair">正在载入事务... </loading>
  <template v-else>
    <h1 class="title">{{ props.affair.title || '创建新事务' }}</h1>
    <textarea class="yml" style="flex-grow: 1;" v-if="props.settings.code" v-model="props.affair.content"></textarea>
    <editor v-else v-model="props.affair.content" :key="key"></editor>
  </template>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { md5 } from '../plugins/convention.js'
import Loading from '../components/Loading.vue'
import Editor from '../components/Editor.vue'
const props = defineProps(['affair', 'settings'])
const key = computed(() => md5(props.affair.content))
</script>