<template>
  <div class="p-4">
    <div class="tile is-ancestor message">
      <div class="tile is-parent is-vertical is-7">
        <div class="tile is-child">
          <h1 class="title is-4 mb-1">消息</h1>
        </div>
        <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit" style="margin-bottom: 5px;">提交</button>
        <div class="tile is-child box">
          <h3 class="title is-6 mb-5" style="margin-bottom: 5px;">选择用户组</h3>
          <div class="select is-small is-multiple">
            <select multiple size="4" v-model="select" style="width: 100vh;">
              <option v-for="g in displayGroups">{{ g }}</option>
            </select>
            <p class="mb-2">电脑端请按住<code>Ctrl</code>键点击选择</p>
          </div><br>
          <b>已选择：</b>
          <div v-for="i in select">
            {{ i }}
          </div>
        </div>
        <div class="tile is-child box">
          <label class="label mt-2">导入数据</label>
          <textarea class="textarea has-fixed-size is-small mt-3 mb-5" rows="3" v-model="input" placeholder="从Excel中复制的用户信息，按照下列顺序，无需表头" :disabled="loading"></textarea>
        </div>
        <div class="tile is-child box">
          <label class="label mt-2">标题：</label>
          <input v-model="title" class="input is-small">
          <label class="label mt-2">副标题：</label>
          <input v-model="subtitle" class="input is-small">
          <label class="label mt-2">链接：</label>
          <input v-model="link" class="input is-small">
          <h3 class="title is-6">持续时间（秒）</h3>
          <input class="input is-small" v-model="second">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { groups, userdata, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
}

ref: expand = {}
ref: select = {}
ref: title = ''
ref: subtitle = ''
ref: link = ''
ref: second = 0
ref: loading = false
ref: input = ''

const displayGroups = computed(() => {
  const res = []
  for (const g in groups.value) res.push(g)
  return res
})

async function submit () {
  if (!title) {
    Swal.fire('缺少标题', '', 'error')
    return
  }
  loading = true
  const body = {}
  body.users = []
  for (const g in select) {
    for (const uid in userdata.value[select[g]]) body.users.push(uid)
  }
  const data = input.split('\n')
  for (const uid of data) body.users.push(uid)
  if (!body.users[0]) {
    Swal.fire('缺少用户', '请检查用户组内有无用户，导入数据是否合法', 'error')
    loading = false
    return
  }
  body.id = Date.now()
  body.msg = title + '$$' + subtitle + '$$' + link
  body.duration = second
  console.log(body.users)
  await axios.post('/msg', body, token())
    .then(() => { 
      Swal.fire('成功', '', 'success')
        .then((r) => {
          if (r.isConfirmed) window.close()
        })
    })
    .catch(catchErr)
}

</script>

<style scoped>
input {
  font-weight: bold;
}
</style>