<template>
  <div class="container">
    <h1 class="title is-spaced">您好，管理员{{ state.SS.name }}</h1>
    <p class="subtitle is-6">用户组：<code>{{ state.SS.group }}</code></p>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon is-left">
          <i class="mdi mdi-24px mdi-magnify"></i>
        </span>
        {{ loading || '全局搜索' }}
      </p>
      <div class="panel-block">
        <input class="input is-primary" type="text" v-model="query" placeholder="事务，姓名，用户名，用户组 ...">
      </div>
      <div class="panel-block" v-for="r in searchResult">
        <item :type="r.type" :id="r.id">
          {{ r.title }}
          <code v-if="r.group">{{ r.group }}</code>
        </item>
      </div>
    </nav>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-account"></i>
        </span>
        {{ loading || '用户管理' }}
      </p>
      <div class="panel-block buttons" style="margin: 0;">
        <button class="button" @click="go('/group/' + encodeURIComponent(state.SS.group))">用户组</button>
        <button class="button" @click="go('/user/NEW')">添加用户</button>
        <button class="button" @click="go('/batch', 700)">批量操作</button>
      </div>
      <div class="panel-block buttons" style="margin: 0;">
        <button class="button is-info" @click="go('/msg')">发布消息</button>
      </div>
      <div class="panel-block">备注：用户默认密码为<code>XYZSAS</code></div>
    </nav>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-package-variant-closed"></i>
        </span>
        {{ loading || '事务管理' }}
      </p>
      <div class="panel-block">
        <button class="button is-primary" @click="go('/affair/NEW', 1000)">创建新事务</button>
      </div>
      <div class="panel-block" v-for="(v, k) in state.affairs.value">
        <item type="affair" :id="k">{{ v }}</item>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import * as state from '../plugins/state.js'
import Item from '../components/Item.vue'

ref: query = ''
const searchResult = computed(() => {
  const res = []
  const m = md5(query.toUpperCase())
  if (!query) return res
  for (const g in state.groups.value) {
    if (!g.indexOf(query)) res.push({ type: 'group', title: '用户组', group: g, id: g })
  }
  for (const u in state.users.value) {
    if (!u.indexOf(query) || u == m || state.users.value[u][0].indexOf(query) >= 0) res.push({ type: 'user', id: u, title: state.users.value[u][0], group: state.users.value[u][1] })
  }
  for (const a in state.affairs.value) {
    if (!a.indexOf(query) || state.affairs.value[a].indexOf(query) >= 0) res.push({ type: 'affair', id: a, title: state.affairs.value[a] })
  }
  return res
})

const go = (r, w = 360) => {
  window.open('./#' + r, r, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=10000,height=600,width=' + w)
}

ref: loading = ''
async function init () {
  if (!state.SS.token) {
    window.location.href = '/#/login?c=/admin/'
    return
  } else if (state.SS.role != 'ADMIN') {
    window.location.href = '/#/'
    return
  }
  try {
    loading = '正在载入事务数据 ...'
    const { data } = await axios.get('/affair/', state.token())
    state.affairs.value = data

    loading = '正在载入用户数据 ...'
    const res = await axios.get('/user/?hash=' + md5(state.LS.userdata), state.token())
    if (res.status == 200) state.userdata.value = res.data
    loading = ''
  } catch (e) {
    console.log(e)
    loading = e.response ? e.response.data : '网络错误'
    Swal.fire('错误', loading, 'error')
  }
}

init()
</script>

<style scoped>
div.container {
  padding: 5%;
}
</style>