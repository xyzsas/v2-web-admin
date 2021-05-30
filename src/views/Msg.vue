<template>
  <div>
    <h1 class="title is-4 mb-2">消息 - 发布</h1>
    <div class="box p-2">
      <template v-if="!byUser">
        <label class="label">选择用户组</label>
        <group-selector v-model="groups"></group-selector>
      </template>
      <label class="checkbox">
        <input v-model="byUser" type="checkbox">
        手动导入用户列表
      </label>
      <textarea v-if="byUser" class="textarea has-fixed-size is-small mt-3 mb-5" rows="4" v-model="input" placeholder="每行一个用户名或用户id" :disabled="loading"></textarea>
    </div>
    <div class="box">
      <label class="label mt-2">消息id：</label>
      <input v-model="id" class="input is-small" placeholder="请输入消息id">
      <p style="font-size: 0.7rem;">同样id的消息将会覆盖</p>
      <label class="label mt-2">消息标题：</label>
      <input v-model="title" class="input is-small" placeholder="无标题">
      <label class="label mt-2">消息副标题：</label>
      <input v-model="subtitle" class="input is-small" placeholder="无副标题">
      <label class="label mt-2">消息链接：</label>
      <input v-model="link" class="input is-small" placeholder="无连接">
      <label class="label mt-2">持续时间（秒）：</label>
      <input class="input is-small" v-model="duration" placeholder="默认：7天">
    </div>
    <button @click="submit" class="button is-primary" :class="{ 'is-loading': loading }" :disabled="!title">发布消息</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { US, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import GroupSelector from '../components/GroupSelector.vue'
const { p } = defineProps(['p'])

ref: byUser = false
ref: loading = false
ref: id = p.id || md5(Math.random().toString())
ref: groups = p.groups || ''
ref: title = p.title || ''
ref: subtitle = p.subtitle || ''
ref: link = p.link || ''
ref: duration = p.duration || ''
ref: input = ''

async function submit () {
  loading = true
  const body = { msg: title + '$$' + subtitle + '$$' + link}
  let entities = []
  if (duration) body.duration = duration
  if (byUser) {
    const t = input.split('\n')
    for (const u of t) {
      if (US.value[u]) entities.push(u)
      const m = md5(u.toUpperCase())
      if (US.value[m]) entities.push(m)
    }
  } else entities = groups.split(',')
  for (let i = 0; i < entities.length; i += 100) {
    body.entities = entities.slice(i, i+100)
    try {
      await axios.post('/msg/' + id, body, token())
    } catch (e) {
      console.log(e)
      Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
      return
    }
  }
  loading = false
  await Swal.fire('发布消息成功', `共计${entities.length}个用户/用户组`, 'success')
  window.close()
}
</script>
