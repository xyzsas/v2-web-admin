<template>
  <div style="width: 100%;">
    <button class="button is-primary is-small mt-3" @click="copy">复制</button>
    <div class="list is-fullwidth mt-3">
      <p v-if="!ids.length">暂无数据</p>
      <textarea id="d-copy" class="code" style="overflow-y: scroll; height: 60vh;" :value="data" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const { values } = defineProps(['values'])

ref: data = ''
const ids = Object.keys(values)

let uids = new Set()
for (const id in values) {
  for (const uid in values[id]) uids.add(uid)
}
uids = Array.from(uids)

function parseMultiple () {
  data = 'id\t' + ids.map(x => x.replace(/^(.+?)\$\_/, '组件 ').replace(/^(.+?)\$/, '')).join('\t') + '\n'
  for (const u of uids) {
    data += u + '\t'
    for (const id of ids) data += (values[id][u] || '') + '\t'
    data += '\n'
  }
}

function parseOne () {
  const d = values[ids[0]]
  try {
    for (const u in d) d[u] = JSON.parse(d[u])
    let keys = new Set()
    for (const u in d) {
      for (const k in d[u]) keys.add(k)
    }
    keys = Array.from(keys)
    data = 'id\t' + keys.join('\t') + '\n'
    for (const u of uids) {
      data += u + '\t'
      for (const k of keys) data += (d[u][k] || '') + '\t'
      data += '\n'
    }
  } catch (e) {
    console.log(e)
    parseMultiple()
  }
}

if (ids.length === 1) parseOne()
if (ids.length > 1) parseMultiple()

function copy () {
  try {
    const el = document.querySelector('#d-copy')
    el.select()
    document.execCommand('copy')
    Swal.fire('复制成功', '', 'success')
  } catch {
    Swal.fire('错误', '复制内容失败！', 'error')
  }
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