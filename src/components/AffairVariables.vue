<template>
  <h2 class="title is-5">事务变量</h2>
  <loading v-if="!props.affair">正在载入... </loading>
  <template v-else>
    <textarea rows="10" class="yml" v-model="props.affair.variables" placeholder="无变量"></textarea>
    <p style="font-size: 0.7rem;">变量名必须为英文！</p>
  </template>
</template>

<script setup>
import { defineProps } from 'vue'
import Loading from '../components/Loading.vue'
const props = defineProps(['affair'])
</script>
