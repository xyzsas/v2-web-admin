<template>
  <div :piece-start="props.id || ''" contenteditable="false" class="piece box">
    <loading v-if="!id">
      <p style="color: red; font-size: 0.8em;">组件id不正确<br>下次渲染将自动删除</p>
    </loading>
    <template v-else>
      <div class="is-flex is-align-items-center is-justify-content-space-between">
        <b class="m-0">组件 <code>{{ props.id }}</code></b>
        <div class="select is-small">
          <select v-model="PS[id].T">
            <option v-for="(v, k) in type" :value="k">{{ v }}</option>
          </select>
        </div>
      </div>
    </template>
    <div piece-end></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { PS } from '../plugins/state.js'
import { type } from './index.js'
import Loading from '../components/Loading.vue'
const props = defineProps(['id'])
ref: id = props.id && props.id[0] == '_' ? props.id : null
if (id && !PS.value[id]) PS.value[id] = {}
</script>

<style scoped>
div.piece {
  cursor: pointer;
}
</style>
