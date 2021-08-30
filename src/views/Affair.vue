<template>
  <div class="affair">
    <div style="min-width: 240px;">
      <affair-info></affair-info>
    </div>
    <div class="box is-flex is-flex-direction-column ml-4 mr-4" style="position: relative; max-width: 480px; min-width: 320px; width: 400px;">
      <span class="tag is-info is-light">编辑/预览</span>
      <affair-workspace></affair-workspace>
    </div>
    <div style="min-width: 200px;">
      <affair-control></affair-control>
    </div>
  </div>
</template>

<script setup>
import { watch, defineProps } from 'vue'
import axios from '../plugins/axios.js'
import { AS, U, A, token } from '../plugins/state.js'
import { md5 } from '../plugins/convention.js'
// components
import AffairInfo from '../components/affair/Info.vue'
import AffairControl from '../components/affair/Control.vue'
import AffairWorkspace from '../components/affair/Workspace.vue'

const { p, i:self } = defineProps(['p', 'i'])
let id = $ref(p.id == 'NEW' ? md5(Math.random().toString()) : p.id)

watch(() => AS.value[id], v => {
  if (!v) setTimeout(() => { window.close(self) }, 2000)
})

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!A.value) window.close()
}

async function getAffair () {
  A.value = await axios.get('/affair/' + id, token())
    .then(({ data }) => data)
    .catch(catchErr)
  A.value.vars = {}
  A.value.pieces = {}
  for (const k in A.value) {
    if (k[0] == '$') {
      A.value.vars[k] = A.value[k]
      delete A.value[k]
    }
    if (k[0] == '_') {
      A.value.pieces[k] = JSON.parse(A.value[k])
      delete A.value[k]
    }
  }
  A.value.vars = Object.keys(A.value.vars).length ? jsyaml.dump(A.value.vars) : ''
}

A.value = null
if (p.id != 'NEW') getAffair()
else {
  A.value = { id, groups: U.group, vars: '', pieces: {}, content: '<p>在左侧设置事务基本信息</p><p>在此处编辑事务</p><p>在右侧可应用模板</p>' }
}
</script>

<style scoped>
div.affair {
  min-height: 95%;
  min-width: 720px;
  display: flex;
  margin: 0;
}
div.affair * {
  flex-grow: 1;
}
span.tag {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
