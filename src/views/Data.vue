<template>
  <div class="p-4">
    <h1 class="title is-4 mb-0">事务数据</h1>
    <code class="is-inline-block m-1" style="font-size: 0.8rem;">{{ affair }}</code>
    <button class="button is-primary is-small ml-3" @click="add = true">添加数据</button>
    <data-import v-if="add" :id="affair" @update="update"/>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!data.length">暂无数据</p>
      <div class="data box m-2 p-2" v-for="d in data">{{ d.replace(affair + '$_', '组件 ').replace(affair, '') }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'
import Loading from '../components/Loading.vue'
import DataImport from '../components/data/DataImport.vue'
const route = useRoute()
const affair = route.params.id
ref: data = null
ref: add = false

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

axios.get('/data/?affair=' + affair, token())
  .then(res => { data = res.data })
  .catch(catchErr)

function update (id) {
  console.log('i')
  add = false
  data.push(id)
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