<template>
  <div style="min-width: 320px;">
    <h1 class="title is-4" style="margin-bottom: 5px;">用户 - {{ title }}</h1>
    <code class="is-inline-block mb-4">{{ id }}</code>
    <div class="box" v-if="user">
      <template v-if="p.id == 'NEW'">
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
    <div v-if="p.id == 'NEW'" style="position: relative;">
      <h2 class="title is-5 mt-6">用户扫码设置初始密码</h2>
      <qrcode-vue :value="qrurl" :size="200"></qrcode-vue>
      <img src="/img/logo.svg" class="qrlogo">
    </div>
    <div class="buttons" v-if="p.id != 'NEW'">
      <button class="button is-small is-warning" v-if="user && user.role != 'ADMIN'" @click="possesion" :class="{ 'is-loading': possesionloading }">以此用户身份登录</button>
      <button class="button is-small is-info" :class="{ 'is-loading': msgloading }" @click="getMsg">载入用户消息</button>
    </div>
    <div v-if="msgs">
      <h2 class="title is-5 mt-6">用户消息</h2>
      <p v-if="Object.keys(msgs).length === 0">暂无消息</p>
      <div class="box" v-for="(m, id) in msgs">
        <div class="title is-4 m-0">
          {{ m.msg[0] }}
          <button class="button is-danger is-small is-light" color="error" @click="removeMsg(m, id)"><span class="icon"><i class="mdi mdi-18px mdi-trash-can-outline"></i></span></button>
        </div>
        <code>{{ m.entity }}</code>
        <div class="subtitle is-6 mb-1">{{ m.msg[1] }}</div>
        <a>{{ m.msg[2] }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, defineProps } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { U, US, userdata, token } from '../plugins/state.js'
import QrcodeVue from 'qrcode.vue'
const { p, i:self } = defineProps(['p', 'i'])

let user = $ref({})
let username = $ref('')
let loading = $ref(false)
let msgs = $ref(null)
let msgloading = $ref(false)
let possesionloading = $ref(false)
let removeMsgLoading = $ref(false)

const id = computed(() => p.id == 'NEW' ? username && md5(username.toUpperCase()) : p.id)
watch(US, v => {
  if (p.id != 'NEW' && !v[p.id]) setTimeout(() => { window.close(self) }, 2000)
})
watch(() => user.group, v => {
  if (!v || v.indexOf(U.group) !== 0) user.group = U.group
})

const qrurl = computed(() => window.location.origin + '/#/password?id=' + id.value)

const title = computed(() => p.id == 'NEW'
  ? '创建新用户'
  : user ? user.name : '正在载入...'
)

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!user) window.close()
  return false
}

function getUser () {
  axios.get('/user/' + id.value, token())
    .then(({ data }) => { user = data })
    .catch(catchErr)
}

if (p.id != 'NEW') getUser()
else user.group = U.group

async function submit () {
  if (!id.value) return
  if (user.group.indexOf(U.group) != 0 || user.group[user.group.length-1] != '/') {
    Swal.fire('用户组错误', '开头和结尾必须是<code>/</code>', 'error')
    return
  }
  loading = true
  await axios.post('/user/', { [id.value]: user }, token())
    .then(({ data }) => {
      if (data.error[id.value]) {
        Swal.fire('错误', data.error[id.value], 'error')
      } else {
        Swal.fire('成功', '提交信息成功', 'success')
        const oldGroup = US.value[id.value] && US.value[id.value][1]
        if (oldGroup) delete userdata.value[oldGroup][id.value]
        if (userdata.value[user.group]) userdata.value[user.group][id.value] = user.name
        else userdata.value[user.group] = { [id.value]: user.name }
      }
    })
    .catch(catchErr)
  loading = false
}

async function removeConfirmation (msg) {
  const res = await Swal.fire({
    title: '危险操作',
    html: msg,
    icon: 'warning',
    focusCancel: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  })
  return res.isConfirmed
}
async function remove () {
  if (!id.value || !await removeConfirmation('确定要删除此用户吗？')) return
  loading = true
  await axios.delete('/user/' + id.value, token())
    .then(() => {
      Swal.fire('成功', '删除用户成功', 'success')
      if (userdata.value[user.group]) delete userdata.value[user.group][id.value]
    })
    .catch(catchErr)
  loading = false
}

async function getMsg () {
  msgloading = true
  await axios.get('/msg/' + id.value, token())
    .then(({ data }) => {
      for (const k in data) data[k].msg = data[k].msg.split('$$')
      msgs = data
      console.log(data)
    })
    .catch(catchErr)
  msgloading = false
}

async function removeMsg (m, id) {
  if (!await removeConfirmation('确定要删除此消息吗？')) return
  removeMsgLoading = true
  await axios.delete(`/msg/${id}?entity=${m.entity}`, token())
    .then((res) => {
      Swal.fire('成功', '删除消息成功', 'success')
      getMsg()
    })
    .catch(catchErr)
  removeMsgLoading = false
}

async function possesion () {
  if (!user) return
  possesionloading = true
  const res = await axios.put('/user/' + user.id, {}, token())
    .then(({ data }) => data)
    .catch(catchErr)
  possesionloading = false
  if (!res) return
  window.open(`${window.location.origin}/#/?user=${encodeURIComponent(JSON.stringify(res.user))}&token=${res.token}`, '/possesion/' + user.id, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=0,height=600,width=360')
}
</script>

<style scoped>
input {
  font-weight: bold;
}
.qrlogo {
  position: absolute;
  background-color: white;
  width: 40px;
  left: 80px;
  bottom: 85px;
}
</style>
