<template>
  <div style="width: 100%;">
    <button class="button is-primary is-small mt-3" @click="copy">复制</button>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!props.ids.length">暂无数据</p>
      <textarea id="d-copy" class="code" style="overflow-y: scroll; height: 60vh;">{{ data }}</textarea>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import axios from '../../plugins/axios.js'
import { token } from '../../plugins/state.js'
import Loading from '../../components/Loading.vue'
const props = defineProps(['ids'])
ref: data = ''

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

console.log(props.ids)

for (const d of props.ids) {
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