<template>
  <div class="tile is-ancestor affair">
    <div class="tile is-parent is-vertical is-7">
      <div class="tile is-child">
        <h1 class="title is-4 mb-1">事务 - {{ title }}</h1>
        <code>{{ id }}</code>
        <div class="buttons mt-3" v-if="affair">
          <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit">提交事务信息</button>
          <button class="button is-small is-danger" :class="{ 'is-loading': loading }" @click="remove">删除事务</button>
          <button class="button is-small is-info is-light" @click="code">
            <span class="icon is-small">
              <i class="mdi mdi-18px mdi-code-tags"></i>
            </span>
            <span>高级编辑</span>
          </button>
        </div>
      </div>
      <div class="tile is-child">
        <affair-info v-if="affair" :affair="affair" :data="data"></affair-info>
      </div>
    </div>
    <div class="tile is-parent is-vertical is-5">
      <affair-preview v-if="affair" :affair="affair"></affair-preview>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { affairs, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
import AffairInfo from '../components/AffairInfo.vue'
import AffairPreview from '../components/AffairPreview.vue'

ref: affair = null
ref: data = null
ref: loading = false
const id = computed(() => route.params.id == 'NEW' ? md5(Math.random()) : route.params.id)
const title = computed(() => route.params.id == 'NEW'
  ? '创建新事务'
  : affair ? affair.title : '正在载入...'
)

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!affair) window.close()
}

function getAffair () {
  affair = null
  axios.get('/affair?affair=' + id.value, token())
    .then(({ data }) => {
      affair = data
      affair.groups = affair.groups.split(',')
      const vars = {}
      for (const k in affair) {
        if (k.indexOf('V:') === 0) {
          vars[k.replace(/^V:/, '')] = affair[k]
          delete affair[k]
        }
      }
      affair.variables = Object.keys(vars).length ? jsyaml.dump(vars) : ''
    })
    .catch(catchErr)
  axios.get('/data?affair=' + id.value, token())
    .then(res => { data = res.data })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getAffair()
else affair = {}

async function submit () {
  const a = {
    id: id.value,
    title: affair.title,
    groups: affair.groups.join(','),
    content: affair.content,
    refs: affair.refs
  }
  if (affair.start) a.start = affair.start
  if (affair.end) a.end = affair.end
  if (affair.duration) a.duration = affair.duration
  if (affair.anonymous) a.anonymous = affair.anonymous
  const vars = jsyaml.load(affair.variables)
  for (const k in vars) a['V:' + k] = vars[k]
  loading = true
  await axios.post('/affair', a, token())
    .then(() => { Swal.fire('成功', '', 'success') })
    .catch(catchErr)
  loading = false
}

</script>

<style scoped>
div.affair {
  background-color: #f3f3f3;
  min-height: 100vh;
  margin: 0;
}
</style>