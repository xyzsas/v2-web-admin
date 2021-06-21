<template>
  <h2 class="title is-5 mb-0">基本信息</h2>
  <loading v-if="!A">正在载入... </loading>
  <template v-else>
    <code class="is-inline-block mb-2" style="font-size: 0.8rem;">{{ A.id }}</code>
    <label class="label">标题：</label>
    <input v-model="A.title" class="input is-small">
    <template v-if="!A.anonymous">
      <label class="label mt-2">用户组：</label>
      <group-selector v-model="A.groups"></group-selector>
    </template>
    <label class="checkbox mt-2" :style="{ color: A.anonymous ? 'red' : 'black' }">
      <input v-model="A.anonymous" type="checkbox">
      允许匿名访问
    </label>
    <label class="label mt-2">开始时间：</label> 
    <input v-model="A.start" class="input is-small" placeholder="无限制">
    <label class="label mt-2">结束时间：</label> 
    <input v-model="A.end" class="input is-small" placeholder="无限制">
    <label class="label mt-2">允许时长（秒）：</label> 
    <input v-model="A.duration" class="input is-small" placeholder="无限制">
    <template v-if="LS.developer">
      <label class="label mt-2" style="color: red;">提交目标：</label> 
      <input v-model="A.target" class="input is-small" placeholder="/service/">
    </template>
    <template v-if="A.anonymous">
      <label class="label mt-2">事务二维码：</label>
      <qrcode-vue :value="qrurl" :size="160"></qrcode-vue>
    </template>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { LS, A } from '../../plugins/state.js'
import GroupSelector from '../../components/GroupSelector.vue'
import Loading from '../../components/Loading.vue'
import QrcodeVue from 'qrcode.vue'
const qrurl = computed(() => window.location.origin + '/#/@/' + A.value.id)
</script>
