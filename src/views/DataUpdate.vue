<template>
  <div class="p-4">
    <h1 class="title is-4 mb-0">数据详情</h1>
    <button class="button is-primary is-small mt-3" @click="update" :class="{ 'is-loading': loading }">更新</button>
    <p v-if="error" class="tag is-danger is-light">{{ error }}</p>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!data.length">暂无数据</p>
      <textarea id="d-copy" class="textarea has-fixed-size is-large mt-3 mb-3" style="overflow-y: scroll; height: 80vh;" v-model="data" :disabled="loading"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'
import Loading from '../components/Loading.vue'
const route = useRoute()
const id = route.params.id

ref: data = ''
ref: original = ''
ref: error = ''
ref: loading = false

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

function display (d) {
  const res = {}
  error = ''
  const rows = d.split('\n')
  const labels = rows[0].split('\t')
  if (labels.length < 2) {
    error = '数据格式错误, 需要至少两列'
    return false
  }
  for (const r of rows) {
    const info = r.split('\t')
    const id = info[0].toUpperCase()
    if (info.length === 2) res[id] = info[1]
    else {
      const val = {}
      for (let i = 1; i < labels.length; i++)
        val[labels[i]] = info[i]
      res[id] = JSON.stringify(val)
    }
  }
  delete res[labels[0]]
  return res
}


axios.get('/data/' + id, token())
.then(res => { 
  data += 'id\t' + Object.keys(JSON.parse(res.data[Object.keys(res.data)[0]])).join('\t') + '\n'
  for (const d in res.data) {
    data += `${d}\t${Object.keys(JSON.parse(res.data[d])).join('\t')}\n`
  }
  original = data
})
.catch(catchErr)



async function update () {
  if (original === data) {
    Swal.fire('更新成功', '', 'success')
    return
  }
  loading = true
  const edited = display(data)
  const raw = display(original)
  let dels = {}, puts = {}

  for (const r in raw) {
    if (edited[r] === undefined) dels[r] = 1
    else if (edited[r] !== raw[r]) puts[r] = edited[r]
  }
  console.log(puts)
  await axios.put(`/data/${id}`, { puts, dels }, token())
    .then(() => Swal.fire('数据更新成功', '', 'success'))
    .catch(catchErr)
  loading = false
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