<template>
  <div class="p-4">
    <h1 class="title is-4 mb-0">数据详情</h1>
    <button class="button is-primary is-small mt-3" @click="copy">复制</button>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!dataids.length">暂无数据</p>
      <textarea id="d-copy" class="textarea has-fixed-size is-large mt-3 mb-3" style="overflow-y: scroll; height: 80vh;">{{ data }}</textarea>
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
const dataids = route.params.id.split('.')

ref: data = ''

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

for (const d of dataids) {
  axios.get('/data/' + d, token())
  .then(res => { 
    data += 'id\t' + Object.keys(JSON.parse(res.data[Object.keys(res.data)[0]])).join('\t') + '\n'
    for (const d in res.data) {
      data += `${d}\t${Object.keys(JSON.parse(res.data[d])).join('\t')}\n`
    }
  })
  .catch(catchErr)
}

function copy () {
  try {
    const el = document.querySelector('#d-copy')
    el.select()
    document.execCommand('copy')
    swal.fire('复制成功', '', 'success')
  } catch {
    swal.fire('错误', '复制内容失败！', 'error')
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