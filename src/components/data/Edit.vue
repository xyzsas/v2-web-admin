<template>
  <div class="data">
    <input class="input is-info" type="text" placeholder="id" v-model="uid">
    <p class="m-2" v-if="!data.length">暂无数据</p>
    <template v-else>
      <div class="box" v-for="d in data">
        <h3 class="title is-4">{{ d.name }}</h3>
        <input class="input" v-if="!Object.keys(d.data).length" v-model="d.data">
        <template v-else>
          <div class="is-flex m-1" v-for="(v, k) in d.data">
            <label class="label" style="min-width: 120px;">{{ k }}</label>
            <input class="input is-small" v-model="d.data[k]">
          </div>
        </template>
      </div>
      <button class="button is-primary" :class="{ 'is-loading': loading }" @click="submit">提交</button>
    </template>
  </div>
</template>

<script setup>
import { watchEffect, defineProps } from 'vue'
import axios from '../../plugins/axios.js'
import { token } from '../../plugins/state.js'
const { values } = defineProps(['values'])

ref: uid = ''
ref: data = []
ref: oldData = []
watchEffect(() => {
  data = []
  oldData = []
  for (const id in values) {
    if (values[id][uid]) {
      let d = values[id][uid]
      oldData.push(d)
      try {
        d = JSON.parse(d)
      } catch {
        d = values[id][uid]
      }
      data.push({ id, name: id.replace(/^(.+?)\$\_/, '组件 ').replace(/^(.+?)\$/, ''), data: d })
    }
  }
  return data
})

ref: loading = false
const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

async function submit () {
}
</script>

<style scoped>
div.list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
div.data {
  width: 100%;
}
</style>