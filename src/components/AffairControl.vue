<template>
  <h2 class="title is-5">控制</h2>
  <loading v-if="!A">正在载入... </loading>
  <template v-else>
    <div class="field has-addons is-justify-content-center">
      <button class="button is-fullwidth is-primary" @click="submit" :class="{ 'is-loading': loading }">提交事务</button>
    </div>
    <div class="field has-addons is-justify-content-center">
      <p class="control" style="flex-grow: 1;">
        <button class="button is-info is-small is-fullwidth" @click="msg">发布消息</button>
      </p>
      <p class="control" style="flex-grow: 1;">
        <button class="button is-danger is-small is-fullwidth" @click="remove" :class="{ 'is-loading': loading }">删除事务</button>
      </p>
    </div>
    <hr class="mt-0 mb-2">
    <h2 class="title is-6 mb-2">预设模板：</h2>
    <code style="display: block;">{{ A.preset ? A.preset.replace('.js', '') : '未应用预设模板' }}</code>
    <div class="buttons mt-2">
      <button class="button is-fullwidth is-primary is-small is-light" @click="preset">
        <span class="icon is-small">
          <i class="mdi mdi-18px mdi-cog"></i>
        </span>
        <span>配置预设模板</span>
      </button>
      <button class="button is-fullwidth is-small is-info is-light" @click="code">
        <span class="icon is-small">
          <i class="mdi mdi-18px mdi-code-tags"></i>
        </span>
        <span>{{ CS.code ? '显示渲染效果' : '显示原始代码' }}</span>
      </button>
    </div>
  </template>
</template>

<script setup>
import { defineProps, nextTick } from 'vue'
import axios from '../plugins/axios.js'
import { AS, CS, A, token } from '../plugins/state.js'
import format from '../plugins/format.js'
import Loading from '../components/Loading.vue'
const props = defineProps(['data'])
ref: loading = false

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
}

async function submit () {
  if (!A.value.title || !A.value.groups || !A.value.content) {
    Swal.fire('错误', '标题、用户组、事务内容不能为空', 'error')
    return
  }
  loading = true
  // wait for pieces
  await nextTick()
  await nextTick()
  const an = {
    title: A.value.title,
    groups: A.value.groups,
    content: A.value.content,
    refs: A.value.refs
  }
  if (A.value.start) an.start = A.value.start
  if (A.value.end) an.end = A.value.end
  if (A.value.duration) an.duration = A.value.duration
  if (A.value.target) an.target = A.value.target
  if (A.value.anonymous) an.anonymous = A.value.anonymous
  if (A.value.preset) an.preset = A.value.preset
  if (A.value.params) an.params = A.value.params
  const vars = jsyaml.load(A.value.vars)
  for (const k in vars) if (k[0] === '$') an[k] = vars[k]
  for (const k in A.value.pieces) an[k] = JSON.stringify(A.value.pieces[k])
  await axios.post('/affair/' + A.value.id, an, token())
    .then(() => {
      Swal.fire('成功', '', 'success')
      AS.value[A.value.id] = an.title
    })
    .catch(catchErr)
  loading = false
}

async function remove () {
  if (!props.data || !A.value) return
  const res = await Swal.fire({
    title: '危险操作',
    html: `删除事务${A.value.title}?<br>事务数据也会被删除`,
    icon: 'warning',
    focusCancel: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  })
  if (!res.isConfirmed) return
  loading = true
  try {
    for (const d of props.data) {
      await axios.delete('/data/' + d, token())
    }
    await axios.delete('/affair/' + A.value.id, token())
    delete AS.value[A.value.id]
    Swal.fire('删除事务成功', '', 'success')
  } catch (e) {
    catchErr(e)
  }
  loading = false
}

function msg () {
  const ms2s = t => Math.floor(t/1000)
  const duration = A.value.end
    ? Math.min(ms2s(A.value.end - Date.now()), 604800)
    : A.value.start
      ? Math.min(ms2s(A.value.start - Date.now()) + 86400, 604800)
      : 604800
  window.open(`./#/msg?id=${A.value.id}&title=${A.value.title}&link=${encodeURIComponent('/#/@/' + A.value.id)}&duration=${duration}&groups=${A.value.groups}`, '/msg', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=0,height=600,width=360')
}

function code () {
  if (CS.value.code) CS.value.code = false
  else {
    A.value.content = format(A.value.content)
    CS.value.code = true
  }
}

function preset () {
  window.updateAffair = a => {
    for (const k in a) A.value[k] = a[k]
  }
  const win = window.open('./#/preset', '/preset', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=0,left=0,height=600,width=360')
  win.init = { affair: A.value.id, preset: A.value.preset, params: A.value.params }
}
</script>
