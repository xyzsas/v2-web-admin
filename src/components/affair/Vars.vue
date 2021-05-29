<template>
  <h2 class="title is-5">事务变量</h2>
  <loading v-if="!A">正在载入... </loading>
  <template v-else>
    <textarea rows="8" class="code" v-model="A.vars" placeholder="$key: value"></textarea>
    <p style="font-size: 0.7rem;">变量名必须为英文！</p>
  </template>
</template>

<script setup>
import { A } from '../../plugins/state.js'
import Loading from '../../components/Loading.vue'
</script>
