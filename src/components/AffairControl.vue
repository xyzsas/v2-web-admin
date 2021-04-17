<template>
  <h2 class="title is-5">控制</h2>
  <loading v-if="!props.affair">正在载入... </loading>
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
    <code style="display: block;">{{ props.affair.preset ? props.affair.preset.replace('.js', '') : '未应用预设模板' }}</code>
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
        <span>{{ props.settings.code ? '显示渲染效果' : '显示原始代码' }}</span>
      </button>
    </div>
  </template>
</template>

<script setup>
import { defineProps } from 'vue'
import axios from '../plugins/axios.js'
import { AS, token } from '../plugins/state.js'
import format from '../plugins/format.js'
import Loading from '../components/Loading.vue'
const props = defineProps(['affair', 'data', 'settings'])
ref: loading = false

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
}

async function submit () {
  if (!props.affair.title || !props.affair.groups || !props.affair.content) {
    Swal.fire('错误', '标题、用户组、事务内容不能为空', 'error')
    return
  }
  const an = {
    title: props.affair.title,
    groups: props.affair.groups,
    content: props.affair.content,
    refs: props.affair.refs
  }
  if (props.affair.start) an.start = props.affair.start
  if (props.affair.end) an.end = props.affair.end
  if (props.affair.duration) an.duration = props.affair.duration
  if (props.affair.anonymous) an.anonymous = props.affair.anonymous
  if (props.affair.preset) an.preset = props.affair.preset
  if (props.affair.params) an.params = props.affair.params
  const vars = jsyaml.load(props.affair.vars)
  for (const k in vars) if (k[0] === '$') an[k] = vars[k]
  loading = true
  await axios.post('/affair/' + props.affair.id, an, token())
    .then(() => {
      Swal.fire('成功', '', 'success')
      AS.value[props.affair.id] = an.title
    })
    .catch(catchErr)
  loading = false
}

async function remove () {
  if (!props.data || !props.affair) return
  const res = await Swal.fire({
    title: '危险操作',
    html: `删除事务${props.affair.title}?<br>事务数据也会被删除`,
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
    await axios.delete('/affair/' + props.affair.id, token())
    delete AS.value[props.affair.id]
    Swal.fire('删除事务成功', '', 'success')
  } catch (e) {
    catchErr(e)
  }
  loading = false
}

function msg () {
  const ms2s = t => Math.floor(t/1000)
  const duration = props.affair.end
    ? Math.min(ms2s(props.affair.end - Date.now()), 604800)
    : props.affair.start
      ? Math.min(ms2s(props.affair.start - Date.now()) + 86400, 604800)
      : 604800
  window.open(`./#/msg?id=${props.affair.id}&title=${props.affair.title}&link=${encodeURIComponent('/#/@/' + props.affair.id)}&duration=${duration}&groups=${props.affair.groups}`, '/msg', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=0,height=600,width=360')
}

function code () {
  if (props.settings.code) props.settings.code = false
  else {
    props.affair.content = format(props.affair.content)
    props.settings.code = true
  }
}

function preset () {
  window.updateAffair = a => {
    for (const k in a) props.affair[k] = a[k]
  }
  const win = window.open('./#/preset', '/preset', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=0,left=0,height=600,width=360')
  win.init = { affair: props.affair.id, preset: props.affair.preset, params: props.affair.params }
}
</script>
