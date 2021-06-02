<template>
  <div style="width: 100%;">
    <button class="button is-primary is-small mt-3" @click="copy">复制</button>
    <div class="list is-fullwidth mt-3">
      <p v-if="!Object.keys(values)">暂无数据</p>
      <textarea id="d-copy" class="code" style="overflow-y: scroll; height: 60vh;" :value="data" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const { values } = defineProps(['values'])

const data = computed(() => {
  const ids = Object.keys(values)
  let uids = new Set()
  for (const id in values) {
    for (const uid in values[id]) uids.add(uid)
  }
  uids = Array.from(uids)
  let res = ''
  function parseMultiple () {
    res = 'id\t' + ids.map(x => x.replace(/^(.+?)\$\_/, '组件 ').replace(/^(.+?)\$/, '')).join('\t') + '\n'
    for (const u of uids) {
      res += u + '\t'
      for (const id of ids) res += (values[id][u] || '') + '\t'
      res += '\n'
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
      res = 'id\t' + keys.join('\t') + '\n'
      for (const u of uids) {
        res += u + '\t'
        for (const k of keys) res += (d[u][k] || '') + '\t'
        res += '\n'
      }
    } catch (e) {
      parseMultiple()
    }
  }
  if (ids.length === 1) parseOne()
  if (ids.length > 1) parseMultiple()
  return res
})

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