<template>
  <div class="container">
    <h1 class="title is-spaced">您好，管理员{{ SS.name }}</h1>
    <p class="subtitle is-6">用户组：<code>{{SS.group}}</code></p>
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
        <button class="button is-primary">用户组</button>
        <button class="button">添加用户</button>
        <button class="button">...</button>
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
      <div class="panel-block" v-for="(v, k) in affairs">
        <item type="affair" :id="k">{{ v }}</item>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import Item from '../components/Item.vue'

const SS = window.sessionStorage
const LS = window.localStorage
const opt = { headers: { token: SS.token } }

ref: groups = {}
ref: users = {}
ref: affairs = {}

ref: query = ''
const searchResult = computed(() => {
  const res = []
  if (!query) return res
  for (const g in groups) {
    if (!g.indexOf(query)) res.push({ type: 'group', group: g, id: g })
  }
  for (const u in users) {
    if (!u.indexOf(query) || u == md5(query.toUpperCase()) || users[u][0].indexOf(query) >= 0) res.push({ type: 'user', id: u, title: users[u][0], group: users[u][1] })
  }
  for (const a in affairs) {
    if (!a.indexOf(query) || affairs[a].indexOf(query) >= 0) res.push({ type: 'affair', id: a, title: affairs[a] })
  }
  return res
})

ref: loading = '正在载入用户数据 ...'
async function init () {
  if (!SS.token) {
    window.location.href = '/#/login?c=/admin/'
    return
  } else if (SS.role != 'ADMIN') {
    window.location.href = '/#/'
    return
  }
  try {
    const res = await axios.get('/user?hash=' + md5(LS.userdata), opt)
    if (res.status == 200) LS.userdata = JSON.stringify(res.data)
    else res.data = JSON.parse(LS.userdata)
    groups = { [SS.group]: 1 }
    users = {}
    for (const g in res.data) {
      const group = res.data[g]
      for (let i = SS.group.length; i < group.length; i++) {
        if (group[i] == '/') groups[group.substr(0, i)] = 1
      }
      for (const u in group) {
        users[u] = [group[u], g]
      }
    }

    loading = '正在载入事务数据 ...'
    const { data } = await axios.get('/affair', opt)
    affairs = data
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