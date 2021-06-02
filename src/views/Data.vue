<template>
  <div>
    <h1 class="title is-4 mb-0">事务数据</h1>
    <code class="is-inline-block m-1" style="font-size: 0.8rem;">{{ p.id }}</code>
    <loading v-if="show == 'loading'">正在载入...</loading>
    <div class="field has-addons mt-2" v-else>
      <p class="control" v-if="show != 'list'">
        <button class="button" @click="show = 'list'">数据列表</button>
      </p>
      <p class="control" v-if="show != 'import'">
        <button class="button" @click="show = 'import'">导入数据</button>
      </p>
      <p class="control" v-if="show != 'export'">
        <button class="button" :disabled="!chosen.length" :class="{ 'is-loading': loading }" @click="go('export')">导出数据</button>
      </p>
      <p class="control" v-if="show != 'list'">
        <button class="button" :disabled="!chosen.length" :class="{ 'is-loading': loading }" @click="fetch">刷新数据</button>
      </p>
      <p class="control" v-if="show != 'edit'">
        <button class="button" :disabled="!chosen.length" :class="{ 'is-loading': loading }" @click="go('edit')">查询/编辑</button>
      </p>
    </div>
    <data-import v-if="show == 'import'" :id="p.id" @edit="edit"/>
    <data-export v-if="show == 'export'" :values="data" />
    <data-edit v-if="show == 'edit'" :values="data" :affair="p.id" />
    <div v-if="show == 'list'" class="is-fullwidth mt-3">
      <p v-if="!ids.length" class="ml-3">暂无数据</p>
      <p v-else class="ml-3" style="text-decoration: underline; cursor: pointer;" @click="selectAll">全选</p>
      <div class="data m-2" v-for="(d, i) in ids">
        <input type="checkbox" :value="d" v-model="chosen">
        {{ d.replace(p.id + '$_', '组件 ').replace(p.id + '$', '') }}
      </div>
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
import DataEdit from '../components/data/Edit.vue'

const { p } = defineProps(['p'])

ref: ids = null
ref: chosen = []
ref: show = 'loading'
ref: data = {}
ref: loading = false

const catchErr = async e => {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  loading = { 'edit': false, 'export': false }
}

axios.get('/data/?affair=' + p.id, token())
  .then(res => {
    ids = res.data
    show = 'list'
    chosen = []
    for (const d of ids) chosen.push(d)
  })
  .catch(catchErr)

function edit (id) {
  show = 'list'
  ids.push(id)
}

function selectAll () {
  if (chosen.length == ids.length) chosen = []
  else for (const d of ids) chosen.push(d)
}

async function fetch () {
  loading = true
  for (const id of chosen) {
    await axios.get('/data/' + id, token())
      .then(res => { 
        data[id] = res.data
      })
      .catch(catchErr)
  }
  loading = false
}

async function go(t) {
  await fetch()
  show = t
}
</script>

<style scoped>
div.data {
  width: 100%;
}
</style>