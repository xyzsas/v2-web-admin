<template>
  <div class="home">
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
        <button class="button" @click="go('group', { id: U.group })">用户组</button>
        <button class="button" @click="go('user', { id: 'NEW' })">添加用户</button>
        <button class="button" @click="go('batch')">批量操作</button>
      </div>
      <div class="panel-block buttons" style="margin: 0;">
        <button class="button is-info" @click="go('msg')">发布消息</button>
        <button class="button" @click="go('photo')">下载照片</button>
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
        <button class="button is-primary" @click="go('affair', { id: 'NEW' })">创建新事务</button>
      </div>
      <div class="panel-block" v-for="(v, k) in AS">
        <item type="affair" :id="k">{{ v }}</item>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { GS, AS, US, LS, U, userdata, token } from '../plugins/state.js'
import Item from '../components/Item.vue'

ref: query = ''
const searchResult = computed(() => {
  const res = []
  const m = md5(query.toUpperCase())
  if (!query) return res
  for (const g in GS.value) {
    if (!g.indexOf(query)) res.push({ type: 'group', title: '用户组', group: g, id: g })
  }
  for (const u in US.value) {
    if (!u.indexOf(query) || u == m || US.value[u][0].indexOf(query) >= 0) res.push({ type: 'user', id: u, title: US.value[u][0], group: US.value[u][1] })
  }
  for (const a in AS.value) {
    if (!a.indexOf(query) || AS.value[a].indexOf(query) >= 0) res.push({ type: 'affair', id: a, title: AS.value[a] })
  }
  return res
})

const go = (v, p) => {
  window.show(v, p)
}

ref: loading = ''
async function init () {
  if (!U) {
    window.location.href = '/#/login?c=/admin/'
    return
  } else if (U.role != 'ADMIN') {
    window.location.href = '/#/'
    return
  }
  try {
    loading = '正在载入事务数据 ...'
    const { data } = await axios.get('/affair/', token())
    AS.value = data

    loading = '正在载入用户数据 ...'
    const res = await axios.get('/user/?hash=' + md5(LS.userdata), token())
    if (res.status == 200) userdata.value = res.data
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
div.home {
  padding: 3%;
  width:  100%;
  min-width: 320px;
}
</style>