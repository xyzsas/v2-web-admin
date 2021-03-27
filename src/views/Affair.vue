<template>
  <div class="p-4">
    <h1 class="title is-4" style="margin-bottom: 5px;">事务 - {{ title }}</h1>
    <code>{{ id }}</code>
    <div class="box" v-if="affair" style="margin-top: 20px;">
      <h2 class="title is-5">基本信息</h2>
      <label class="label">标题：</label>
      <input v-model="affair.title" class="input is-small">
      <label class="label mt-2">用户组：</label>
      <div class="select is-small is-multiple" v-if="!affair.anonymous">
        <select multiple size="4" v-model="affair.groups" style="width: 80vw;">
          <option v-for="g in displayGroups">{{ g }}</option>
        </select>
        <p class="mb-2">电脑端请按住<code>Ctrl</code>键点击选择</p>
      </div>
      <label class="checkbox" :style="{ color: affair.anonymous ? 'red' : 'black' }">
        <input v-model="affair.anonymous" type="checkbox">
        允许匿名访问
      </label>
      <label class="label mt-2">开始时间：</label> 
      <input v-model="affair.start" class="input is-small" placeholder="无限制">
      <label class="label mt-2">结束时间：</label> 
      <input v-model="affair.end" class="input is-small" placeholder="无限制">
      <label class="label mt-2">允许时长（秒）：</label> 
      <input v-model="affair.duration" class="input is-small" placeholder="无限制">
      <div class="buttons mt-4">
        <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit">提交事务信息</button>
        <button class="button is-small is-danger" :class="{ 'is-loading': loading }" @click="remove">删除事务</button>
      </div>
    </div>
    <div class="box" v-if="affair">
      <h2 class="title is-5">事务变量</h2>
      <p>Under development</p>
    </div>
    <div class="box" v-if="data">
      <h2 class="title is-5">事务数据</h2>
      <item v-for="d in data" :id="d" type="data">{{ d.replace(`${id}.P:`, '组件 ') }}</item>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { affairs, groups, token, SS } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import Item from '../components/Item.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

ref: loading = false

ref: affair = null
ref: data = null
const id = computed(() => route.params.id == 'NEW' ? md5(Math.random()) : route.params.id)
const title = computed(() => route.params.id == 'NEW'
  ? '创建新事务'
  : affair ? affair.title : '正在载入...'
)
const displayGroups = computed(() => {
  const res = []
  for (const g in groups.value) {
    let useful = true
    for (const s of affair.groups) {
      if (g.indexOf(s) == 0 && g != s) {
        useful = false
        break
      }
    }
    if (useful) res.push(g)
  }
  return res
})

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  window.close()
}

function getAffair () {
  axios.get('/affair?affair=' + id.value, token())
    .then(({ data }) => {
      affair = data
      affair.groups = affair.groups.split(',')
      SS['affair' + id] = JSON.stringify(data)
    })
    .catch(catchErr)
  axios.get('/data?affair=' + id.value, token())
    .then(res => {
      data = res.data
      SS['data' + id] = data.join(',')
    })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getAffair()
else affair = {}

async function submit () {
}

async function remove () {
}

</script>
