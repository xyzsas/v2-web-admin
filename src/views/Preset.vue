<template>
  <div class="p-4" style="max-width: 500px;">
    <h1 class="title is-4">预设模板</h1>
    <p class="subtitle is-6">事务：<code>{{ affair }}</code></p>
    <loading v-if="!Object.keys(presets).length">正在载入... </loading>
    <template v-else>
      <div class="select">
        <select v-model="preset" style="width: 100vw;" @change="select">
          <option value="">无预设</option>
          <option v-for="(v, p) in presets" :value="p">{{ p.replace('.js', '') }}</option>
        </select>
        <loading v-if="loading">正在载入模板信息...</loading>
        <template v-if="M">
          <div class="p-1 mt-2 is-small" style="background-color: #eee; font-size: 0.7rem;">{{ M.info }}</div>
          <label class="label mt-2">预设参数</label>
          <textarea rows="20" class="yml" v-model="params"></textarea>
          <button class="button is-primary mt-2" @click="apply">应用预设</button>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import axios from '../plugins/axios.js'
import { PS, token } from '../plugins/state.js'
import { getUrl } from '../plugins/convention.js'
import Loading from '../components/Loading.vue'
if (!window.init) window.close()
ref: affair = window.init.affair
ref: preset = window.init.preset || ''
ref: params = window.init.params || ''
ref: presets = []
ref: loading = false
ref: M = null
let template

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
  template = res.template
  presets = res.data
  if (preset) select()
}
init()

async function select () {
  if (!preset) {
    M = null
    return
  }
  loading = true
  try {
    M = await import(getUrl('preset' + preset, presets[preset], template))
    console.log(M)
    if (window.init.params) delete window.init.params
    else params = jsyaml.dump(M.params)
  } catch (e) {
    Swal.fire('预设载入错误', '', 'error')
    console.error(e)
    preset = ''
  }
  loading = false
}

async function apply () {
  const p = jsyaml.load(params)
  const err = await M.check(p)
  if (err) {
    Swal.fire('预设参数错误', err, 'error')
    return
  }
  try {
    const res = await M.generate(p)
    res.preset = preset
    res.params = params
    window.opener.updateAffair(res)
    await Swal.fire('预设应用成功', '', 'success')
    window.close()
  } catch (e) {
    Swal.fire('预设模板错误', e.toString(), 'error')
  }
}
</script>
