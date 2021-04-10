<template>
  <div class="tile is-ancestor affair">
    <div class="tile is-parent is-vertical is-7">
      <div class="tile is-child">
        <h1 class="title is-4 mb-1">事务 - {{ title }}</h1>
        <code>{{ id }}</code>
        <div class="buttons mt-3" v-if="affair">
          <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit">提交事务信息</button>
          <button class="button is-small is-danger" :class="{ 'is-loading': loading }" @click="remove" v-if="route.params.id != 'NEW'">删除事务</button>
          <button class="button is-small is-info" @click="msg">发布消息</button>
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
import { computed, watch } from 'vue'
import { affairs, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
import AffairInfo from '../components/AffairInfo.vue'
import AffairPreview from '../components/AffairPreview.vue'

ref: affair = null
ref: data = []
ref: loading = false
const id = computed(() => route.params.id == 'NEW' ? md5(Math.random()) : route.params.id)
const title = computed(() => route.params.id == 'NEW'
  ? '创建新事务'
  : affair ? affair.title : '正在载入...'
)
watch(affairs, v => {
  if (route.params.id != 'NEW' && !v[route.params.id]) setTimeout(window.close, 2000)
})

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!affair) window.close()
}

function getAffair () {
  affair = null
  axios.get('/affair/' + id.value, token())
    .then(({ data }) => {
      affair = data
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
  axios.get('/data/?affair=' + id.value, token())
    .then(res => { data = res.data })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getAffair()
else affair = {}

async function submit () {
  if (!affair.title || !affair.groups || !affair.content) {
    Swal.fire('错误', '标题、用户组、事务内容不能为空', 'error')
    return
  }
  const a = {
    title: affair.title,
    groups: affair.groups,
    content: affair.content,
    refs: affair.refs,
  }
  if (affair.start) a.start = affair.start
  if (affair.end) a.end = affair.end
  if (affair.duration) a.duration = affair.duration
  if (affair.anonymous) a.anonymous = affair.anonymous
  if (affair.preset) a.preset = affair.preset
  if (affair.params) a.params = affair.params
  const vars = jsyaml.load(affair.variables)
  for (const k in vars) a['V:' + k] = vars[k]
  loading = true
  await axios.post('/affair/' + id.value, a, token())
    .then(() => {
      Swal.fire('成功', '', 'success')
      affairs.value[id.value] = affair.title
      route.params.id = id.value
    })
    .catch(catchErr)
  loading = false
}

async function remove () {
  if (!data || !affair) return
  const res = await Swal.fire({
    title: '危险操作',
    html: `删除事务${affair.title}?<br>事务数据也会被删除`,
    icon: 'warning',
    focusCancel: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  })
  if (!res.isConfirmed) return
  loading = true
  try {
    for (const d of data) {
      await axios.delete('/data/' + d, token())
    }
    await axios.delete('/affair/' + id.value, token())
    delete affairs.value[id.value]
    Swal.fire('删除事务成功', '', 'success')
  } catch (e) {
    catchErr(e)
  }
  loading = false
}

function msg () {
  const ms2s = t => Math.floor(t/1000)
  const duration = affair.end
    ? Math.min(ms2s(affair.end - Date.now()), 604800)
    : affair.start
      ? Math.min(ms2s(affair.start - Date.now()) + 86400, 604800)
      : 604800
  window.open(`./#/msg?id=${affair.id}&title=${affair.title}&link=${encodeURIComponent('/#/@/' + affair.id)}&duration=${duration}&groups=${affair.groups}`, '/msg', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=0,height=600,width=360')
}
</script>

<style scoped>
div.affair {
  background-color: #f3f3f3;
  min-height: 100vh;
  margin: 0;
}
</style>