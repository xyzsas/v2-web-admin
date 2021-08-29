<template>
  <div class="select is-small is-multiple" style="width: 100%;">
    <select multiple size="4" v-model="selected" style="width: 100%;" @change="change">
      <option v-for="g in displayGroups">{{ g }}</option>
    </select>
    <p class="mb-2">电脑端按住<code>Ctrl</code>键取消选择</p>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmit(['update:modelValue'])

import { GS } from '../plugins/state.js'

let selected = $ref(props.modelValue ? props.modelValue.split(',') : [])
const displayGroups = computed(() => {
  const res = []
  for (const g in GS.value) {
    let useful = true
    for (const s of selected) {
      if (g.indexOf(s) == 0 && g != s) {
        useful = false
        break
      }
    }
    if (useful) res.push(g)
  }
  return res
})

function change () {
  emit('update:modelValue', selected.join(','))
}
</script>