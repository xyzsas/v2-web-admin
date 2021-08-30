<template>
  <h2 class="title is-5">控制</h2>
  <loading v-if="!A">正在载入... </loading>
  <template v-else>
    <div class="field has-addons is-justify-content-center">
      <p class="control" style="flex-grow: 1;">
        <button class="button is-primary is-small is-fullwidth" @click="submit" :class="{ 'is-loading': loading }">提交事务</button>
      </p>
      <p class="control" style="flex-grow: 1;">
        <button class="button is-danger is-small is-fullwidth" @click="remove" :class="{ 'is-loading': loading }">删除事务</button>
      </p>
    </div>
    <div class="field has-addons is-justify-content-center">
      <p class="control" style="flex-grow: 1;">
        <button class="button is-info is-small is-fullwidth" @click="msg">发布消息</button>
      </p>
      <p class="control" style="flex-grow: 1;">
        <button class="button is-link is-small is-fullwidth" @click="data">管理数据</button>
      </p>
    </div>
    <h2 class="title is-6 m-2">预设模板：</h2>
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
    <h2 class="title is-6 m-2">事务变量：</h2>
    <textarea rows="8" class="code" v-model="A.vars" placeholder="$key: value"></textarea>
    <p style="font-size: 0.7rem; margin-bottom: 16px;">变量名必须为英文！</p>
    <h2 class="title is-6 m-2">事务组件：</h2>
    <p v-if="!Object.keys(A.pieces).length">暂无组件</p>
    <p class="mb-2" v-for="(v, k) in A.pieces"><code>{{ k }}</code>&nbsp;{{ pieceName(v) }}</p>
  </template>
</template>

<script setup>
import { nextTick } from 'vue'
import axios from '../../plugins/axios.js'
import { AS, CS, A, token } from '../../plugins/state.js'
import format from '../../plugins/format.js'
import Loading from '../../components/Loading.vue'
let loading = $ref(false)

const pieceName = T => ({
  simple: '简单组件'
})[T]

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
  // wait for mustache
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
  an.pieces = JSON.stringify(A.value.pieces || {})
  const vars = jsyaml.load(A.value.vars)
  for (const k in vars) if (k[0] === '$') an[k] = vars[k]
  await axios.post('/affair/' + A.value.id, an, token())
    .then(() => {
      Swal.fire('成功', '', 'success')
      AS.value[A.value.id] = an.title
    })
    .catch(catchErr)
  loading = false
}

async function remove () {
  if (!A.value) return
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
  window.show('msg', { id: A.value.id, title: A.value.title, link: '/#/@/' + A.value.id, duration, groups: A.value.groups })
}

function data () {
  window.show('data', { id: A.value.id })
}

function code () {
  if (CS.value.code) CS.value.code = false
  else {
    A.value.content = format(A.value.content)
    CS.value.code = true
  }
}

function preset () {
  window.show('preset')
}
</script>
