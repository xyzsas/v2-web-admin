<template>
  <div style="width: 100%;">
    <button class="button is-primary is-small mt-3" @click="copy">复制</button>
    <div class="list is-fullwidth mt-3" style="overflow: scroll; min-width: 720px;">
      <p v-if="!Object.keys(values)">暂无数据</p>
      <table class="table" id="d-copy">
        <thead>
          <tr>
            <th v-for="d in data[0]">{{ d }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in data[1]">
            <td v-for="v in d">{{ v }}</td>
          </tr>
        </tbody>
      </table>
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
  let res = []
  let title = []
  function parseMultiple () {
    for (const u of uids) {
      let temp = [u]
      for (const id of ids) temp.push(values[id][u] || '')
      res.push(temp)
    }
    title = ids.map(x => x.replace(/^(.+?)\$\_/, '组件 ').replace(/^(.+?)\$/, ''))
    title.unshift('id')
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
      for (const u of uids) {
        let temp = [u]
        for (const k of keys) temp.push(d[u][k] || '')
        res.push(temp)
      }
      keys.unshift('id')
      title = keys
    } catch (e) {
      parseMultiple()
    }
  }
  if (ids.length === 1) parseOne()
  if (ids.length > 1) parseMultiple()
  return [title, res]
})


function copy () {
  try {
    const el = document.querySelector('#d-copy')
    if (document.body.createTextRange) {  
      const range = document.body.createTextRange()
      range.moveToElementText(el)
      range.select()
    } else if (window.getSelection) {
      const selection = window.getSelection()
      if (document.createRange) {
        const range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
      } else selection.setBaseAndExtent(el, 0, el, 1)
    } else throw ''
    document.execCommand('copy')
    Swal.fire('复制成功', '', 'success')
  } catch (e) {
    console.log(e)
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