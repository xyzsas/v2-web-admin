<template>
  <h2 class="title is-5 mb-0">基本信息</h2>
  <loading v-if="!props.affair">正在载入... </loading>
  <template v-else>
    <code class="is-inline-block mb-2" style="font-size: 0.8rem;">{{ props.affair.id }}</code>
    <label class="label">标题：</label>
    <input v-model="props.affair.title" class="input is-small">
    <label class="label mt-2">用户组：</label>
    <group-selector v-if="!props.affair.anonymous" v-model="props.affair.groups"></group-selector>
    <label class="checkbox" :style="{ color: props.affair.anonymous ? 'red' : 'black' }">
      <input v-model="props.affair.anonymous" type="checkbox">
      允许匿名访问
    </label>
    <label class="label mt-2">开始时间：</label> 
    <input v-model="props.affair.start" class="input is-small" placeholder="无限制">
    <label class="label mt-2">结束时间：</label> 
    <input v-model="props.affair.end" class="input is-small" placeholder="无限制">
    <label class="label mt-2">允许时长（秒）：</label> 
    <input v-model="props.affair.duration" class="input is-small" placeholder="无限制">
  </template>
</template>

<script setup>
import { defineProps } from 'vue'
import GroupSelector from '../components/GroupSelector.vue'
import Loading from '../components/Loading.vue'
const props = defineProps(['affair'])
</script>
