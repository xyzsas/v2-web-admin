<template>
  <div class="data">
    <input class="input is-info" type="text" placeholder="输入查询人员ID" v-model="uid" @keyup.enter="search">
    <!-- <button class="button is-primary is-small mt-3" @click="edit" :class="{ 'is-loading': loading }">更新</button> -->
    <div class="list is-fullwidth mt-3">
      <p v-if="!studentInfo.length">暂无数据</p>
      <textarea id="d-copy" class="textarea has-fixed-size is-large mt-3 mb-3" style="overflow-y: scroll; height: 80vh;" v-model="studentInfo" readonly/>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import axios from '../../plugins/axios.js'
import { token } from '../../plugins/state.js'
import Loading from '../Loading.vue'
const { values } = defineProps(['values'])

ref: data = {}
ref: studentInfo = ''
ref: loading = false
ref: uid = ''

let uids = new Set()
for (const id in values) {
  console.log(values[id])
  for (const u in values[id]) uids.add(u)
}
uids = Array.from(uids)
const dids = Object.keys(values)

// reconstruct the data to make it based on users 
function parse () {
  data['title'] = 'id\t' + dids.map(x => x.replace(/^(.+?)\$\_/, '组件 ').replace(/^(.+?)\$/, '')).join('\t') + '\n'
  for (const u of uids) {
    data[u] = u + '\t'
    for (const id of dids) data[u] += (values[id][u] || '') + '\t'
    data[u].substring(0, data.length - 2)
  }
  
  console.log(data)
}
parse()

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

function parseOne (d) {
  let vals = d.split('\t')
  let res = ''
  vals.shift()
  vals = vals.filter(x => x && x.length > 0)
  try {
    vals = vals.map(x => JSON.parse(x))
    let keys = []
    for (const v of vals) {
      for (const k in v) keys.push(k)
    }
    res = 'id\t' + keys.join('\t') + '\n' + uid + '\t'
    for (const v of vals) {
      for (const k in v) res += (v[k] || '') + '\t'
    }
  } catch (e) {
    console.log(e)
  }
  return res
}

function search() {
  studentInfo = ''
  console.log(uid)
  if (!uid || !uids.includes(uid)) return
  studentInfo = parseOne(data[uid])
}

function display () {}

// TODO: edit
async function edit () {}

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