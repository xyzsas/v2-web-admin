<template>
  <div class="p-4">
    <h1 class="title is-4" style="margin-bottom: 5px;">用户 - {{ title }}</h1>
    <code>{{ id }}</code>
    <div class="box" v-if="user" style="margin-top: 20px;">
      <label class="label">姓名：</label>
      <input v-model="user.name" class="input is-small">
      <label class="label mt-2">用户组：</label>
      <input v-model="user.group" class="input is-small">
      <label class="label mt-2">角色：</label> 
      <input v-model="user.role" class="input is-small" :style="{ color: user.role == 'ADMIN' ? 'red' : 'black' }">
      <div class="buttons mt-4">
        <button class="button is-small is-primary">提交修改信息</button>
        <button class="button is-small is-danger">删除用户</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()

ref: id = route.params.id
ref: user = null

const title = computed(() => user ? user.name : '正在载入...')

const SS = window.sessionStorage
if (!SS.token || SS.role != 'ADMIN') window.close()
const opt = { headers: { token: SS.token } }

const catchErr = e => Swal.fire('错误', e.response ? e.response.data : e, 'error')

function getUser () {
  axios.get('/user?user=' + id, opt)
    .then(({ data }) => { user = data })
    .catch(catchErr)
}

getUser()

</script>

<style scoped>
input {
  font-weight: bold;
}
</style>
