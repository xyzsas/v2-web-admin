<template>
  <div class="p-4">
    <h1 class="title is-4 mb-0">事务数据</h1>
    <code class="is-inline-block m-1" style="font-size: 0.8rem;">{{ p.id }}</code>
    <button class="button is-primary is-small ml-3" @click="show = 'import'">添加数据</button>
    <data-import v-if="show == 'import'" :id="p.id" @update="update"/>
    <loading v-if="!data">正在载入...</loading>
    <div class="list is-fullwidth mt-3" v-else>
      <p v-if="!data.length">暂无数据</p>
      <div class="tabs" style="width: 100%;">
        <ul>
          <li><input type="checkbox" v-model="all" @click="selectAll"> 全选 </li>
          <li><button :disabled="!chosen.length" class="button is-info is-small ml-3" @click="show = 'export'">查看</button></li>
          <li><button :disabled="chosen.length !== 1" class="button is-info is-small ml-3" @click="edit">修改</button></li>
        </ul>
      </div>
      <div v-if="show == 'list'" class="data m-2" v-for="(d, i) in data">
        <input type="checkbox" :value="d" v-model="chosen">
        {{ d.replace(p.id + '$_', '组件 ').replace(p.id + '$', '') }}
      </div>
      <data-export v-if="show == 'export'" :ids="chosen" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'
import Loading from '../components/Loading.vue'
import DataImport from '../components/data/Import.vue'
import DataExport from '../components/data/Export.vue'
const { p } = defineProps(['p'])

ref: data = null
ref: chosen = []
ref: all = false
ref: show = 'list'

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!data) window.close()
}

axios.get('/data/?affair=' + p.id, token())
  .then(res => { data = res.data; chosen = [] })
  .catch(catchErr)

function update (id) {
  show = 'list'
  data.push(id)
}

function selectAll () {
  chosen = []
  if (!all) for (const d of data) chosen.push(d)
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