<template>
  <h2 class="title is-5">事务数据</h2>
  <loading v-if="!props.affair || !props.data">正在载入... </loading>
  <template v-else>
    <p v-if="!props.data.length">暂无数据</p>
    <item v-for="d in props.data" :id="d" type="data">{{ d.replace(`${affair.id}.P:`, '组件 ') }}</item>
  </template>
</template>

<script setup>
import { defineProps } from 'vue'
import Loading from '../components/Loading.vue'
import Item from '../components/Item.vue'
const props = defineProps(['affair', 'data'])
</script>