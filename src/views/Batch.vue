<template>
  <div class="p-4">
    <h1 class="title is-4" style="margin-bottom: 5px;">用户 - 批量创建</h1>
    <div class="box" style="margin-top: 20px;">
      <textarea class="textarea" v-model="input" placeholder="从excel中复制用户信息"></textarea>
      <button class="button is-primary is-right" @click="submit" style="float: right; margin-top: 5px">批量提交</button>
      <table class="table is-fullwidth" style="margin-top: 10px">
        <thead>
          <th>登陆用户名</th>
          <th>姓名</th>
          <th>用户组</th>
          <th>角色</th>
        </thead>
        <tbody>
          <tr v-for="r in users" :key="r.username">
            <td>{{ r.username }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.group }}</td>
            <td>{{ r.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
ref: input = ""

const users = computed (() => {
  const res = []
  const rows = input.split('\n')
  for (const r in rows) {
    const info = rows[r].split('\t')
    res.push({ 'username': info[0], 'name': info[1], 'group': info[2], 'role': info[3] })
  }
  return res
})

function submit () {}

</script>