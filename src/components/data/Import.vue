<template>
  <div class="is-fullwidth">
    <h1 class="title is-4" style="margin-bottom: 5px;">添加事务数据</h1>
    <input class="input is-small" type="text" v-model="name" placeholder="数据名称，请输入英文">
    <textarea class="textarea has-fixed-size is-small mt-3 mb-3" rows="3" v-model="input" placeholder="从Excel中复制的事务信息，包括表头，第一列为id" :disabled="loading"></textarea>
    <button class="button is-primary is-small" :disabled="!name" :class="{ 'is-loading': loading }" @click="submit">提交</button>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import axios from '../../plugins/axios.js'
import { token } from '../../plugins/state.js'

const props = defineProps(['id'])
const emits = defineEmits(['update'])

let input = $ref('')
let loading = $ref(false)
let name = $ref('')

async function submit () {
  const data = {}
  const rows = input.split('\n')
  const labels = rows[0].split('\t')
  if (labels.length < 2) {
    Swal.fire('数据错误', '至少需要两列', 'error')
    return
  }
  for (let j = 1; j < rows.length; j++) {
    const r = rows[j].split('\t')
    if (r.length < 2) continue
    if (r.length == 2) data[r[0]] = r[1]
    else {
      const obj = {}
      for (let i = 1; i < labels.length; i++) obj[labels[i]] = r[i]
      data[r[0]] = JSON.stringify(obj)
    }
  }
  loading = true
  const res = await axios.post(`/data/${props.id}$${name}`, data, token())
    .then(() => true)
    .catch(e => {
      Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
      return false
    })
  loading = false

  if (!res) return
  Swal.fire('上传成功', '', 'success')
  emits('edit', `${props.id}$${name}`)
}

</script>

<style scoped>
</style>
