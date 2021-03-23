<template>
  <div class="p-4" style="min-width: 650px;">
    <h1 class="title is-4" style="margin-bottom: 5px;">批量操作用户</h1>
    <textarea class="textarea has-fixed-size is-small mt-3 mb-5" rows="3" v-model="input" placeholder="从Excel中复制的用户信息，按照下列顺序，无需表头" :disabled="loading"></textarea>
    <h1 class="title is-5 is-flex is-align-items-center">
      等待提交的用户信息
      <button class="button is-primary is-small ml-3" :class="{ 'is-loading': loading }" @click="submit">提交全部</button>
    </h1>
    <table class="table is-fullwidth">
      <thead>
        <th>用户名</th>
        <th>用户组</th>
        <th>姓名</th>
        <th>角色</th>
        <th>重置密码</th>
        <th>状态/错误</th>
      </thead>
      <tbody>
        <tr v-for="(r, u) in display" :key="u">
          <td>{{ u }}</td>
          <td><code>{{ r.group }}</code></td>
          <td>{{ r.name }}</td>
          <td>{{ r.role }}</td>
          <td>{{ r.password }}</td>
          <td :class="{ 'error': error[r.id] }">{{ error[r.id] || '等待提交' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { token, users, userdata } from '../plugins/state.js'
ref: input = ''
ref: loading = false
ref: error = {}
ref: success = {}

const display = computed (() => {
  const res = {}
  const rows = input.split('\n')
  for (const r of rows) {
    const info = r.split('\t')
    if (info.length < 2) continue
    const u = info[0].toUpperCase()
    const id = md5(u)
    if (success[id]) continue
    res[u] = {
      id: id,
      group: info[1] || undefined,
      name: info[2] || undefined,
      role: info[3] || undefined,
      password: info[4] || undefined
    }
  }
  return res
})

async function submit () {
  const list = Object.keys(display.value)
  if (!list.length) return
  let allSuccess = true
  loading = true
  for (let i = 0; i < list.length; i += 100) {
    const body = {}
    for (let j = 0; j < 100; j++) {
      const u = display.value[list[i + j]]
      if (!u) break
      body[u.id] = { group: u.group, name: u.name, role: u.role, password: u.password }
    }
    const res = await axios.post('/user', body, token())
      .then(({ data }) => {
        for (let j = 0; j < 100; j++) {
          const u = display.value[list[i + j]]
          if (!u) break
          if (data.error[u.id]) {
            error[u.id] = data.error[u.id]
            allSuccess = false
          } else {
            success[u.id] = true
            // update localstorage
            // these lines are exactly the same as in the Back end
            const dels = []
            if (users.value[u.id] && u.group && u.group != users.value[u.id][1]) dels.push({ group: users.value[u.id][1], id: u.id })
            if (!users.value[u.id] || (u.group && u.group != users.value[u.id][1]) || (u.name && u.name != users.value[u.id][0])) {
              const gr = u.group || users.value[u.id][1]
              if (!userdata.value[gr]) userdata.value[gr] = {}
              userdata.value[gr][u.id] = u.name || users.value[u.id][0]
            }
            for (const d of dels) delete userdata.value[d.group][d.id]
          }
        }
        return true
      })
      .catch(e => {
        console.log(e)
        Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
        allSuccess = false
        return false
      })
    if (!res) break
  }
  if (allSuccess) {
    Swal.fire('全部成功', '两秒后自动关闭', 'success')
    setTimeout(window.close, 2000)
  } else loading = false
}

</script>

<style scoped>
.error {
  color: red;
}
</style>
