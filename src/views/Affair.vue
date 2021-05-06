<template>
  <div class="affair p-2 tile is-ancestor affair">
    <div class="tile is-parent is-vertical is-4">
      <div class="tile is-child box">
        <affair-info></affair-info>
      </div>
    </div>
    <div class="tile is-parent is-vertical is-5">
      <div class="tile is-child box is-flex is-flex-direction-column" style="position: relative;">
        <span class="tag is-info is-light">编辑/预览</span>
        <affair-workspace></affair-workspace>
      </div>
    </div>
    <div class="tile is-parent is-vertical is-3">
      <div class="tile is-child box">
        <affair-control></affair-control>
      </div>
      <div class="tile is-child box">
        <affair-vars></affair-vars>
      </div>
      <div class="tile is-child box">
        <affair-pieces></affair-pieces>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import axios from '../plugins/axios.js'
import { AS, U, A, token } from '../plugins/state.js'
import { md5 } from '../plugins/convention.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
// components
import AffairInfo from '../components/AffairInfo.vue'
import AffairVars from '../components/AffairVars.vue'
import AffairPieces from '../components/AffairPieces.vue'
import AffairControl from '../components/AffairControl.vue'
import AffairWorkspace from '../components/AffairWorkspace.vue'

ref: id = route.params.id == 'NEW' ? md5(Math.random().toString()) : route.params.id

watch(() => AS.value[id], v => {
  if (!v) setTimeout(window.close, 2000)
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
if (route.params.id != 'NEW') getAffair()
else {
  A.value = { id, groups: U.group, vars: '', pieces: {}, content: '<p>在左侧设置事务基本信息</p><p>在此处编辑事务</p><p>在右侧可应用模板</p>' }
}
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
