<template>
  <h2 class="title is-5">预设模板</h2>
  <div class="select is-small" :class="{ 'is-loading': loading }">
    <select v-model="id" style="width: 100vh;" @change="select">
      <option value="">无预设</option>
      <option v-for="(v, p) in presets" :value="p">{{ p.replace('.js', '') }}</option>
    </select>
  </div>
  <template v-if="preset">
    <div class="p-1 mt-2 is-small" style="background-color: #eee; font-size: 0.7rem;">此处显示预设模板的描述信息以及其它指南等</div>
    <label class="label mt-2">预设参数</label>
    <textarea rows="10" class="yml" v-model="input"></textarea>
  </template>
  <div class="buttons mt-2">
    <button v-if="preset" class="button is-primary is-small" @click="apply">应用预设</button>
    <button class="button is-small is-info is-light" @click="code">
      <span class="icon is-small">
        <i class="mdi mdi-18px mdi-code-tags"></i>
      </span>
      <span>高级编辑</span>
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['affair'])
const a = props.affair

import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'
import { getUrl } from '../plugins/convention.js'

ref: id = a.preset || ''
ref: preset = null
ref: presets = []
ref: input = a.params || ''
ref: loading = true
let template, codeWindow

const catchErr = e => {
  console.log(e)
  Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  return false
}

async function init () {
  const res = await axios.get('/store/preset/', token())
    .then(({ data }) => data)
    .catch(catchErr)
  if (!res) return
  loading = false
  template = res.template
  presets = res.data
  if (id) select()
}
init()

async function select () {
  if (!id) {
    preset = null
    return
  }
  loading = true
  try {
    preset = await import(getUrl('preset' + id, presets[id], template))
    console.log(preset)
    input = jsyaml.dump(preset.params)
  } catch (e) {
    Swal.fire('预设载入错误', '', 'error')
    console.error(e)
    id = ''
  }
  loading = false
}

async function apply () {
  const params = jsyaml.load(input)
  const err = await preset.check(params)
  if (err) {
    Swal.fire('预设参数错误', err, 'error')
    return
  }
  try {
    const res = await preset.generate(params)
    for (const k in res) a[k] = res[k]
    a.preset = id
    a.params = input
    if (codeWindow) codeWindow.updateCode(a.content)
    Swal.fire('预设应用成功', '', 'success')
  } catch (e) {
    Swal.fire('预设模板错误', e.toString(), 'error')
  }
}

function code () {
  window.updateCode = c => { a.content = c }
  codeWindow = window.open('./#/code', '/code', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=0,left=10000,height=600,width=500')
  codeWindow.initialCode = a.content
}
</script>
