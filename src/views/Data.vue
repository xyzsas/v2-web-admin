<template>
  <div class="p-4">
    <h1 class="title is-4 mb-0">事务数据</h1>
    <code class="is-inline-block m-1" style="font-size: 0.8rem;">{{ affair }}</code>
    <button class="button is-primary is-small ml-3" @click="add = true">添加数据</button>
    <data-import v-if="add" :id="affair" @update="update"/>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!data.length">暂无数据</p>
      <div class="tabs" style="width: 100%;">
        <ul>
          <li><input type="checkbox" v-model="all" @click="selectAll"> 全选
</li>
          <li><button :disabled="!selected" class="button is-info is-small ml-3" @click="view">查看</button></li>
          <li><button :disabled="selected !== 1" class="button is-info is-small ml-3" @click="edit">修改</button></li>
        </ul>
      </div>
      <div class="data box m-2 p-2" v-for="(d, i) in data">
        <input type="checkbox" v-model="chosen[i]">
        {{ d.replace(affair + '$_', '组件 ').replace(affair, '') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'
import Loading from '../components/Loading.vue'
import DataImport from '../components/data/DataImport.vue'
const route = useRoute()
const router = useRouter()
const affair = route.params.id

ref: data = null
ref: add = false
ref: chosen = []
ref: all = false


const selected = computed (() => chosen.filter(x => x === true).length)

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

axios.get('/data/?affair=' + affair, token())
  .then(res => { data = res.data; chosen = Array.apply(false, Array(data.length)) })
  .catch(catchErr)

function update (id) {
  add = false
  data.push(id)
  chosen.push(false)
}

function selectAll () {
  if (all) chosen = chosen.map(x => false)
  else chosen = chosen.map(x => true)
}

function view () {
  let ids = []
  for (let i = 0; i < chosen.length; i++) {
    if (chosen[i]) ids.push(data[i])
  }
  router.push('/dataexport/' + ids.join('.'))
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