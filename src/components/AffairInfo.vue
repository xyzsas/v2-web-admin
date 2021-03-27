<template>
  <div>
    <div class="box">
      <h2 class="title is-5">基本信息</h2>
      <label class="label">标题：</label>
      <input v-model="a.title" class="input is-small">
      <label class="label mt-2">用户组：</label>
      <div class="select is-small is-multiple" v-if="!a.anonymous">
        <select multiple size="4" v-model="a.groups" style="width: 80vw;">
          <option v-for="g in displayGroups">{{ g }}</option>
        </select>
        <p class="mb-2">电脑端请按住<code>Ctrl</code>键点击选择</p>
      </div>
      <label class="checkbox" :style="{ color: a.anonymous ? 'red' : 'black' }">
        <input v-model="a.anonymous" type="checkbox">
        允许匿名访问
      </label>
      <label class="label mt-2">开始时间：</label> 
      <input v-model="a.start" class="input is-small" placeholder="无限制">
      <label class="label mt-2">结束时间：</label> 
      <input v-model="a.end" class="input is-small" placeholder="无限制">
      <label class="label mt-2">允许时长（秒）：</label> 
      <input v-model="a.duration" class="input is-small" placeholder="无限制">
    </div>
    <div class="box">
      <h2 class="title is-5">事务变量</h2>
      <p>Under development</p>
    </div>
    <div class="box" v-if="props.data">
      <h2 class="title is-5">事务数据</h2>
      <item v-for="d in props.data" :id="d" type="data">{{ d.replace(`${a.id}.P:`, '组件 ') }}</item>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { groups } from '../plugins/state.js'
import Item from '../components/Item.vue'

const props = defineProps(['modelValue', 'data'])
const emit = defineEmit(['update:modelValue'])

const a = props.modelValue

const displayGroups = computed(() => {
  const res = []
  for (const g in groups.value) {
    let useful = true
    for (const s of a.groups) {
      if (g.indexOf(s) == 0 && g != s) {
        useful = false
        break
      }
    }
    if (useful) res.push(g)
  }
  return res
})
</script>
