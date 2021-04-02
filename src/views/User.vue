<template>
  <div class="p-4">
    <h1 class="title is-4" style="margin-bottom: 5px;">用户 - {{ title }}</h1>
    <code class="is-inline-block mb-4">{{ id }}</code>
    <div class="box" v-if="user">
      <template v-if="route.params.id == 'NEW'">
        <label class="label">登录用户名：</label>
        <input v-model="username" class="input is-small">
      </template>
      <label class="label mt-2">姓名：</label>
      <input v-model="user.name" class="input is-small">
      <label class="label mt-2">用户组：</label>
      <input v-model="user.group" class="input is-small">
      <label class="label mt-2">角色：</label> 
      <input v-model="user.role" class="input is-small" :style="{ color: user.role == 'ADMIN' ? 'red' : 'black' }">
      <div class="buttons mt-4">
        <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit">提交用户信息</button>
        <button class="button is-small is-danger" :class="{ 'is-loading': loading }" @click="remove">删除用户</button>
      </div>
    </div>
    <div class="buttons">
      <button class="button is-small is-link" :class="{ 'is-loading': profileloading }" v-if="route.params.id != 'NEW' && !profile">载入用户档案</button>
      <button class="button is-small is-info" :class="{ 'is-loading': msgloading }" v-if="route.params.id != 'NEW' && !msgs" @click="getMsg">载入用户消息</button>
    </div>
    <div v-if="msgs">
      <h2 class="title is-5 mt-6">用户消息</h2>
      <div class="box" v-for="i in msgs">
        <div class="title is-4">{{ i[0] }}</div>
        <div class="subtitle is-6 mb-1">{{ i[1] }}</div>
        <a>{{ i[2] }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { SS, token, users, userdata } from '../plugins/state.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

ref: user = null
ref: username = ''
ref: loading = false
ref: msgs = null
ref: msgloading = false
ref: profile = null
ref: profileloading = false

const id = computed(() => route.params.id == 'NEW' ? username && md5(username.toUpperCase()) : route.params.id)
watch(users, v => {
  if (route.params.id != 'NEW' && !v[route.params.id]) setTimeout(window.close, 2000)
})

const title = computed(() => route.params.id == 'NEW'
  ? '创建新用户'
  : user ? user.name : '正在载入...'
)

if (!SS.token || SS.role != 'ADMIN') window.close()

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  window.close()
}

function getUser () {
  axios.get('/user?user=' + id.value, token())
    .then(({ data }) => { user = data })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getUser()
else user = {}

async function submit () {
  if (!id.value) return
  if (user.group.indexOf(SS.group) != 0 || user.group[user.group.length-1] != '/') {
    Swal.fire('用户组错误', '开头和结尾必须是<code>/</code><br>且在管理员权限内', 'error')
    return
  }
  loading = true
  await axios.post('/user', { [id.value]: user }, token())
    .then(({ data }) => {
      if (data.error[id.value]) {
        Swal.fire('错误', data.error[id.value], 'error')
      } else {
        Swal.fire('成功', '提交信息成功', 'success')
        const oldGroup = users.value[id.value] && users.value[id.value][1]
        if (oldGroup) delete userdata.value[oldGroup][id.value]
        if (userdata.value[user.group]) userdata.value[user.group][id.value] = user.name
        else userdata.value[user.group] = { [id.value]: user.name }
      }
    })
    .catch(catchErr)
  loading = false
}

async function remove () {
  if (!id.value) return
  loading = true
  await axios.delete('/user?user=' + id.value, token())
    .then(() => {
      Swal.fire('成功', '删除用户成功', 'success')
      if (userdata.value[user.group]) delete userdata.value[user.group][id.value]
    })
    .catch(catchErr)
  loading = false
}

async function getMsg() {
  msgloading = true
  await axios.get('/msg?user=' + id.value, token())
    .then(({ data }) => { msgs = data.map(x => x.split('$$')) })
    .catch(catchErr)
  msgloading = false
}
</script>

<style scoped>
input {
  font-weight: bold;
}
</style>
