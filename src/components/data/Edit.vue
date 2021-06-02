<template>
  <div class="data">
    <input class="input is-info" type="text" placeholder="id" v-model="uid">
    <textarea class="mt-2 mb-2 code" rows="16" v-model="input" placeholder="暂无数据"></textarea>
    <template v-if="LS.developer">
      <div class="box">
        <pre v-if="err" style="color: red;">{{ err }}</pre>
        <h3 class="title is-5 mb-1" v-if="edit.puts">修改</h3>
        <p>{{ edit.puts }}</p>
        <h3 class="title is-5 mb-1 mt-2" v-if="edit.dels">删除</h3>
        <p>{{ edit.dels }}</p>
      </div>
      <button v-if="LS.developer" :disabled="!!err" class="button is-primary" :class="{ 'is-loading': loading }" @click="submit">提交</button>
    </template>
  </div>
</template>

<script setup>
import { watchEffect, computed, defineProps } from 'vue'
import axios from '../../plugins/axios.js'
import { LS, token } from '../../plugins/state.js'
const { values, affair } = defineProps(['values', 'affair'])

function isObjEqual (o1,o2) {
  const props1 = Object.getOwnPropertyNames(o1)
  const props2 = Object.getOwnPropertyNames(o2)
  if (props1.length != props2.length) return false
  for (let i = 0, max = props1.length; i < max; i++) {
    const propName = props1[i]
    if (o1[propName] !== o2[propName]) return false
  }
  return true
}

ref: uid = ''
ref: err = ''
ref: input = ''
ref: data = {}
watchEffect(() => {
  data = {}
  for (const id in values) {
    if (values[id][uid]) {
      let d = values[id][uid]
      try {
        d = JSON.parse(d)
      } catch {
        d = values[id][uid]
      }
      data[id.replace(/^(.+?)\$\_/, '组件').replace(/^(.+?)\$/, '')] = d
    }
  }
  input = Object.keys(data).length ? jsyaml.dump(data) : ''
})

const edit = computed(() => {
  try {
    err = ''
    const d = jsyaml.load(input)
    const res = { puts: [], dels: [] }
    for (const id in data) if (!d[id]) res.dels.push(id)
    for (const id in d) if (!isObjEqual(d[id], data[id])) res.puts.push(id)
    res.puts = res.puts.join()
    res.dels = res.dels.join()
    return res
  } catch (e) {
    err = e.toString()
    return { puts: '', dels: '' }
  }
})

ref: loading = false
const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

async function submit () {
  const da = jsyaml.load(input)
  const puts = edit.value.puts.split(','), dels = edit.value.dels.split(',')
  const update = {}
  for (const p of puts) update[p] = {}
  for (const d of dels) update[d] = {}
  for (const p of puts) update[p].puts = { [uid]: JSON.stringify(da[p]) }
  for (const d of dels) update[d].dels = { [uid]: 1 }
  delete update['']
  try {
    for (const id in update) {
      await axios.put('/data/' + affair + '$' + id.replace('组件', '_'), update[id], token())
    }
    Swal.fire('成功', '更新数据成功', 'success')
  } catch (e) {
    catchErr(e)
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