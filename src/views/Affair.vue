<template>
  <div class="affair p-2 tile is-ancestor affair">
    <div class="tile is-parent is-vertical is-4">
      <div class="tile is-child box">
        <affair-info :affair="affair"></affair-info>
      </div>
      <div class="tile is-child box">
        <affair-data :affair="affair" :data="data"></affair-data>
      </div>
    </div>
    <div class="tile is-parent is-vertical is-5">
      <div class="tile is-child box is-flex is-flex-direction-column" style="position: relative;">
        <span class="tag is-info is-light">编辑/预览</span>
        <affair-workspace :affair="affair" :settings="settings"></affair-workspace>
      </div>
    </div>
    <div class="tile is-parent is-vertical is-3">
      <div class="tile is-child box">
        <affair-control :affair="affair" :settings="settings" :data="data"></affair-control>
      </div>
      <div class="tile is-child box">
        <affair-variables :affair="affair"></affair-variables>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import axios from '../plugins/axios.js'
import { token, SS, pieces } from '../plugins/state.js'
import { md5 } from '../plugins/convention.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
// components
import AffairInfo from '../components/AffairInfo.vue'
import AffairData from '../components/AffairData.vue'
import AffairControl from '../components/AffairControl.vue'
import AffairVariables from '../components/AffairVariables.vue'
import AffairWorkspace from '../components/AffairWorkspace.vue'

ref: id = route.params.id == 'NEW' ? md5(Math.random().toString()) : route.params.id
ref: affair = null
ref: data = []
ref: settings = { code: false }

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!affair) window.close()
}

async function getAffair () {
  affair = null
  pieces.value = {}
  affair = await axios.get('/affair/' + id, token())
    .then(({ data }) => data)
    .catch(catchErr)
  const vars = {}
  for (const k in affair) {
    if (k.indexOf('V:') === 0) {
      vars[k.replace(/^V:/, '')] = affair[k]
      delete affair[k]
    }
  }
  affair.variables = Object.keys(vars).length ? jsyaml.dump(vars) : ''
  if (affair.pieces) pieces.value = JSON.parse(affair.pieces)
  axios.get('/data/?affair=' + id, token())
    .then(res => { data = res.data })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getAffair()
else affair = { id, groups: SS.group, content: '<p>在左侧设置事务基本信息</p><p>在此处编辑事务</p><p>在右侧可应用模板</p>' }
</script>

<style scoped>
div.affair {
  background-color: #eee;
  min-height: 100vh;
  margin: 0;
  width: 100%;
}
span.tag {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
